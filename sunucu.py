#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS ve cache ayarları
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 60)
        print("🎮 DÜNYA FETİH STRATEJİSİ - SUNUCU BAŞLATILDI")
        print("=" * 60)
        print(f"\n✅ Sunucu çalışıyor: http://localhost:{PORT}")
        print(f"✅ Tarayıcı otomatik açılacak...")
        print(f"\n⚠️  Sunucuyu durdurmak için: CTRL+C\n")
        print("=" * 60)
        
        # Tarayıcıyı otomatik aç
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Sunucu kapatılıyor...")
            print("👋 Görüşürüz!\n")

if __name__ == "__main__":
    main()
