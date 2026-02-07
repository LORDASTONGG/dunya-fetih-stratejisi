@echo off
chcp 65001 >nul
title GitHub Güncelleme
color 0A

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║          Multiplayer Fix - GitHub'a Yükle             ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Doğru dizine git
cd /d "%~dp0"

echo [►] Dizin: %CD%
echo.

REM Git repo kontrolü
if not exist ".git" (
    echo [HATA] .git klasörü bulunamadı!
    echo.
    echo [►] Önce Git başlatılmalı:
    echo     git init
    echo     git remote add origin GITHUB_URL
    echo.
    pause
    exit /b 1
)

echo [►] Değişiklikler ekleniyor...
git add .

echo [►] Commit yapılıyor...
git commit -m "Multiplayer socket.io fix - production ready"

echo [►] GitHub'a yükleniyor...
git push -u origin master

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ════════════════════════════════════════════════════════
    echo.
    echo [✓] BAŞARILI! Güncelleme GitHub'a yüklendi!
    echo.
    echo [►] Render otomatik güncelleyecek (1-2 dakika)
    echo.
    echo [►] Sonra tekrar dene!
    echo.
    echo ════════════════════════════════════════════════════════
) else (
    echo.
    echo [HATA] Yükleme başarısız!
    echo.
    echo Olası nedenler:
    echo - GitHub kullanıcı adı/token yanlış
    echo - Remote ayarlanmamış
    echo - İnternet bağlantısı yok
    echo.
)

echo.
pause
