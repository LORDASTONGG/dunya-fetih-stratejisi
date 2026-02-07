const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Static dosyalar
app.use(express.static(__dirname));

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Oyun odaları
const rooms = new Map();

// Oda ID oluştur
function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Socket.io bağlantıları
io.on('connection', (socket) => {
    console.log('Yeni oyuncu bağlandı:', socket.id);

    // Oda oluştur
    socket.on('createRoom', (playerName) => {
        const roomId = generateRoomId();
        const room = {
            id: roomId,
            players: [{
                id: socket.id,
                name: playerName,
                faction: null,
                ready: false
            }],
            gameState: null,
            started: false,
            currentTurn: 0
        };
        
        rooms.set(roomId, room);
        socket.join(roomId);
        socket.emit('roomCreated', { roomId, room });
        console.log(`Oda oluşturuldu: ${roomId}`);
    });

    // Odaya katıl
    socket.on('joinRoom', ({ roomId, playerName }) => {
        const room = rooms.get(roomId);
        
        if (!room) {
            socket.emit('error', 'Oda bulunamadı');
            return;
        }
        
        if (room.started) {
            socket.emit('error', 'Oyun zaten başlamış');
            return;
        }
        
        if (room.players.length >= 3) {
            socket.emit('error', 'Oda dolu');
            return;
        }
        
        room.players.push({
            id: socket.id,
            name: playerName,
            faction: null,
            ready: false
        });
        
        socket.join(roomId);
        io.to(roomId).emit('roomUpdate', room);
        console.log(`${playerName} odaya katıldı: ${roomId}`);
    });

    // Faksiyon seç
    socket.on('selectFaction', ({ roomId, faction }) => {
        const room = rooms.get(roomId);
        if (!room) return;
        
        const player = room.players.find(p => p.id === socket.id);
        if (!player) return;
        
        // Faksiyon zaten seçilmiş mi kontrol et
        const factionTaken = room.players.some(p => p.id !== socket.id && p.faction === faction);
        if (factionTaken) {
            socket.emit('error', 'Bu faksiyon zaten seçilmiş');
            return;
        }
        
        player.faction = faction;
        player.ready = true;
        
        io.to(roomId).emit('roomUpdate', room);
        console.log(`${player.name} faksiyon seçti: ${faction}`);
    });

    // Oyunu başlat
    socket.on('startGame', ({ roomId, gameState }) => {
        const room = rooms.get(roomId);
        if (!room) return;
        
        const player = room.players.find(p => p.id === socket.id);
        if (!player || room.players[0].id !== socket.id) {
            socket.emit('error', 'Sadece oda sahibi oyunu başlatabilir');
            return;
        }
        
        room.started = true;
        room.gameState = gameState;
        room.currentTurn = 0;
        
        io.to(roomId).emit('gameStarted', { room, gameState });
        console.log(`Oyun başladı: ${roomId}`);
    });

    // Oyun aksiyonu (saldırı, transfer, bina)
    socket.on('gameAction', ({ roomId, action, data }) => {
        const room = rooms.get(roomId);
        if (!room || !room.started) return;
        
        // Aksiyonu tüm oyunculara gönder
        io.to(roomId).emit('gameAction', { playerId: socket.id, action, data });
        console.log(`Aksiyon: ${action} - Oda: ${roomId}`);
    });

    // Tur atla
    socket.on('nextTurn', ({ roomId }) => {
        const room = rooms.get(roomId);
        if (!room || !room.started) return;
        
        room.currentTurn++;
        io.to(roomId).emit('turnChanged', room.currentTurn);
    });

    // Oyun durumu güncelle
    socket.on('updateGameState', ({ roomId, gameState }) => {
        const room = rooms.get(roomId);
        if (!room) return;
        
        room.gameState = gameState;
        socket.to(roomId).emit('gameStateUpdate', gameState);
    });

    // Bağlantı koptu
    socket.on('disconnect', () => {
        console.log('Oyuncu ayrıldı:', socket.id);
        
        // Oyuncuyu tüm odalardan çıkar
        rooms.forEach((room, roomId) => {
            const playerIndex = room.players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                const player = room.players[playerIndex];
                room.players.splice(playerIndex, 1);
                
                if (room.players.length === 0) {
                    rooms.delete(roomId);
                    console.log(`Oda silindi: ${roomId}`);
                } else {
                    io.to(roomId).emit('playerLeft', { playerId: socket.id, playerName: player.name });
                    io.to(roomId).emit('roomUpdate', room);
                }
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
