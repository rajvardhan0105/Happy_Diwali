#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
🪔 SHUBH DIWALI WISH - PYTHON WEB SERVER & API 🪔
Backend for the Festive Diwali Greetings Application
Provides Dynamic REST APIs, Wish Wall Persistence, and Auto-Browser Launch
=============================================================================
"""

import os
import sys
import json
import time
import datetime
import webbrowser
import threading

PORT = 5000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WISHES_FILE = os.path.join(BASE_DIR, 'wishes.json')

# Initial pre-populated heartwarming wishes
DEFAULT_WISHES = [
    {
        "id": 1,
        "name": "Aarav Sharma",
        "text": "Wishing everyone immense wealth, supreme joy, and glowing health this Deepavali! May all your noble dreams come true.",
        "time": "Today, 10:30 AM"
    },
    {
        "id": 2,
        "name": "Pooja Patel",
        "text": "May Maa Lakshmi bless your sweet home with eternal abundance, harmony, and positivity. Shubh Deepavali to all!",
        "time": "Today, 12:15 PM"
    },
    {
        "id": 3,
        "name": "Vikram Malhotra",
        "text": "Happy Diwali to all friends and family! Light lamps of gratitude, hope, and compassion everywhere.",
        "time": "Today, 02:40 PM"
    },
    {
        "id": 4,
        "name": "Ananya Iyer",
        "text": "May this holy festival of lights illuminate your path toward wisdom, great achievements, and peaceful days ahead.",
        "time": "Today, 04:20 PM"
    }
]

def load_wishes():
    """Load community wishes from wishes.json or return default wishes."""
    if not os.path.exists(WISHES_FILE):
        save_wishes(DEFAULT_WISHES)
        return DEFAULT_WISHES
    try:
        with open(WISHES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"[!] Warning reading wishes.json: {e}")
        return DEFAULT_WISHES

def save_wishes(wishes):
    """Save community wishes to wishes.json."""
    try:
        with open(WISHES_FILE, 'w', encoding='utf-8') as f:
            json.dump(wishes, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[!] Error saving wishes.json: {e}")

# Try importing Flask; provide standard library fallback if missing
try:
    from flask import Flask, send_from_directory, request, jsonify, render_template

    app = Flask(__name__, static_folder='static', template_folder='.')

    @app.route('/')
    def index():
        return send_from_directory(BASE_DIR, 'index.html')

    @app.route('/static/<path:filename>')
    def serve_static(filename):
        return send_from_directory(os.path.join(BASE_DIR, 'static'), filename)

    @app.route('/api/wishes', methods=['GET'])
    def get_wishes():
        wishes = load_wishes()
        return jsonify({"status": "success", "wishes": wishes})

    @app.route('/api/wishes', methods=['POST'])
    def add_wish():
        data = request.get_json(force=True, silent=True) or {}
        name = data.get('name', '').strip() or 'Anonymous Devotee'
        text = data.get('text', '').strip()

        if not text:
            return jsonify({"status": "error", "message": "Wish message cannot be empty"}), 400

        now_str = datetime.datetime.now().strftime("%b %d, %I:%M %p")
        wishes = load_wishes()
        new_entry = {
            "id": int(time.time()),
            "name": name,
            "text": text,
            "time": now_str
        }
        wishes.insert(0, new_entry)
        save_wishes(wishes)

        return jsonify({"status": "success", "wish": new_entry}), 201

    @app.route('/api/quotes', methods=['GET'])
    def get_quotes():
        quotes = [
            {
                "sanskrit": "शुभं करोति कल्याणम् आरोग्यम् धनसंपदा ।",
                "meaning": "Salutations to the holy light that bestows auspiciousness, vibrant health, and true wealth."
            },
            {
                "sanskrit": "तमसो मा ज्योतिर्गमय ।",
                "meaning": "Lead us from darkness unto light, from ignorance unto wisdom."
            },
            {
                "sanskrit": "ॐ श्रीं महालक्ष्म्यै नमः ।",
                "meaning": "Divine prostrations to Goddess Mahalakshmi, the granter of celestial blessings."
            }
        ]
        return jsonify({"status": "success", "quotes": quotes})

    def run_server():
        app.run(host='127.0.0.1', port=PORT, debug=False)

except ImportError:
    # Standard library fallback using http.server
    import http.server
    import urllib.parse

    class DiwaliHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=BASE_DIR, **kwargs)

        def do_GET(self):
            parsed_path = urllib.parse.urlparse(self.path)
            if parsed_path.path == '/api/wishes':
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                response = {"status": "success", "wishes": load_wishes()}
                self.wfile.write(json.dumps(response).encode('utf-8'))
            else:
                super().do_GET()

        def do_POST(self):
            parsed_path = urllib.parse.urlparse(self.path)
            if parsed_path.path == '/api/wishes':
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length).decode('utf-8')
                data = json.loads(body) if body else {}

                name = data.get('name', '').strip() or 'Anonymous Devotee'
                text = data.get('text', '').strip()
                now_str = datetime.datetime.now().strftime("%b %d, %I:%M %p")

                wishes = load_wishes()
                new_entry = {
                    "id": int(time.time()),
                    "name": name,
                    "text": text,
                    "time": now_str
                }
                wishes.insert(0, new_entry)
                save_wishes(wishes)

                self.send_response(201)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "wish": new_entry}).encode('utf-8'))
            else:
                self.send_response(404)
                self.end_headers()

    def run_server():
        server_address = ('127.0.0.1', PORT)
        httpd = http.server.HTTPServer(server_address, DiwaliHTTPRequestHandler)
        httpd.serve_forever()

def open_browser():
    """Wait for server to bind then open default browser."""
    time.sleep(1.2)
    url = f"http://127.0.0.1:{PORT}"
    print(f"\n[✨] Opening your Diwali Wish Website in default browser: {url}")
    webbrowser.open(url)

if __name__ == '__main__':
    print("=" * 65)
    print("      🪔  SHUBH DIWALI FESTIVE WEBSITE SERVER  🪔")
    print("=" * 65)
    print(f" [*] Serving Diwali Wish Website at: http://127.0.0.1:{PORT}")
    print(f" [*] Project Directory: {BASE_DIR}")
    print(" [*] Interactive Diyas, Fireworks Engine, & Wish Wall Active!")
    print(" [*] Press Ctrl + C in this terminal to stop the server.")
    print("=" * 65)

    # Launch browser in a background thread
    threading.Thread(target=open_browser, daemon=True).start()

    try:
        run_server()
    except KeyboardInterrupt:
        print("\n\n[🪔] Shubh Deepavali! Web server stopped gracefully. Namaste!")
