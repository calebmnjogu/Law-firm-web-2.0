# Maureen Nyambura Mwangi & Co — Website

Full-stack law firm website: **React (CRA) + Flask + SQLite**.

---

## Project structure

```
law-firm-web-2.0/
│
├── backend/
│   ├── app.py              Flask API  (all routes)
│   └── requirements.txt
│
├── law-firm-web-app/
│   ├── package.json        CRA — proxy → localhost:5000
│   ├── public/
│   │   ├── index.html
│   │   └── photo1.jpg      ← COPY YOUR HERO PHOTO HERE
│   └── src/
│       ├── index.js        React entry point
│       ├── index.css       Global reset + CSS variables
│       ├── api.js          All Flask API calls
│       ├── App.js          Full React app
│       └── App.module.css  All component styles
```

---

## 1 — Start the backend

```bash
cd backend
pip install -r requirements.txt
python app.py
# → http://localhost:5000
```

---

## 2 — Add your photo

```bash
cp photo1.jpg law-firm-web-app/public/photo1.jpg
```

---

## 3 — Start the frontend

Open a **second terminal**:

```bash
cd law-firm-web-app
npm install
npm start
# → http://localhost:3000  (opens automatically)
```

CRA's `"proxy"` field in `package.json` forwards every `/api` request to Flask,
so no CORS configuration is needed during development.

---

## API reference

| Method | Route | Description |
|--------|-------|-------------|
| `GET`    | `/api/articles`              | List all articles (`?category=` optional) |
| `POST`   | `/api/articles`              | **addnote** — create an article |
| `GET`    | `/api/articles/<id>`         | **getnote** — single article (full content) |
| `PUT`    | `/api/articles/<id>`         | Update article (partial — only sent fields change) |
| `DELETE` | `/api/articles/<id>`         | Delete article |
| `GET`    | `/api/articles/search?q=`    | Full-text search across title + content |
| `GET`    | `/api/categories`            | List distinct categories |

### POST body example

```json
{
  "title":    "Understanding Land Rights in Kenya",
  "summary":  "A brief overview of the Land Registration Act...",
  "content":  "Full article text here...",
  "author":   "Maureen N. Mwangi",
  "category": "Land Law"
}
```

---

## Admin panel

Click **Admin Login** in the Articles section.

Default password: `advocates2026`

> ⚠️ For production, replace the frontend password check with a proper
> Flask `/api/login` route that returns a JWT token.

---

## Production build

```bash
cd frontend && npm run build
# Serves the built files from frontend/build/
# Point nginx / Apache to frontend/build/ and proxy /api → Flask
```
# Law-firm-web-2.0
