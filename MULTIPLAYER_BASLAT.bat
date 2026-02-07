@echo off
chcp 65001 >nul
title Dünya Fetih Stratejisi - Multiplayer Sunucu
color 0A

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   Dünya Fetih Stratejisi - Multiplayer Sunucu         ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Node.js kontrolü
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [HATA] Node.js bulunamadı!
    echo.
    echo Node.js'i yüklemek için: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js bulundu
echo.

REM node_modules kontrolü
if not exist "node_modules" (
    echo [!] Bağımlılıklar yükleniyor...
    echo.
    call npm install
    echo.
)

echo [✓] Bağımlılıklar hazır
echo.
echo ════════════════════════════════════════════════════════
echo.
echo [►] Sunucu başlatılıyor...
echo.
echo     Lokal: http://localhost:3000
echo.

REM IP adresini göster
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
echo     Ağ:    http://%IP::=%:3000
echo.
echo ════════════════════════════════════════════════════════
echo.
echo [i] Sunucuyu durdurmak için: CTRL+C
echo.

REM Sunucuyu başlat
node server.js

pause
