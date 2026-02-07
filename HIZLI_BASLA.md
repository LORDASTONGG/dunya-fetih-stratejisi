# ⚡ Hızlı Başlangıç

## 🎮 Lokal Oynamak İçin (Tek Oyunculu)

Çift tıkla: `OYUNU_BASLAT.bat`

## 🌐 Multiplayer Oynamak İçin

### 1. İlk Kurulum (Sadece Bir Kez)
```bash
npm install
```

### 2. Sunucuyu Başlat
Çift tıkla: `MULTIPLAYER_BASLAT.bat`

VEYA terminal'de:
```bash
npm start
```

### 3. Tarayıcıda Aç
```
http://localhost:3000
```

### 4. Arkadaşlarınla Oyna

#### Aynı WiFi'deyseniz:
1. Sunucuyu başlat
2. IP adresini öğren (MULTIPLAYER_BASLAT.bat gösterecek)
3. Arkadaşların şunu açsın: `http://SENIN_IP:3000`

#### İnternet üzerinden:
1. [DEPLOY.md](DEPLOY.md) dosyasını oku
2. Render/Railway'e deploy et
3. Linki paylaş!

---

## 🎯 Oyun Modları

### Tek Oyunculu
- Direkt oyna
- AI rakipler
- Hızlı başlangıç

### Çok Oyunculu
- Oda oluştur
- Arkadaşlarını davet et
- Gerçek zamanlı oyna

---

## 📁 Dosya Yapısı

```
📦 Oyun Dosyaları
├── 🎮 OYUNU_BASLAT.bat          # Tek oyunculu başlat
├── 🌐 MULTIPLAYER_BASLAT.bat   # Multiplayer başlat
├── 📄 index.html                # Ana sayfa
├── 🎨 style.css                 # Stiller
├── 🎯 game.js                   # Oyun mantığı
├── 🔌 multiplayer.js            # Multiplayer sistem
├── 🖥️ server.js                 # Node.js sunucu
├── 📦 package.json              # Bağımlılıklar
├── 📖 README.md                 # Genel bilgi
├── 🚀 DEPLOY.md                 # Deploy rehberi
└── ⚡ KURULUM.md                # Detaylı kurulum
```

---

## 🆘 Hızlı Sorun Giderme

### "Node.js bulunamadı" hatası
👉 [Node.js İndir](https://nodejs.org)

### Port 3000 kullanımda
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Oyun açılmıyor
1. Tarayıcıyı yenile (F5)
2. Console'u kontrol et (F12)
3. Sunucuyu yeniden başlat

---

## 💡 İpuçları

✅ İlk kurulum 1-2 dakika sürer (npm install)  
✅ Sunucu çalışırken terminal'i kapatma  
✅ Lokal ağda en hızlı oynanır  
✅ Deploy için Render/Railway kullan  
✅ Arkadaşlarınla oda kodu paylaş  

---

## 🎉 Hazırsın!

Şimdi oyuna başla ve dünyayı fethet! 🌍⚔️
