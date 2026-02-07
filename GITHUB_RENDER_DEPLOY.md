# 🚀 GitHub + Render Deploy - Adım Adım

## 📋 Ön Hazırlık

### 1. GitHub Hesabı
- [github.com](https://github.com) - Hesap aç (ücretsiz)

### 2. Render Hesabı
- [render.com](https://render.com) - GitHub ile giriş yap (ücretsiz)

### 3. Git Kurulumu
- [git-scm.com](https://git-scm.com/download/win) - Windows için Git indir

---

## 🎯 ADIM 1: GitHub'a Yükle

### Terminal'de (veya Git Bash):

```bash
# 1. Git başlat
git init

# 2. Tüm dosyaları ekle
git add .

# 3. İlk commit
git commit -m "Multiplayer strateji oyunu ilk versiyon"

# 4. Ana branch'i main yap
git branch -M main
```

### GitHub'da Repo Oluştur:

1. [github.com/new](https://github.com/new) git
2. Repository name: `dunya-fetih-stratejisi` (veya istediğin isim)
3. Public seç
4. **README ekleme, .gitignore ekleme!** (zaten var)
5. "Create repository" tıkla

### Repo'yu Bağla ve Yükle:

```bash
# 5. GitHub repo'nu bağla (KULLANICI_ADIN'ı değiştir!)
git remote add origin https://github.com/KULLANICI_ADIN/dunya-fetih-stratejisi.git

# 6. GitHub'a yükle
git push -u origin main
```

**NOT**: İlk push'ta GitHub kullanıcı adı ve token isteyecek.

---

## 🎨 ADIM 2: Render'da Deploy Et

### 1. Render'a Git
- [dashboard.render.com](https://dashboard.render.com)
- GitHub ile giriş yap

### 2. Yeni Web Service Oluştur
1. "New +" butonuna tıkla
2. "Web Service" seç
3. GitHub repo'nu bul ve "Connect" tıkla

### 3. Ayarları Yap

```
Name: dunya-fetih-stratejisi
Region: Frankfurt (veya en yakın)
Branch: main
Root Directory: (boş bırak)
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 4. Plan Seç
- **Free** seç (ücretsiz)
- Kredi kartı gerekmez!

### 5. Deploy Et
- "Create Web Service" tıkla
- Deploy başlayacak (2-3 dakika)

### 6. URL'i Al
- Deploy bitince URL göreceksin:
  ```
  https://dunya-fetih-stratejisi.onrender.com
  ```
- Bu linki arkadaşlarınla paylaş!

---

## ✅ Tamamlandı!

Oyunun artık internette! 🎉

### Test Et:
1. URL'i tarayıcıda aç
2. "Çok Oyunculu" seç
3. Oda oluştur
4. Arkadaşlarını davet et!

---

## 🔄 Güncelleme Yapmak

Oyunda değişiklik yaptın mı? Çok kolay:

```bash
# 1. Değişiklikleri kaydet
git add .
git commit -m "Yeni özellik eklendi"

# 2. GitHub'a yükle
git push

# 3. Render otomatik güncelleyecek!
```

---

## ⚠️ Önemli Notlar

### Render Ücretsiz Plan:
- ✅ Sınırsız kullanım
- ⚠️ 15 dakika kullanılmazsa uyur
- ⚠️ İlk açılış 30-60 saniye sürebilir
- ✅ Otomatik uyanır

### İlk Açılış Yavaşsa:
- Normal! Sunucu uyanıyor
- 1 dakika bekle
- Sayfayı yenile

### Sürekli Aktif Tutmak İçin:
- UptimeRobot gibi servisler kullan (ücretsiz)
- Her 5 dakikada bir ping atar
- Sunucu hiç uyumaz

---

## 🐛 Sorun Giderme

### "Application failed to respond"
```
Çözüm: 1-2 dakika bekle, sayfa yenile
Neden: Sunucu uyanıyor
```

### "Build failed"
```
Çözüm: package.json'ı kontrol et
Render logs'u incele
```

### "Repository not found"
```
Çözüm: Render'a GitHub erişimi ver
Settings → GitHub → Reconnect
```

### Git push hatası
```
Çözüm: GitHub token oluştur
Settings → Developer settings → Personal access tokens
Token'ı şifre olarak kullan
```

---

## 📱 Mobil Uyumlu

Oyun mobilde de çalışır! Arkadaşların telefondan da girebilir.

---

## 🎮 Bonus: Custom Domain

Kendi domain'in var mı? (örn: oyunum.com)

1. Render Settings → Custom Domain
2. Domain'i ekle
3. DNS ayarlarını yap
4. Hazır!

---

## 💡 Pro İpuçları

1. **README.md güncelle**: Oyunun linkini ekle
2. **GitHub Pages**: Statik dosyalar için kullan
3. **Environment Variables**: Gizli bilgiler için
4. **Logs**: Render dashboard'dan hataları izle
5. **Analytics**: Kaç kişi oynadığını gör

---

## 🎉 Başarılar!

Oyunun artık dünya çapında erişilebilir! 🌍

Linki paylaş ve arkadaşlarınla oyna! 🎮
