@echo off
chcp 65001 >nul
title GitHub Güncelleme
color 0A

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║          Multiplayer Fix - GitHub'a Yükle             ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Değişiklikleri ekle
git add .

REM Commit
git commit -m "Multiplayer socket.io fix - production ready"

REM Push
git push

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
)

echo.
pause
