# 🚀 Deploy Rehberi - Oyunu İnternete Yayınla

## 🎯 En Kolay Yöntem: Render.com (ÜCRETSİZ)

### Adım 1: Render Hesabı Aç
1. [render.com](https://render.com) git
2. "Get Started for Free" tıkla
3. GitHub ile giriş yap

### Adım 2: Projeyi GitHub'a Yükle
```bash
# Git başlat
git init
git add .
git commit -m "İlk commit"

# GitHub'a yükle
git remote add origin https://github.com/KULLANICI_ADIN/oyun-adi.git
git push -u origin main
```

### Adım 3: Render'da Deploy Et
1. Render dashboard'a git
2. "New +" → "Web Service" tıkla
3. GitHub repo'nu bağla
4. Ayarları yap:
   - **Name**: oyun-adi
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. "Create Web Service" tıkla

### Adım 4: Oyunu Paylaş!
- Render sana bir URL verecek: `https://oyun-adi.onrender.com`
- Bu linki arkadaşlarınla paylaş!
- İlk açılış 1-2 dakika sürebilir (ücretsiz plan)

---

## 🚂 Alternatif: Railway.app (ÜCRETSİZ)

### Adım 1: Railway Hesabı
1. [railway.app](https://railway.app) git
2. GitHub ile giriş yap

### Adım 2: Deploy
1. "New Project" tıkla
2. "Deploy from GitHub repo" seç
3. Repo'nu seç
4. Otomatik deploy olacak!

### Adım 3: Domain Al
1. Settings → Domains
2. "Generate Domain" tıkla
3. URL'i kopyala: `https://oyun-adi.up.railway.app`

---

## ✨ Alternatif: Glitch.com (ÜCRETSİZ)

### Adım 1: Glitch Hesabı
1. [glitch.com](https://glitch.com) git
2. Hesap aç

### Adım 2: Import
1. "New Project" → "Import from GitHub"
2. Repo URL'ini yapıştır
3. Otomatik çalışacak!

### Adım 3: Paylaş
- URL: `https://oyun-adi.glitch.me`
- Sürekli aktif kalır!

---

## 🏠 Lokal Ağda Paylaş (Ücretsiz, Hızlı)

### Windows:
```bash
# Sunucuyu başlat
npm start

# IP adresini öğren
ipconfig
```

Arkadaşların aynı WiFi'de olmalı ve şunu açmalı:
```
http://SENIN_IP:3000
```

Örnek: `http://192.168.1.100:3000`

---

## 🌐 ngrok ile İnternete Aç (Geçici)

### Kurulum:
1. [ngrok.com](https://ngrok.com) hesabı aç
2. ngrok indir ve kur
3. Token'ı ayarla

### Kullanım:
```bash
# Terminal 1: Sunucuyu başlat
npm start

# Terminal 2: ngrok başlat
ngrok http 3000
```

ngrok sana bir URL verecek:
```
https://abc123.ngrok.io
```

Bu linki arkadaşlarınla paylaş!

**NOT**: Bilgisayarın açık olmalı ve ngrok çalışmalı.

---

## 📊 Karşılaştırma

| Platform | Ücretsiz | Sürekli Aktif | Hız | Kurulum |
|----------|----------|---------------|-----|---------|
| **Render** | ✅ | ⚠️ 15dk sonra uyur | Orta | Kolay |
| **Railway** | ✅ | ✅ | Hızlı | Çok Kolay |
| **Glitch** | ✅ | ✅ | Orta | Kolay |
| **ngrok** | ✅ | ⚠️ PC açık olmalı | Çok Hızlı | Orta |
| **Lokal** | ✅ | ⚠️ Aynı WiFi | En Hızlı | En Kolay |

---

## 💡 Öneriler

### Arkadaşlarınla Oynamak İçin:
- **En İyi**: Railway (sürekli aktif, hızlı)
- **Alternatif**: Glitch (sürekli aktif)
- **Geçici**: ngrok (çok hızlı ama PC açık olmalı)

### Herkese Açık Yayınlamak İçin:
- **En İyi**: Railway veya Render
- **Alternatif**: Glitch

### Sadece Evde Oynamak İçin:
- **En İyi**: Lokal ağ (en hızlı, ücretsiz)

---

## 🐛 Sorun Giderme

### Render'da "Application failed to respond"
- İlk açılış 1-2 dakika sürebilir
- Sayfayı yenile
- 15 dakika kullanılmazsa uyur, tekrar açılması gerekir

### Railway'de "Deployment failed"
- package.json'ı kontrol et
- Build log'ları incele
- Port 3000 kullandığından emin ol

### ngrok'ta "Tunnel not found"
- ngrok'u yeniden başlat
- Token'ı kontrol et
- Sunucunun çalıştığından emin ol

---

## 🎮 Deploy Sonrası

Oyun yayında! Şimdi:

1. **Linki paylaş**: Arkadaşlarına gönder
2. **Test et**: Farklı cihazlardan dene
3. **Güncelle**: Git push ile otomatik güncellenir
4. **İzle**: Render/Railway dashboard'dan logları izle

---

## 📝 Güncelleme Yapmak

```bash
# Değişiklikleri yap
git add .
git commit -m "Yeni özellik eklendi"
git push

# Render/Railway otomatik güncelleyecek!
```

---

## 🎉 Başarılar!

Oyunun artık internette! Arkadaşlarınla keyifli oyunlar! 🎮

Sorun mu var? GitHub'da issue aç!
