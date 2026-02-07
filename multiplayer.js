// Multiplayer Yöneticisi
class MultiplayerManager {
    constructor() {
        this.socket = null;
        this.roomId = null;
        this.playerName = null;
        this.isHost = false;
        this.connected = false;
        console.log('MultiplayerManager oluşturuldu');
    }

    connect() {
        // Socket.io bağlantısı - production ve localhost için
        const socketUrl = window.location.origin;
        console.log('Socket.io bağlanıyor:', socketUrl);
        
        this.socket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });
        
        this.socket.on('connect', () => {
            console.log('✅ Sunucuya bağlandı:', socketUrl);
            this.connected = true;
        });

        this.socket.on('disconnect', () => {
            console.log('Bağlantı koptu');
            this.connected = false;
        });

        // Oda oluşturuldu
        this.socket.on('roomCreated', ({ roomId, room }) => {
            console.log('✅ Oda oluşturuldu!', roomId, room);
            this.roomId = roomId;
            this.isHost = true;
            this.showLobby(room);
        });

        // Oda güncellendi
        this.socket.on('roomUpdate', (room) => {
            console.log('📢 Oda güncellendi:', room);
            // Eğer lobby yoksa göster
            if (!document.getElementById('multiplayer-lobby')) {
                console.log('Lobby yok, gösteriliyor...');
                this.showLobby(room);
            } else {
                console.log('Lobby güncelleniyor...');
                this.updateLobby(room);
            }
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
        console.log('Oda oluşturuluyor:', playerName);
        if (!this.connected) {
            alert('Sunucuya bağlanılamadı! Sayfa yenileniyor...');
            setTimeout(() => window.location.reload(), 1000);
            return;
        }
        this.playerName = playerName;
        console.log('createRoom emit ediliyor...');
        this.socket.emit('createRoom', playerName);
    }

    joinRoom(roomId, playerName) {
        console.log('Odaya katılınıyor:', roomId, playerName);
        if (!this.connected) {
            console.error('Socket bağlı değil!');
            alert('Sunucuya bağlanılamadı! Sayfa yenileniyor...');
            setTimeout(() => window.location.reload(), 1000);
            return;
        }
        this.playerName = playerName;
        this.roomId = roomId;
        console.log('joinRoom emit ediliyor...');
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
        console.log('🎮 Lobby gösteriliyor:', room);
        
        // Başlangıç ekranını gizle
        const startScreen = document.getElementById('start-screen');
        if (startScreen) {
            startScreen.classList.add('hidden');
            console.log('Başlangıç ekranı gizlendi');
        }
        
        // Eğer lobby zaten varsa, sadece güncelle
        if (document.getElementById('multiplayer-lobby')) {
            console.log('Lobby zaten var, güncelleniyor...');
            this.updateLobby(room);
            return;
        }
        
        console.log('Lobby HTML oluşturuluyor...');
        const lobbyHTML = `
            <div id="multiplayer-lobby" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                background: rgba(20, 15, 10, 0.98); padding: 40px; border: 3px solid #d4af37; z-index: 10000; 
                min-width: 500px; max-width: 90%; box-shadow: 0 0 50px rgba(212, 175, 55, 0.5);">
                <h2 style="color: #d4af37; margin-bottom: 20px; text-align: center; font-size: 28px;">
                    🎮 Oda: ${this.roomId}
                </h2>
                <p style="color: #fff; text-align: center; margin-bottom: 20px; font-size: 14px;">
                    Bu kodu arkadaşlarınla paylaş!
                </p>
                
                <div id="players-list" style="margin-bottom: 30px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px;">
                    <!-- Oyuncular buraya eklenecek -->
                </div>
                
                <div id="faction-selection-lobby" style="margin-bottom: 20px;">
                    <h3 style="color: #d4af37; margin-bottom: 15px; text-align: center;">Faksiyonunu Seç:</h3>
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="multiplayerManager.selectFaction('MUSLIM')" 
                            style="padding: 15px 25px; background: #2d5016; color: white; border: 2px solid #d4af37; 
                            cursor: pointer; font-size: 16px; font-weight: bold;">
                            Müslümanlar
                        </button>
                        <button onclick="multiplayerManager.selectFaction('CHRISTIAN')" 
                            style="padding: 15px 25px; background: #1a3a52; color: white; border: 2px solid #d4af37; 
                            cursor: pointer; font-size: 16px; font-weight: bold;">
                            Hristiyanlar
                        </button>
                        <button onclick="multiplayerManager.selectFaction('JEWISH')" 
                            style="padding: 15px 25px; background: #4a3c2a; color: white; border: 2px solid #d4af37; 
                            cursor: pointer; font-size: 16px; font-weight: bold;">
                            Yahudiler
                        </button>
                    </div>
                </div>
                
                ${this.isHost ? `
                    <button id="start-game-btn" onclick="multiplayerManager.startGameFromLobby()" 
                        style="width: 100%; padding: 15px; background: #d4af37; color: #1a1410; border: none; 
                        cursor: pointer; font-size: 18px; font-weight: bold;" disabled>
                        ⏳ Oyunu Başlat (Herkes hazır olmalı)
                    </button>
                ` : '<p style="color: #d4af37; text-align: center; font-size: 16px; padding: 15px; background: rgba(212,175,55,0.1);">⏳ Oda sahibinin oyunu başlatmasını bekleyin...</p>'}
            </div>
        `;
        
        console.log('Lobby HTML ekleniyor...');
        document.body.insertAdjacentHTML('beforeend', lobbyHTML);
        console.log('Lobby eklendi, güncelleniyor...');
        this.updateLobby(room);
    }

    updateLobby(room) {
        console.log('🔄 Lobby güncelleniyor:', room);
        const playersList = document.getElementById('players-list');
        if (!playersList) {
            console.error('❌ players-list bulunamadı!');
            return;
        }
        
        playersList.innerHTML = '<h3 style="color: #d4af37; margin-bottom: 10px; font-size: 18px;">👥 Oyuncular:</h3>';
        
        room.players.forEach((player, index) => {
            const factionName = player.faction ? CONFIG.FACTIONS[player.faction].shortName : '❓ Seçilmedi';
            const readyStatus = player.ready ? '✅' : '⏳';
            const factionColor = player.faction ? 
                (player.faction === 'MUSLIM' ? '#2d5016' : 
                 player.faction === 'CHRISTIAN' ? '#1a3a52' : '#4a3c2a') : '#666';
            
            playersList.innerHTML += `
                <div style="padding: 12px; margin: 8px 0; background: rgba(212, 175, 55, 0.1); 
                    border-left: 4px solid ${factionColor}; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="color: #d4af37; font-size: 18px; margin-right: 10px;">${readyStatus}</span>
                        <span style="color: white; font-weight: bold; font-size: 16px;">${player.name}</span>
                    </div>
                    <span style="color: #999; font-size: 14px;">${factionName}</span>
                </div>
            `;
        });
        
        console.log(`✅ ${room.players.length} oyuncu listelendi`);
        
        // Başlat butonunu aktifleştir
        if (this.isHost) {
            const startBtn = document.getElementById('start-game-btn');
            if (startBtn) {
                const allReady = room.players.every(p => p.ready);
                startBtn.disabled = !allReady || room.players.length < 1;
                if (allReady && room.players.length >= 1) {
                    startBtn.textContent = '🚀 Oyunu Başlat!';
                    startBtn.style.background = '#2d5016';
                    console.log('✅ Oyun başlatılabilir!');
                } else {
                    startBtn.textContent = `⏳ Oyunu Başlat (${room.players.filter(p => p.ready).length}/${room.players.length} hazır)`;
                    startBtn.style.background = '#666';
                }
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
console.log('Multiplayer sistemi yükleniyor...');
const multiplayerManager = new MultiplayerManager();

// Sayfa yüklendiğinde bağlan
window.addEventListener('DOMContentLoaded', () => {
    console.log('Sayfa yüklendi, Socket.io bağlanıyor...');
    multiplayerManager.connect();
});
