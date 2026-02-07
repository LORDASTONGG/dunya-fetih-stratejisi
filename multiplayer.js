// Multiplayer Yöneticisi
class MultiplayerManager {
    constructor() {
        this.socket = null;
        this.roomId = null;
        this.playerName = null;
        this.isHost = false;
        this.connected = false;
    }

    connect() {
        // Socket.io bağlantısı - production ve localhost için
        const socketUrl = window.location.origin;
        this.socket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });
        
        this.socket.on('connect', () => {
            console.log('Sunucuya bağlandı:', socketUrl);
            this.connected = true;
        });

        this.socket.on('disconnect', () => {
            console.log('Bağlantı koptu');
            this.connected = false;
        });

        // Oda oluşturuldu
        this.socket.on('roomCreated', ({ roomId, room }) => {
            this.roomId = roomId;
            this.isHost = true;
            this.showLobby(room);
        });

        // Oda güncellendi
        this.socket.on('roomUpdate', (room) => {
            this.updateLobby(room);
        });

        // Oyun başladı
        this.socket.on('gameStarted', ({ room, gameState }) => {
            this.startMultiplayerGame(room, gameState);
        });

        // Oyun aksiyonu
        this.socket.on('gameAction', ({ playerId, action, data }) => {
            if (playerId !== this.socket.id) {
                this.handleRemoteAction(action, data);
            }
        });

        // Tur değişti
        this.socket.on('turnChanged', (turnNumber) => {
            if (window.game) {
                window.game.handleTurnChange(turnNumber);
            }
        });

        // Oyun durumu güncellendi
        this.socket.on('gameStateUpdate', (gameState) => {
            if (window.game) {
                window.game.syncGameState(gameState);
            }
        });

        // Oyuncu ayrıldı
        this.socket.on('playerLeft', ({ playerId, playerName }) => {
            alert(`${playerName} oyundan ayrıldı`);
        });

        // Hata
        this.socket.on('error', (message) => {
            console.error('Socket error:', message);
            alert('Hata: ' + message);
        });

        // Bağlantı hatası
        this.socket.on('connect_error', (error) => {
            console.error('Bağlantı hatası:', error);
            alert('Sunucuya bağlanılamadı! Sayfa yenileniyor...');
            setTimeout(() => window.location.reload(), 2000);
        });
    }

    createRoom(playerName) {
        this.playerName = playerName;
        this.socket.emit('createRoom', playerName);
    }

    joinRoom(roomId, playerName) {
        this.playerName = playerName;
        this.roomId = roomId;
        this.socket.emit('joinRoom', { roomId, playerName });
    }

    selectFaction(faction) {
        this.socket.emit('selectFaction', { 
            roomId: this.roomId, 
            faction 
        });
    }

    startGame(gameState) {
        this.socket.emit('startGame', { 
            roomId: this.roomId, 
            gameState 
        });
    }

    sendAction(action, data) {
        this.socket.emit('gameAction', { 
            roomId: this.roomId, 
            action, 
            data 
        });
    }

    nextTurn() {
        this.socket.emit('nextTurn', { roomId: this.roomId });
    }

    updateGameState(gameState) {
        this.socket.emit('updateGameState', { 
            roomId: this.roomId, 
            gameState 
        });
    }

    showLobby(room) {
        const lobbyHTML = `
            <div id="multiplayer-lobby" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                background: rgba(20, 15, 10, 0.98); padding: 40px; border: 3px solid #d4af37; z-index: 10000; min-width: 500px;">
                <h2 style="color: #d4af37; margin-bottom: 20px; text-align: center;">Oda: ${this.roomId}</h2>
                <p style="color: #fff; text-align: center; margin-bottom: 20px;">Bu kodu arkadaşlarınla paylaş!</p>
                
                <div id="players-list" style="margin-bottom: 30px;">
                    <!-- Oyuncular buraya eklenecek -->
                </div>
                
                <div id="faction-selection" style="margin-bottom: 20px;">
                    <h3 style="color: #d4af37; margin-bottom: 15px;">Faksiyonunu Seç:</h3>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button onclick="multiplayerManager.selectFaction('MUSLIM')" 
                            style="padding: 15px 25px; background: #2d5016; color: white; border: 2px solid #d4af37; cursor: pointer; font-size: 16px;">
                            Müslümanlar
                        </button>
                        <button onclick="multiplayerManager.selectFaction('CHRISTIAN')" 
                            style="padding: 15px 25px; background: #1a3a52; color: white; border: 2px solid #d4af37; cursor: pointer; font-size: 16px;">
                            Hristiyanlar
                        </button>
                        <button onclick="multiplayerManager.selectFaction('JEWISH')" 
                            style="padding: 15px 25px; background: #4a3c2a; color: white; border: 2px solid #d4af37; cursor: pointer; font-size: 16px;">
                            Yahudiler
                        </button>
                    </div>
                </div>
                
                ${this.isHost ? `
                    <button id="start-game-btn" onclick="multiplayerManager.startGameFromLobby()" 
                        style="width: 100%; padding: 15px; background: #d4af37; color: #1a1410; border: none; 
                        cursor: pointer; font-size: 18px; font-weight: bold;" disabled>
                        Oyunu Başlat
                    </button>
                ` : '<p style="color: #d4af37; text-align: center;">Oda sahibinin oyunu başlatmasını bekleyin...</p>'}
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', lobbyHTML);
        this.updateLobby(room);
    }

    updateLobby(room) {
        const playersList = document.getElementById('players-list');
        if (!playersList) return;
        
        playersList.innerHTML = '<h3 style="color: #d4af37; margin-bottom: 10px;">Oyuncular:</h3>';
        
        room.players.forEach((player, index) => {
            const factionName = player.faction ? CONFIG.FACTIONS[player.faction].shortName : 'Seçilmedi';
            const readyStatus = player.ready ? '✓' : '○';
            
            playersList.innerHTML += `
                <div style="padding: 10px; margin: 5px 0; background: rgba(212, 175, 55, 0.1); 
                    border-left: 3px solid ${player.ready ? '#2d5016' : '#666'};">
                    <span style="color: #d4af37;">${readyStatus}</span>
                    <span style="color: white; margin-left: 10px;">${player.name}</span>
                    <span style="color: #999; margin-left: 10px;">${factionName}</span>
                </div>
            `;
        });
        
        // Başlat butonunu aktifleştir
        if (this.isHost) {
            const startBtn = document.getElementById('start-game-btn');
            if (startBtn) {
                const allReady = room.players.every(p => p.ready);
                startBtn.disabled = !allReady || room.players.length < 1;
            }
        }
    }

    startGameFromLobby() {
        // Lobby'yi kapat
        const lobby = document.getElementById('multiplayer-lobby');
        if (lobby) lobby.remove();
        
        // Oyunu başlat
        if (window.game) {
            const gameState = window.game.getGameState();
            this.startGame(gameState);
            window.game.startMultiplayerMode();
        }
    }

    startMultiplayerGame(room, gameState) {
        // Lobby'yi kapat
        const lobby = document.getElementById('multiplayer-lobby');
        if (lobby) lobby.remove();
        
        // Oyunu başlat
        if (window.game) {
            window.game.loadGameState(gameState);
            window.game.startMultiplayerMode();
        }
    }

    handleRemoteAction(action, data) {
        if (!window.game) return;
        
        switch (action) {
            case 'attack':
                window.game.handleRemoteAttack(data);
                break;
            case 'transfer':
                window.game.handleRemoteTransfer(data);
                break;
            case 'build':
                window.game.handleRemoteBuild(data);
                break;
        }
    }
}

// Global multiplayer manager
const multiplayerManager = new MultiplayerManager();

// Sayfa yüklendiğinde bağlan
window.addEventListener('DOMContentLoaded', () => {
    multiplayerManager.connect();
});
