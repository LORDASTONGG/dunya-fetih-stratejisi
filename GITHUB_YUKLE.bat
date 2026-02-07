@echo off
chcp 65001 >nul
title GitHub'a Yükle
color 0B

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║          GitHub'a Yükleme Scripti                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Git kontrolü
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [HATA] Git bulunamadı!
    echo.
    echo Git'i yüklemek için: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [✓] Git bulundu
echo.

REM Git başlatıldı mı kontrol et
if not exist ".git" (
    echo [►] Git başlatılıyor...
    git init
    git branch -M main
    echo [✓] Git başlatıldı
    echo.
)

REM Commit mesajı al
set /p COMMIT_MSG="Commit mesajı girin (Enter = 'Güncelleme'): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Güncelleme

echo.
echo [►] Dosyalar ekleniyor...
git add .

echo [►] Commit yapılıyor...
git commit -m "%COMMIT_MSG%"

echo.
echo ════════════════════════════════════════════════════════
echo.
echo [!] GitHub repo URL'ini gir (örnek: https://github.com/kullanici/repo.git)
echo [!] İlk kez ise önce GitHub'da repo oluştur!
echo.
set /p REPO_URL="GitHub Repo URL: "

if "%REPO_URL%"=="" (
    echo [HATA] URL girilmedi!
    pause
    exit /b 1
)

REM Remote kontrolü
git remote | findstr origin >nul
if %ERRORLEVEL% EQU 0 (
    echo [►] Remote güncelleniyor...
    git remote set-url origin %REPO_URL%
) else (
    echo [►] Remote ekleniyor...
    git remote add origin %REPO_URL%
)

echo.
echo [►] GitHub'a yükleniyor...
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ════════════════════════════════════════════════════════
    echo.
    echo [✓] BAŞARILI! Dosyalar GitHub'a yüklendi!
    echo.
    echo [►] Şimdi Render'a git:
    echo     1. https://dashboard.render.com
    echo     2. New + → Web Service
    echo     3. GitHub repo'nu bağla
    echo     4. Build: npm install
    echo     5. Start: npm start
    echo     6. Deploy!
    echo.
    echo ════════════════════════════════════════════════════════
) else (
    echo.
    echo [HATA] Yükleme başarısız!
    echo.
    echo Olası nedenler:
    echo - GitHub kullanıcı adı/token yanlış
    echo - Repo bulunamadı
    echo - İnternet bağlantısı yok
    echo.
    echo GitHub token oluşturmak için:
    echo https://github.com/settings/tokens
    echo.
)

echo.
pause
