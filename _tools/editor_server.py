import json
import re
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

PORT = 8787
BASE_DIR = Path(__file__).parent
POSTS_JS = BASE_DIR.parent / "data" / "posts.js"
EDITOR_HTML = BASE_DIR / "editor.html"


def prepend_post(title: str, date: str, content: str):
    text = POSTS_JS.read_text(encoding="utf-8")
    content = content.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n").replace("\r", "")
    entry = f'  {{\n    title: "{title}",\n    date: "{date}",\n    content: "{content}"\n  }},\n'
    new_text = re.sub(r"(const posts\s*=\s*\[)\s*\n", r"\1\n" + entry, text, count=1)
    POSTS_JS.write_text(new_text, encoding="utf-8")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # 關掉終端機 log

    def do_GET(self):
        if self.path == "/" or self.path == "/editor.html":
            content = EDITOR_HTML.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(content)
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == "/add-post":
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            title = body.get("title", "").strip()
            date = body.get("date", "").strip()
            content = body.get("content", "").strip()

            if not (title and date and content):
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"ok":false,"error":"missing fields"}')
                return

            prepend_post(title, date, content)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"ok":true}')
        else:
            self.send_response(404)
            self.end_headers()


if __name__ == "__main__":
    server = HTTPServer(("localhost", PORT), Handler)
    url = f"http://localhost:{PORT}"
    print(f"編輯器已啟動：{url}")
    print("按 Ctrl+C 停止伺服器")
    webbrowser.open(url)
    server.serve_forever()
