"""
app.py — Flask API for Maureen Nyambura Mwangi & Co Advocates
Database: SQLite (articles.db auto-created on first run)

Routes
------
GET    /api/articles              list all articles  (addnote counterpart)
POST   /api/articles              addnote — create article
GET    /api/articles/<id>         getnote — single article with full content
PUT    /api/articles/<id>         update article (partial)
DELETE /api/articles/<id>         delete article
GET    /api/articles/search?q=    full-text search
GET    /api/categories            distinct category list
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)  # allows requests from React dev server (localhost:3000)

DB_PATH = "articles.db"


# ── Database ──────────────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row   # rows behave like dicts
    return conn


def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS articles (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                title      TEXT    NOT NULL,
                summary    TEXT,
                content    TEXT    NOT NULL,
                author     TEXT    DEFAULT 'Admin',
                category   TEXT    DEFAULT 'General',
                created_at TEXT    NOT NULL,
                updated_at TEXT
            )
        """)
        conn.commit()
    print("✅  Database ready.")


# ── Route declarations ────────────────────────────────────────────────────────

@app.route("/api/articles", methods=["GET", "POST"])
def articles_collection():
    if request.method == "POST":
        return addnote()
    return getnotes()


@app.route("/api/articles/search", methods=["GET"])
def search():
    """GET /api/articles/search?q=<term>"""
    term = request.args.get("q", "").strip()
    if not term:
        return jsonify({"error": "Query parameter 'q' is required"}), 400
    pattern = f"%{term}%"
    with get_db() as conn:
        rows = conn.execute(
            """SELECT id, title, summary, author, category, created_at
               FROM articles
               WHERE title LIKE ? OR content LIKE ?
               ORDER BY created_at DESC""",
            (pattern, pattern),
        ).fetchall()
    return jsonify([dict(r) for r in rows])


@app.route("/api/articles/<int:article_id>", methods=["GET", "PUT", "DELETE"])
def article_resource(article_id):
    if request.method == "PUT":
        return update_article(article_id)
    if request.method == "DELETE":
        return delete_article(article_id)
    return getnote(article_id)


@app.route("/api/categories", methods=["GET"])
def get_categories():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT DISTINCT category FROM articles ORDER BY category"
        ).fetchall()
    return jsonify([r["category"] for r in rows])


# ── Handler functions ─────────────────────────────────────────────────────────

def getnotes():
    """Return all article summaries, newest first. Supports ?category= filter."""
    category = request.args.get("category", "").strip()
    with get_db() as conn:
        if category:
            rows = conn.execute(
                """SELECT id, title, summary, author, category, created_at
                   FROM articles WHERE category = ?
                   ORDER BY created_at DESC""",
                (category,),
            ).fetchall()
        else:
            rows = conn.execute(
                """SELECT id, title, summary, author, category, created_at
                   FROM articles ORDER BY created_at DESC"""
            ).fetchall()
    return jsonify([dict(r) for r in rows])


def addnote():
    """Create a new article. Expects JSON body with title and content."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "JSON body required"}), 400

    title   = (data.get("title")   or "").strip()
    content = (data.get("content") or "").strip()
    if not title or not content:
        return jsonify({"error": "title and content are required"}), 422

    now = datetime.utcnow().isoformat()
    with get_db() as conn:
        cur = conn.execute(
            """INSERT INTO articles (title, summary, content, author, category, created_at)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (
                title,
                (data.get("summary") or "").strip() or None,
                content,
                (data.get("author")   or "Admin").strip(),
                (data.get("category") or "General").strip(),
                now,
            ),
        )
        conn.commit()
        new_id = cur.lastrowid

    row = get_db().execute(
        "SELECT * FROM articles WHERE id = ?", (new_id,)
    ).fetchone()
    return jsonify(dict(row)), 201


def getnote(article_id):
    """Return a single article including full content."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM articles WHERE id = ?", (article_id,)
        ).fetchone()
    if not row:
        return jsonify({"error": "Article not found"}), 404
    return jsonify(dict(row))


def update_article(article_id):
    """Partial update — only fields present in the body are changed."""
    with get_db() as conn:
        existing = conn.execute(
            "SELECT id FROM articles WHERE id = ?", (article_id,)
        ).fetchone()
        if not existing:
            return jsonify({"error": "Article not found"}), 404

        data = request.get_json(silent=True) or {}
        fields, values = [], []

        for col in ("title", "summary", "content", "author", "category"):
            if col in data:
                fields.append(f"{col} = ?")
                values.append((data[col] or "").strip() or None)

        if not fields:
            return jsonify({"error": "No updatable fields provided"}), 400

        fields.append("updated_at = ?")
        values.append(datetime.utcnow().isoformat())
        values.append(article_id)

        conn.execute(
            f"UPDATE articles SET {', '.join(fields)} WHERE id = ?", values
        )
        conn.commit()

    row = get_db().execute(
        "SELECT * FROM articles WHERE id = ?", (article_id,)
    ).fetchone()
    return jsonify(dict(row))


def delete_article(article_id):
    """Permanently delete an article."""
    with get_db() as conn:
        existing = conn.execute(
            "SELECT id FROM articles WHERE id = ?", (article_id,)
        ).fetchone()
        if not existing:
            return jsonify({"error": "Article not found"}), 404
        conn.execute("DELETE FROM articles WHERE id = ?", (article_id,))
        conn.commit()
    return jsonify({"message": f"Article {article_id} deleted"}), 200


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    init_db()
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    debug = os.getenv('FLASK_DEBUG', 'false').lower() in ('1', 'true', 'yes')
    app.run(debug=debug, host=host, port=port)
