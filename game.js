// Ses Sistemi
class SoundSystem {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API desteklenmiyor');
        }
    }

    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Bass boost
        filter.type = 'lowpass';
        filter.frequency.value = frequency * 2;
        filter.Q.value = 1;
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    click() { 
        this.playTone(120, 0.08, 'sawtooth');
        setTimeout(() => this.playTone(100, 0.06, 'sawtooth'), 50);
    }
    
    select() { 
        this.playTone(150, 0.12, 'sawtooth');
        setTimeout(() => this.playTone(180, 0.10, 'sawtooth'), 80);
        setTimeout(() => this.playTone(200, 0.08, 'sawtooth'), 150);
    }
    
    attack() {
        // Derin bass savaş davulu
        this.playTone(60, 0.2, 'sawtooth');
        setTimeout(() => this.playTone(70, 0.2, 'sawtooth'), 120);
        setTimeout(() => this.playTone(50, 0.25, 'sawtooth'), 250);
        setTimeout(() => this.playTone(65, 0.2, 'sawtooth'), 400);
        // Kılıç çarpışması
        setTimeout(() => this.playTone(1200, 0.05, 'square'), 450);
        setTimeout(() => this.playTone(900, 0.05, 'square'), 500);
        setTimeout(() => this.playTone(700, 0.05, 'square'), 550);
    }
    
    victory() {
        // Zafer fanfarı - derin bass
        this.playTone(80, 0.18, 'sawtooth');
        setTimeout(() => this.playTone(100, 0.18, 'sawtooth'), 180);
        setTimeout(() => this.playTone(120, 0.22, 'sawtooth'), 360);
        setTimeout(() => this.playTone(150, 0.28, 'sawtooth'), 540);
        // Daha derin bass davul
        setTimeout(() => this.playTone(60, 0.15, 'sawtooth'), 720);
        setTimeout(() => this.playTone(65, 0.15, 'sawtooth'), 850);
        setTimeout(() => this.playTone(70, 0.2, 'sawtooth'), 980);
        setTimeout(() => this.playTone(55, 0.25, 'sawtooth'), 1100);
    }
    
    defeat() {
        // Yenilgi - çok derin bass
        this.playTone(120, 0.25, 'sawtooth');
        setTimeout(() => this.playTone(90, 0.25, 'sawtooth'), 200);
        setTimeout(() => this.playTone(70, 0.35, 'sawtooth'), 400);
        setTimeout(() => this.playTone(50, 0.4, 'sawtooth'), 650);
        setTimeout(() => this.playTone(40, 0.3, 'sawtooth'), 950);
    }
    
    transfer() { 
        this.playTone(130, 0.12, 'sawtooth');
        setTimeout(() => this.playTone(150, 0.12, 'sawtooth'), 100);
        setTimeout(() => this.playTone(170, 0.12, 'sawtooth'), 200);
        setTimeout(() => this.playTone(140, 0.10, 'sawtooth'), 300);
    }
    
    gameOver() {
        // Epik final - çok derin bass
        const notes = [80, 90, 100, 110, 120, 130, 140, 150, 160, 180];
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.25, 'sawtooth'), i * 120);
        });
        // Çok derin davul finali
        setTimeout(() => {
            this.playTone(50, 0.25, 'sawtooth');
            setTimeout(() => this.playTone(55, 0.25, 'sawtooth'), 200);
            setTimeout(() => this.playTone(60, 0.3, 'sawtooth'), 400);
            setTimeout(() => this.playTone(45, 0.35, 'sawtooth'), 600);
        }, 1200);
    }

    toggle() {
        this.enabled = !this.enabled;
        const indicator = document.getElementById('sound-indicator');
        indicator.textContent = this.enabled ? 'Ses: Açık' : 'Ses: Kapalı';
    }
}

// Oyun Yapılandırması
const CONFIG = {
    FACTIONS: {
        MUSLIM: { 
            name: 'Müslüman İmparatorluğu', 
            shortName: 'Müslümanlar',
            class: 'muslim'
        },
        CHRISTIAN: { 
            name: 'Hristiyan Krallığı', 
            shortName: 'Hristiyanlar',
            class: 'christian'
        },
        JEWISH: { 
            name: 'Yahudi Devleti', 
            shortName: 'Yahudiler',
            class: 'jewish'
        },
        NEUTRAL: {
            name: 'Boş Arazi',
            shortName: 'Nötr',
            class: 'neutral'
        }
    },
    PLAYER_FACTION: null,
    AI_FACTIONS: [],
    TROOP_GENERATION_INTERVAL: 8000, // 8 saniye (daha yavaş)
    TROOPS_PER_REGION: 1,
    GOLD_GENERATION_INTERVAL: 5000, // 5 saniyede altın
    GOLD_PER_REGION: 10,
    FARM_COST: 50, // Farm maliyeti
    BARRACKS_COST: 100, // Kışla maliyeti
    FARM_PRODUCTION: 15, // Farm başına +15 altın
    BARRACKS_PRODUCTION: 2 // Kışla başına +2 asker
};

// Dünya Şehirleri (Koordinatlar yüzde olarak) - Artık İmparator İsimleri
const WORLD_CITIES = [
    // Avrupa
    { name: 'Arthur', left: 48, top: 28 },
    { name: 'Louis', left: 50, top: 32 },
    { name: 'Ferdinand', left: 47, top: 38 },
    { name: 'Caesar', left: 52, top: 38 },
    { name: 'Frederick', left: 53, top: 28 },
    { name: 'Ivan', left: 62, top: 25 },
    { name: 'Mehmed', left: 57, top: 38 },
    { name: 'Alexander', left: 55, top: 40 },
    { name: 'Leopold', left: 54, top: 32 },
    { name: 'Casimir', left: 56, top: 28 },
    
    // Orta Doğu
    { name: 'Ramses', left: 58, top: 48 },
    { name: 'Harun', left: 64, top: 44 },
    { name: 'Cyrus', left: 68, top: 42 },
    { name: 'Saladin', left: 64, top: 52 },
    { name: 'Solomon', left: 60, top: 46 },
    { name: 'Zenobia', left: 61, top: 44 },
    
    // Afrika
    { name: 'Hannibal', left: 50, top: 45 },
    { name: 'Mansa', left: 50, top: 58 },
    { name: 'Shaka', left: 61, top: 62 },
    { name: 'Cetshwayo', left: 56, top: 78 },
    { name: 'Cleopatra', left: 58, top: 48 },
    
    // Asya
    { name: 'Ashoka', left: 72, top: 48 },
    { name: 'Akbar', left: 70, top: 52 },
    { name: 'Qin', left: 80, top: 38 },
    { name: 'Wu', left: 82, top: 45 },
    { name: 'Meiji', left: 88, top: 42 },
    { name: 'Sejong', left: 84, top: 40 },
    { name: 'Rama', left: 78, top: 55 },
    { name: 'Jayavarman', left: 78, top: 62 },
    { name: 'Gajah', left: 80, top: 65 },
    
    // Amerika
    { name: 'Washington', left: 22, top: 38 },
    { name: 'Roosevelt', left: 15, top: 42 },
    { name: 'Lincoln', left: 20, top: 36 },
    { name: 'Montezuma', left: 16, top: 52 },
    { name: 'Pedro', left: 32, top: 72 },
    { name: 'Bolivar', left: 30, top: 78 },
    { name: 'Pachacuti', left: 24, top: 68 },
    
    // Okyanusya
    { name: 'Cook', left: 86, top: 75 },
    { name: 'Kamehameha', left: 85, top: 78 },
    { name: 'Tasman', left: 92, top: 80 }
];

// Komşuluk Haritası (İmparator isimleriyle)
const CITY_NEIGHBORS = {
    'Arthur': ['Louis', 'Frederick', 'Ferdinand'],
    'Louis': ['Arthur', 'Ferdinand', 'Caesar', 'Frederick'],
    'Ferdinand': ['Arthur', 'Louis', 'Hannibal'],
    'Caesar': ['Louis', 'Alexander', 'Leopold', 'Mehmed'],
    'Frederick': ['Arthur', 'Louis', 'Leopold', 'Casimir', 'Ivan'],
    'Ivan': ['Frederick', 'Casimir', 'Mehmed', 'Cyrus', 'Qin'],
    'Mehmed': ['Caesar', 'Alexander', 'Ivan', 'Zenobia', 'Harun'],
    'Alexander': ['Caesar', 'Mehmed', 'Ramses'],
    'Leopold': ['Caesar', 'Frederick', 'Casimir'],
    'Casimir': ['Frederick', 'Leopold', 'Ivan'],
    
    'Ramses': ['Alexander', 'Solomon', 'Hannibal', 'Shaka'],
    'Harun': ['Mehmed', 'Zenobia', 'Cyrus', 'Saladin'],
    'Cyrus': ['Ivan', 'Harun', 'Ashoka'],
    'Saladin': ['Harun', 'Solomon', 'Shaka'],
    'Solomon': ['Ramses', 'Zenobia', 'Saladin'],
    'Zenobia': ['Mehmed', 'Solomon', 'Harun'],
    
    'Hannibal': ['Ferdinand', 'Ramses', 'Mansa'],
    'Mansa': ['Hannibal', 'Shaka'],
    'Shaka': ['Ramses', 'Saladin', 'Mansa', 'Cetshwayo'],
    'Cetshwayo': ['Shaka', 'Pedro'],
    'Cleopatra': ['Alexander', 'Solomon', 'Hannibal', 'Shaka'],
    
    'Ashoka': ['Cyrus', 'Akbar', 'Qin', 'Rama'],
    'Akbar': ['Ashoka', 'Rama'],
    'Qin': ['Ivan', 'Ashoka', 'Wu', 'Sejong', 'Meiji'],
    'Wu': ['Qin', 'Meiji', 'Rama'],
    'Meiji': ['Qin', 'Wu', 'Sejong', 'Roosevelt'],
    'Sejong': ['Qin', 'Meiji'],
    'Rama': ['Ashoka', 'Akbar', 'Wu', 'Jayavarman'],
    'Jayavarman': ['Rama', 'Gajah', 'Cook'],
    'Gajah': ['Jayavarman', 'Cook'],
    
    'Washington': ['Lincoln', 'Arthur', 'Montezuma'],
    'Roosevelt': ['Lincoln', 'Meiji', 'Montezuma'],
    'Lincoln': ['Washington', 'Roosevelt', 'Montezuma'],
    'Montezuma': ['Washington', 'Roosevelt', 'Lincoln', 'Pachacuti'],
    'Pedro': ['Pachacuti', 'Bolivar', 'Cetshwayo'],
    'Bolivar': ['Pedro', 'Pachacuti'],
    'Pachacuti': ['Montezuma', 'Pedro', 'Bolivar'],
    
    'Cook': ['Jayavarman', 'Gajah', 'Kamehameha', 'Tasman'],
    'Kamehameha': ['Cook', 'Tasman'],
    'Tasman': ['Cook', 'Kamehameha']
};

// Ana Oyun Sınıfı
class Game {
    constructor(playerFaction) {
        this.playerFaction = playerFaction;
        this.cities = [];
        this.currentTurn = playerFaction;
        this.selectedCity = null;
        this.targetCity = null; // İkinci seçim için
        this.turnOrder = [playerFaction, ...Object.keys(CONFIG.FACTIONS).filter(f => f !== playerFaction && f !== 'NEUTRAL')];
        this.currentTurnIndex = 0;
        this.turnCount = 1;
        this.sound = new SoundSystem();
        window.gameSound = this.sound;
        this.isMultiplayer = false; // Multiplayer flag
        
        // Zoom ve Pan değişkenleri
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        
        // Ekonomi sistemi
        this.gold = { MUSLIM: 100, CHRISTIAN: 100, JEWISH: 100 };
        this.farms = { MUSLIM: 0, CHRISTIAN: 0, JEWISH: 0 };
        this.barracks = { MUSLIM: 0, CHRISTIAN: 0, JEWISH: 0 };
        
        // Asker üretim timer
        this.troopGenerationTimer = null;
        this.goldGenerationTimer = null;
        
        CONFIG.PLAYER_FACTION = playerFaction;
        CONFIG.AI_FACTIONS = Object.keys(CONFIG.FACTIONS).filter(f => f !== playerFaction && f !== 'NEUTRAL');
        
        this.init();
        this.initMapControls();
        this.startTroopGeneration();
        this.startGoldGeneration();
    }

    init() {
        this.createCities();
        this.renderMap();
        this.updateStats();
        this.updateActionButtons();
        this.addLog('Oyun başladı! Şehrinizi seçin ve stratejinizi belirleyin.', 'info');
    }

    createCities() {
        this.cities = [];
        
        // Bölgeleri daha dağınık yerleştir - minimum mesafe ile
        const MIN_DISTANCE = 8; // Minimum %8 mesafe
        const placedPositions = [];
        
        // Her fraksiyon için 2 rastgele bölge seç
        const factions = ['MUSLIM', 'CHRISTIAN', 'JEWISH'];
        const usedIndices = new Set();
        
        factions.forEach(faction => {
            let count = 0;
            let attempts = 0;
            while (count < 2 && attempts < 100) {
                const randomIndex = Math.floor(Math.random() * WORLD_CITIES.length);
                const city = WORLD_CITIES[randomIndex];
                
                // Çok yakın bölge var mı kontrol et
                const tooClose = placedPositions.some(pos => {
                    const distance = Math.sqrt(
                        Math.pow(city.left - pos.left, 2) + 
                        Math.pow(city.top - pos.top, 2)
                    );
                    return distance < MIN_DISTANCE;
                });
                
                if (!usedIndices.has(randomIndex) && !tooClose) {
                    usedIndices.add(randomIndex);
                    placedPositions.push({ left: city.left, top: city.top });
                    this.cities.push({
                        id: this.cities.length,
                        name: CONFIG.FACTIONS[faction].shortName,
                        left: city.left,
                        top: city.top,
                        faction: faction,
                        army: 10
                    });
                    count++;
                }
                attempts++;
            }
        });
        
        // Geri kalan bölgeler nötr - daha az sayıda
        let neutralCount = 0;
        const maxNeutral = 20; // Maksimum 20 nötr bölge
        
        WORLD_CITIES.forEach((city, index) => {
            if (!usedIndices.has(index) && neutralCount < maxNeutral) {
                // Çok yakın bölge var mı kontrol et
                const tooClose = placedPositions.some(pos => {
                    const distance = Math.sqrt(
                        Math.pow(city.left - pos.left, 2) + 
                        Math.pow(city.top - pos.top, 2)
                    );
                    return distance < MIN_DISTANCE;
                });
                
                if (!tooClose) {
                    usedIndices.add(index);
                    placedPositions.push({ left: city.left, top: city.top });
                    this.cities.push({
                        id: this.cities.length,
                        name: 'Boş Arazi',
                        left: city.left,
                        top: city.top,
                        faction: 'NEUTRAL',
                        army: 5
                    });
                    neutralCount++;
                }
            }
        });
    }

    renderMap() {
        const mapElement = document.getElementById('world-map');
        const citiesHTML = this.cities.map(city => {
            let classes = `city ${CONFIG.FACTIONS[city.faction].class}`;
            if (this.selectedCity?.id === city.id) classes += ' selected';
            if (this.targetCity?.id === city.id) classes += ' target';
            
            return `
                <div class="${classes}" 
                     data-id="${city.id}"
                     style="left: ${city.left}%; top: ${city.top}%;"
                     onclick="game.handleCityClick(${city.id})">
                    <div class="city-name">${city.name}</div>
                    <div class="city-army">${city.army}</div>
                </div>
            `;
        }).join('');
        
        mapElement.innerHTML = citiesHTML;
    }

    handleCityClick(cityId) {
        if (this.currentTurn !== this.playerFaction) {
            this.addLog('Şu an sizin sıranız değil!', 'info');
            this.sound.click();
            return;
        }

        const city = this.cities.find(c => c.id === cityId);
        if (!city) return;

        // Eğer zaten seçili bölgeye tıklandıysa, seçimi iptal et
        if (this.selectedCity?.id === cityId) {
            this.selectedCity = null;
            this.targetCity = null;
            this.sound.click();
            this.addLog('Seçim iptal edildi', 'info');
            this.renderMap();
            this.updateActionButtons();
            return;
        }

        // Eğer hedef bölgeye tıklandıysa, hedefi iptal et
        if (this.targetCity?.id === cityId) {
            this.targetCity = null;
            this.sound.click();
            this.addLog('Hedef iptal edildi', 'info');
            this.renderMap();
            this.updateActionButtons();
            return;
        }

        // İlk seçim
        if (!this.selectedCity) {
            if (city.faction === this.playerFaction) {
                this.selectedCity = city;
                this.sound.select();
                this.addLog(`${city.name} bölgesi seçildi (${city.army} asker)`, 'info');
                this.renderMap();
                this.updateActionButtons();
            } else {
                this.sound.click();
                this.addLog('Önce kendi bölgenizi seçin!', 'info');
            }
            return;
        }

        // İkinci seçim - hedef belirle
        this.targetCity = city;
        this.sound.select();
        
        if (city.faction === this.playerFaction) {
            this.addLog(`Transfer hedefi: ${city.name} (${city.army} asker)`, 'info');
        } else {
            const targetName = city.faction === 'NEUTRAL' ? 'Boş Arazi' : CONFIG.FACTIONS[city.faction].shortName;
            this.addLog(`Saldırı hedefi: ${targetName} (${city.army} asker)`, 'info');
        }
        
        this.renderMap();
        this.updateActionButtons();
    }

    areNeighbors(id1, id2) {
        const city1 = this.cities.find(c => c.id === id1);
        const city2 = this.cities.find(c => c.id === id2);
        
        if (!city1 || !city2) return false;
        
        // Mesafe bazlı komşuluk (yakın olanlar komşu)
        const distance = Math.sqrt(
            Math.pow(city1.left - city2.left, 2) + 
            Math.pow(city1.top - city2.top, 2)
        );
        
        return distance < 15; // %15'ten yakın olanlar komşu
    }

    // Buton ile saldır
    attackTarget() {
        if (!this.selectedCity || !this.targetCity) {
            this.addLog('Önce kaynak ve hedef bölge seçin!', 'info');
            return;
        }
        
        if (this.targetCity.faction === this.playerFaction) {
            this.addLog('Kendi bölgenize saldıramazsınız!', 'info');
            return;
        }
        
        // Multiplayer sync
        if (this.isMultiplayer && window.multiplayerManager) {
            window.multiplayerManager.sendAction('attack', {
                fromCity: this.selectedCity,
                toCity: this.targetCity
            });
        }
        
        this.attack(this.selectedCity, this.targetCity);
    }

    // Buton ile transfer
    transferTroops() {
        if (!this.selectedCity || !this.targetCity) {
            this.addLog('Önce iki bölge seçin!', 'info');
            return;
        }
        
        if (this.targetCity.faction !== this.playerFaction) {
            this.addLog('Transfer sadece kendi bölgeleriniz arasında yapılabilir!', 'info');
            return;
        }
        
        this.showTransferModal();
    }

    attack(attacker, defender) {
        const attackerName = CONFIG.FACTIONS[attacker.faction].shortName;
        const defenderName = defender.faction === 'NEUTRAL' ? 'Boş Arazi' : CONFIG.FACTIONS[defender.faction].shortName;
        
        // Asker hareketi animasyonu göster
        this.animateTroopMovement(attacker, defender, () => {
            const randomBonus = Math.floor(Math.random() * 10);
            const attackPower = attacker.army - defender.army + randomBonus;
            
            this.sound.attack();
            
            if (attackPower > 0) {
                const remainingArmy = Math.max(3, attacker.army - Math.floor(defender.army / 2));
                defender.faction = attacker.faction;
                defender.name = CONFIG.FACTIONS[attacker.faction].shortName; // İsmi değiştir!
                defender.army = remainingArmy;
                attacker.army = Math.max(3, Math.floor(attacker.army / 3));
                
                this.sound.victory();
                this.addLog(`⚔️ ${attackerName} ${defenderName} bölgesini fethetti! (Bonus: +${randomBonus})`, 'victory');
                this.addLog(`🏆 Bölge artık ${attackerName}'a ait (${remainingArmy} asker)`, 'victory');
            } else {
                defender.army = Math.max(3, defender.army - Math.floor(attacker.army / 3));
                attacker.army = Math.max(3, Math.floor(attacker.army / 2));
                
                this.sound.defeat();
                this.addLog(`🛡️ ${defenderName} savunmayı başardı!`, 'defeat');
                this.addLog(`💔 ${attackerName} geri çekildi (${attacker.army} asker kaldı)`, 'defeat');
            }
            
            this.selectedCity = null;
            this.renderMap();
            this.updateStats();
            this.updateActionButtons();
            this.checkGameOver();
            
            setTimeout(() => this.nextTurn(), 1500);
        });
    }

    // Asker hareketi animasyonu
    animateTroopMovement(fromCity, toCity, callback) {
        const mapContainer = document.getElementById('world-map');
        const mapRect = mapContainer.getBoundingClientRect();
        
        // Başlangıç ve bitiş pozisyonları
        const startX = (fromCity.left / 100) * mapRect.width;
        const startY = (fromCity.top / 100) * mapRect.height;
        const endX = (toCity.left / 100) * mapRect.width;
        const endY = (toCity.top / 100) * mapRect.height;
        
        // Asker sayısı kadar ikon oluştur (max 8)
        const troopCount = Math.min(8, Math.floor(fromCity.army / 3) + 2);
        
        for (let i = 0; i < troopCount; i++) {
            setTimeout(() => {
                const troop = document.createElement('div');
                troop.className = 'troop-movement';
                troop.innerHTML = '<img src="images/soldier.svg" alt="Asker">';
                troop.style.left = startX + 'px';
                troop.style.top = startY + 'px';
                
                mapContainer.appendChild(troop);
                
                // Animasyon
                const duration = 1200; // Biraz daha yavaş
                const startTime = Date.now();
                
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function (ease-in-out cubic)
                    const eased = progress < 0.5 
                        ? 4 * progress * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                    
                    const currentX = startX + (endX - startX) * eased;
                    const currentY = startY + (endY - startY) * eased;
                    
                    // Daha belirgin yay hareketi
                    const arc = Math.sin(progress * Math.PI) * 50;
                    
                    // Rotasyon efekti
                    const rotation = progress * 360;
                    
                    troop.style.left = currentX + 'px';
                    troop.style.top = (currentY - arc) + 'px';
                    troop.style.transform = `scale(${1 + Math.sin(progress * Math.PI * 2) * 0.3}) rotate(${rotation}deg)`;
                    troop.style.opacity = 0.8 + Math.sin(progress * Math.PI) * 0.2;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        // Patlama efekti
                        troop.style.transform = 'scale(2)';
                        troop.style.opacity = '0';
                        setTimeout(() => troop.remove(), 200);
                        
                        if (i === troopCount - 1) {
                            callback();
                        }
                    }
                };
                
                animate();
            }, i * 120); // Daha hızlı ardışık
        }
    }

    showTransferModal() {
        if (!this.selectedCity) {
            this.addLog('Önce bir bölge seçin!', 'info');
            return;
        }

        const ownNeighbors = this.cities.filter(c => 
            this.areNeighbors(this.selectedCity.id, c.id) && 
            c.faction === this.playerFaction
        );

        if (ownNeighbors.length === 0) {
            this.addLog('Asker transfer edebileceğiniz komşu bölge yok!', 'info');
            return;
        }

        const targetCity = ownNeighbors[0];
        
        document.getElementById('transfer-from').textContent = this.selectedCity.name;
        document.getElementById('transfer-to').textContent = targetCity.name;
        document.getElementById('transfer-available').textContent = this.selectedCity.army - 3;
        
        const slider = document.getElementById('transfer-amount');
        slider.max = this.selectedCity.army - 3;
        slider.value = Math.floor((this.selectedCity.army - 3) / 2);
        
        this.updateTransferValue();
        
        document.getElementById('transfer-modal').classList.add('show');
        document.getElementById('transfer-modal').dataset.targetId = targetCity.id;
    }

    updateTransferValue() {
        const value = document.getElementById('transfer-amount').value;
        document.getElementById('transfer-value').textContent = value;
    }

    confirmTransfer() {
        const amount = parseInt(document.getElementById('transfer-amount').value);
        const targetId = parseInt(document.getElementById('transfer-modal').dataset.targetId);
        const targetCity = this.cities[targetId];
        
        // Asker hareketi animasyonu göster
        this.animateTroopMovement(this.selectedCity, targetCity, () => {
            this.selectedCity.army -= amount;
            targetCity.army += amount;
            
            this.sound.transfer();
            this.addLog(`${this.selectedCity.name}'den ${targetCity.name}'e ${amount} asker transfer edildi.`, 'transfer');
            
            this.renderMap();
            this.updateStats();
        });
        
        this.closeTransferModal();
        this.nextTurn();
    }

    closeTransferModal() {
        document.getElementById('transfer-modal').classList.remove('show');
    }

    updateActionButtons() {
        const hasSelection = this.selectedCity !== null;
        const hasTarget = this.targetCity !== null;
        const isPlayerTurn = this.currentTurn === this.playerFaction;
        const isOwnCity = hasSelection && this.selectedCity.faction === this.playerFaction;
        const isTargetOwn = hasTarget && this.targetCity.faction === this.playerFaction;
        
        // Saldır: Sadece hedef düşman/nötr ise
        document.getElementById('btn-attack').disabled = !hasSelection || !hasTarget || !isPlayerTurn || isTargetOwn;
        
        // Transfer: İki kendi bölgen seçili ise
        document.getElementById('btn-transfer').disabled = !hasSelection || !hasTarget || !isPlayerTurn || !isOwnCity || !isTargetOwn;
        
        // Farm ve Kışla: Sadece kendi bölgen seçili ise
        document.getElementById('btn-fortify').disabled = !hasSelection || !isPlayerTurn || !isOwnCity;
        document.getElementById('btn-farm').disabled = !hasSelection || !isPlayerTurn || !isOwnCity;
        document.getElementById('btn-barracks').disabled = !hasSelection || !isPlayerTurn || !isOwnCity;
    }

    fortifyCity() {
        if (!this.selectedCity) {
            this.addLog('Önce bir şehir seçin!', 'info');
            return;
        }

        const bonus = Math.floor(Math.random() * 5) + 3;
        this.selectedCity.army += bonus;
        
        this.sound.select();
        this.addLog(`${this.selectedCity.name} tahkim edildi! +${bonus} asker`, 'info');
        
        this.renderMap();
        this.updateStats();
        this.nextTurn();
    }

    updateStats() {
        const statsElement = document.getElementById('faction-stats');
        statsElement.innerHTML = '';
        
        Object.keys(CONFIG.FACTIONS).forEach(factionKey => {
            if (factionKey === 'NEUTRAL') return;
            
            const faction = CONFIG.FACTIONS[factionKey];
            const cities = this.cities.filter(c => c.faction === factionKey);
            const totalArmy = cities.reduce((sum, c) => sum + c.army, 0);
            const percentage = ((cities.length / this.cities.length) * 100).toFixed(1);
            const troopsPerTick = (cities.length + this.barracks[factionKey] * CONFIG.BARRACKS_PRODUCTION);
            const goldPerTick = (cities.length * CONFIG.GOLD_PER_REGION + this.farms[factionKey] * CONFIG.FARM_PRODUCTION);
            
            const statDiv = document.createElement('div');
            statDiv.className = `faction-stats ${factionKey.toLowerCase()}`;
            statDiv.innerHTML = `
                <div class="faction-header">
                    <div class="faction-stats-icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                            <circle cx="10" cy="10" r="8"/>
                        </svg>
                    </div>
                    <div class="faction-stats-name">${faction.shortName}</div>
                </div>
                <div class="stat-row">
                    <span class="stat-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent-gold)" style="vertical-align: middle; margin-right: 4px;">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2" stroke="var(--primary-bg)" stroke-width="2" fill="none"/>
                        </svg>
                        Altın:
                    </span>
                    <span class="stat-value">${this.gold[factionKey]} (+${goldPerTick}/5sn)</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--text-secondary)" style="vertical-align: middle; margin-right: 4px;">
                            <path d="M12 3L2 12h3v8h14v-8h3L12 3z"/>
                        </svg>
                        Bölgeler:
                    </span>
                    <span class="stat-value">${cities.length}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--text-secondary)" style="vertical-align: middle; margin-right: 4px;">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                        </svg>
                        Asker:
                    </span>
                    <span class="stat-value">${totalArmy} (+${troopsPerTick}/8sn)</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--text-secondary)" style="vertical-align: middle; margin-right: 4px;">
                            <circle cx="12" cy="12" r="8"/>
                        </svg>
                        Farm:
                    </span>
                    <span class="stat-value">${this.farms[factionKey]}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--text-secondary)" style="vertical-align: middle; margin-right: 4px;">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                        </svg>
                        Kışla:
                    </span>
                    <span class="stat-value">${this.barracks[factionKey]}</span>
                </div>
            `;
            
            statsElement.appendChild(statDiv);
        });
    }

    nextTurn() {
        this.selectedCity = null;
        this.renderMap();
        this.updateActionButtons();
        
        this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;
        this.currentTurn = this.turnOrder[this.currentTurnIndex];
        
        if (this.currentTurnIndex === 0) {
            this.turnCount++;
            document.getElementById('turn-count').textContent = this.turnCount;
        }
        
        const turnText = this.currentTurn === this.playerFaction ? 
            'Sizin Sıranız' : 
            `${CONFIG.FACTIONS[this.currentTurn].shortName} Sırası`;
        
        document.getElementById('current-turn').textContent = turnText;
        
        if (this.currentTurn !== this.playerFaction) {
            this.addLog(`${CONFIG.FACTIONS[this.currentTurn].shortName} düşünüyor...`, 'info');
            setTimeout(() => this.aiTurn(), 1500);
        } else {
            this.sound.select();
        }
    }

    aiTurn() {
        const aiCities = this.cities.filter(c => c.faction === this.currentTurn);
        
        if (aiCities.length === 0) {
            this.nextTurn();
            return;
        }

        // AI stratejisi: Bazen yapı inşa et, bazen saldır
        const decision = Math.random();
        
        // %30 farm inşa et
        if (decision < 0.3 && this.gold[this.currentTurn] >= CONFIG.FARM_COST) {
            this.gold[this.currentTurn] -= CONFIG.FARM_COST;
            this.farms[this.currentTurn]++;
            this.addLog(`🤖 ${CONFIG.FACTIONS[this.currentTurn].shortName} farm inşa etti!`, 'info');
            this.updateStats();
            setTimeout(() => this.nextTurn(), 1000);
            return;
        }
        
        // %20 kışla inşa et
        if (decision < 0.5 && this.gold[this.currentTurn] >= CONFIG.BARRACKS_COST) {
            this.gold[this.currentTurn] -= CONFIG.BARRACKS_COST;
            this.barracks[this.currentTurn]++;
            this.addLog(`🤖 ${CONFIG.FACTIONS[this.currentTurn].shortName} kışla inşa etti!`, 'info');
            this.updateStats();
            setTimeout(() => this.nextTurn(), 1000);
            return;
        }

        // Saldır
        const strongestCity = aiCities.reduce((strongest, current) => 
            current.army > strongest.army ? current : strongest
        );
        
        // Tüm düşman bölgeleri bul
        const enemyCities = this.cities.filter(c => c.faction !== this.currentTurn);
        
        if (enemyCities.length === 0) {
            this.nextTurn();
            return;
        }

        // En zayıf düşman bölgesini seç
        const target = enemyCities.reduce((weakest, current) => 
            current.army < weakest.army ? current : weakest
        );
        
        const targetName = target.faction === 'NEUTRAL' ? 'Boş Arazi' : CONFIG.FACTIONS[target.faction].shortName;
        this.addLog(`🤖 ${CONFIG.FACTIONS[this.currentTurn].shortName} ${targetName}'ye saldırıyor...`, 'info');
        
        setTimeout(() => {
            this.attack(strongestCity, target);
        }, 1000);
    }

    checkGameOver() {
        const factions = new Set(this.cities.filter(c => c.faction !== 'NEUTRAL').map(c => c.faction));
        
        if (factions.size === 1) {
            const winner = Array.from(factions)[0];
            const winnerData = CONFIG.FACTIONS[winner];
            
            this.sound.gameOver();
            this.stopTroopGeneration();
            
            document.getElementById('winner-text').innerHTML = `
                <strong>${winnerData.name}</strong><br>
                tüm dünyayı fethetti!<br>
                <span style="color: var(--text-secondary); font-size: 16px;">Toplam ${this.turnCount} turda</span>
            `;
            document.getElementById('game-over').classList.add('show');
        }
    }

    addLog(message, type = 'info') {
        const logContent = document.getElementById('log-content');
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        
        const time = new Date().toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        entry.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;
        logContent.insertBefore(entry, logContent.firstChild);
        
        while (logContent.children.length > 50) {
            logContent.removeChild(logContent.lastChild);
        }
    }

    toggleSound() {
        this.sound.toggle();
        this.sound.click();
    }

    skipTurn() {
        this.sound.click();
        this.addLog('Sıra geçildi.', 'info');
        this.nextTurn();
    }

    restart() {
        this.sound.click();
        this.stopTroopGeneration();
        this.stopGoldGeneration();
        document.getElementById('game-over').classList.remove('show');
        document.getElementById('start-screen').classList.remove('hidden');
        
        document.querySelectorAll('.faction-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.getElementById('start-btn').classList.remove('show');
    }

    // Harita kontrolleri
    initMapControls() {
        const mapContainer = document.getElementById('map-container');
        const map = document.getElementById('world-map');
        
        // Mouse wheel zoom
        mapContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.zoom = Math.max(1, Math.min(3, this.zoom + delta));
            this.updateMapTransform();
        });
        
        // Pan (sürükleme)
        mapContainer.addEventListener('mousedown', (e) => {
            if (e.target.closest('.city')) return;
            this.isDragging = true;
            this.dragStartX = e.clientX - this.panX;
            this.dragStartY = e.clientY - this.panY;
            mapContainer.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.panX = e.clientX - this.dragStartX;
            this.panY = e.clientY - this.dragStartY;
            this.updateMapTransform();
        });
        
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            document.getElementById('map-container').style.cursor = 'grab';
        });
    }

    updateMapTransform() {
        const map = document.getElementById('world-map');
        map.style.transform = `scale(${this.zoom}) translate(${this.panX / this.zoom}px, ${this.panY / this.zoom}px)`;
        document.getElementById('zoom-level').textContent = Math.round(this.zoom * 100) + '%';
    }

    zoomIn() {
        this.zoom = Math.min(3, this.zoom + 0.2);
        this.updateMapTransform();
        this.sound.click();
    }

    zoomOut() {
        this.zoom = Math.max(1, this.zoom - 0.2);
        this.updateMapTransform();
        this.sound.click();
    }

    resetZoom() {
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.updateMapTransform();
        this.sound.click();
    }

    // Asker üretim sistemi
    startTroopGeneration() {
        this.troopGenerationTimer = setInterval(() => {
            this.generateTroops();
        }, CONFIG.TROOP_GENERATION_INTERVAL);
    }

    generateTroops() {
        this.cities.forEach(city => {
            if (city.faction !== 'NEUTRAL') {
                const factionCities = this.cities.filter(c => c.faction === city.faction);
                const barracksBonus = this.barracks[city.faction] * CONFIG.BARRACKS_PRODUCTION;
                city.army += CONFIG.TROOPS_PER_REGION + Math.floor(barracksBonus / factionCities.length);
            }
        });
        
        this.renderMap();
        this.updateStats();
    }

    stopTroopGeneration() {
        if (this.troopGenerationTimer) {
            clearInterval(this.troopGenerationTimer);
            this.troopGenerationTimer = null;
        }
    }

    // Altın üretim sistemi
    startGoldGeneration() {
        this.goldGenerationTimer = setInterval(() => {
            this.generateGold();
        }, CONFIG.GOLD_GENERATION_INTERVAL);
    }

    generateGold() {
        Object.keys(this.gold).forEach(faction => {
            const cities = this.cities.filter(c => c.faction === faction);
            const baseGold = cities.length * CONFIG.GOLD_PER_REGION;
            const farmBonus = this.farms[faction] * CONFIG.FARM_PRODUCTION;
            this.gold[faction] += baseGold + farmBonus;
        });
        
        this.updateStats();
    }

    stopGoldGeneration() {
        if (this.goldGenerationTimer) {
            clearInterval(this.goldGenerationTimer);
            this.goldGenerationTimer = null;
        }
    }

    // Farm inşa et
    buildFarm() {
        if (!this.selectedCity || this.selectedCity.faction !== this.playerFaction) {
            this.addLog('Önce kendi bölgenizi seçin!', 'info');
            return;
        }

        if (this.gold[this.playerFaction] < CONFIG.FARM_COST) {
            this.addLog(`❌ Yetersiz altın! (${CONFIG.FARM_COST} altın gerekli)`, 'defeat');
            this.sound.click();
            return;
        }

        this.gold[this.playerFaction] -= CONFIG.FARM_COST;
        this.farms[this.playerFaction]++;
        this.sound.victory();
        this.addLog(`🌾 Farm inşa edildi! (+${CONFIG.FARM_PRODUCTION} altın/5sn)`, 'victory');
        this.updateStats();
    }

    // Kışla inşa et
    buildBarracks() {
        if (!this.selectedCity || this.selectedCity.faction !== this.playerFaction) {
            this.addLog('Önce kendi bölgenizi seçin!', 'info');
            return;
        }

        if (this.gold[this.playerFaction] < CONFIG.BARRACKS_COST) {
            this.addLog(`❌ Yetersiz altın! (${CONFIG.BARRACKS_COST} altın gerekli)`, 'defeat');
            this.sound.click();
            return;
        }

        this.gold[this.playerFaction] -= CONFIG.BARRACKS_COST;
        this.barracks[this.playerFaction]++;
        this.sound.victory();
        this.addLog(`🏛️ Kışla inşa edildi! (+${CONFIG.BARRACKS_PRODUCTION} asker/8sn)`, 'victory');
        this.updateStats();
    }

    // Multiplayer Metodları
    startMultiplayerMode() {
        this.isMultiplayer = true;
        console.log('Multiplayer modu aktif');
    }

    getGameState() {
        return {
            cities: this.cities,
            currentTurn: this.currentTurn,
            gold: this.gold,
            farms: this.farms,
            barracks: this.barracks
        };
    }

    loadGameState(gameState) {
        this.cities = gameState.cities;
        this.currentTurn = gameState.currentTurn;
        this.gold = gameState.gold;
        this.farms = gameState.farms;
        this.barracks = gameState.barracks;
        this.updateStats();
        this.renderCities();
    }

    syncGameState(gameState) {
        this.loadGameState(gameState);
    }

    handleTurnChange(turnNumber) {
        this.currentTurn = turnNumber;
        document.getElementById('turn-count').textContent = this.currentTurn;
    }

    handleRemoteAttack(data) {
        const { fromCity, toCity } = data;
        const from = this.cities.find(c => c.id === fromCity.id);
        const to = this.cities.find(c => c.id === toCity.id);
        
        if (from && to) {
            this.performAttack(from, to);
        }
    }

    handleRemoteTransfer(data) {
        const { fromCity, toCity, amount } = data;
        const from = this.cities.find(c => c.id === fromCity.id);
        const to = this.cities.find(c => c.id === toCity.id);
        
        if (from && to) {
            this.performTransfer(from, to, amount);
        }
    }

    handleRemoteBuild(data) {
        const { cityId, buildingType } = data;
        const city = this.cities.find(c => c.id === cityId);
        
        if (city) {
            if (buildingType === 'farm') {
                this.buildFarm();
            } else if (buildingType === 'barracks') {
                this.buildBarracks();
            }
        }
    }
}

// Global Functions
let selectedFaction = null;

function selectFaction(faction) {
    selectedFaction = faction;
    
    document.querySelectorAll('.faction-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.faction-card.${faction.toLowerCase()}`);
    selectedCard.classList.add('selected');
    
    document.getElementById('start-btn').classList.add('show');
    
    if (window.gameSound) {
        window.gameSound.select();
    }
}

function startGame() {
    if (!selectedFaction) return;
    
    if (window.gameSound) {
        window.gameSound.victory();
    }
    
    document.getElementById('start-screen').classList.add('hidden');
    window.game = new Game(selectedFaction);
}

// Oyun değişkeni
window.game = null;
