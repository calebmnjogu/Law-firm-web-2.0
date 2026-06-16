# Deployment Guide - Render

## Quick Setup

### Backend Deployment
1. Go to [render.com](https://render.com)
2. Create **New Web Service**
3. Connect GitHub repo
4. Settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** Leave blank (uses `Procfile`)
   - **Environment:** Python 3
5. Deploy and copy the URL (e.g., `https://my-api.onrender.com`)

### Frontend Deployment
1. Update `law-firm-web-app/.env.production`:
   ```
   REACT_APP_API_URL=https://my-api.onrender.com
   ```
2. Push to GitHub
3. Create **New Static Site** on Render
4. Settings:
   - **Build Command:** `cd law-firm-web-app && npm install && npm run build`
   - **Publish Directory:** `law-firm-web-app/build`
5. Deploy

## Local Development
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000` and proxies `/api` to backend
- No `.env` file needed locally

## Production
- Frontend uses `REACT_APP_API_URL` from `.env.production`
- Backend served by Gunicorn
