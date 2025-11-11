# ExpenseBook Deployment Guide

This guide explains how to deploy the ExpenseBook **frontend** to **Vercel** and the **backend** to **Render** using each platform's free tier. No GitHub Actions workflow is required—Vercel and Render handle the pipelines for you.

---

## 1. Frontend → Vercel

### Prerequisites
1. GitHub repo: `https://github.com/danial-001/ExpenseBook.git`
2. Vercel account (free tier is enough)

### Steps
1. Push the latest code to GitHub (main or the branch you want to deploy).
2. Sign in to [vercel.com](https://vercel.com) and click **Add New → Project**.
3. Import the `ExpenseBook` repository. Vercel auto-detects Vite.
4. Set the project settings:
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Install command**: `npm install`
   - **Output directory**: `dist`
5. Add environment variable `VITE_API_URL` pointing to your Render backend URL (you can add/update this later once the backend is live).
6. Click **Deploy**. Vercel will install dependencies, build, and host the site. It also sets up automatic redeploys on every push to the selected branch.

### After deployment
- Update the **Environment Variables** in Vercel whenever your backend URL changes.
- You can add a custom domain from Vercel’s dashboard if required.

---

## 2. Backend → Render

### Prerequisites
1. Render account (free tier) at [render.com](https://render.com)
2. PostgreSQL database URL (Render’s free PostgreSQL add-on or any other provider). Update your `.env` with it.

### Steps
1. Commit all backend files (especially `requirements.txt`).
2. Push the latest code to GitHub.
3. On Render, click **New → Web Service** and connect the same GitHub repo.
4. Configure the service:
   - **Name**: e.g., `expensebook-backend`
   - **Region**: pick the closest
   - **Branch**: `main`
   - **Root directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:create_app()`
5. Add the necessary environment variables under **Environment**:
   - `SECRET_KEY`
   - `JWT_SECRET_KEY`
   - `DATABASE_URL` (Render will auto-inject if using their PostgreSQL)
   - Any other config values the app expects.
6. Click **Create Web Service**. Render will build and deploy. The service URL will look like `https://expensebook-backend.onrender.com`.

### Persisting the database
- If you use Render’s PostgreSQL, create it first (**New → PostgreSQL**) and copy the connection string into your backend service’s `DATABASE_URL`.

---

## 3. Connecting Frontend & Backend
- Once the Render backend is live, copy the `https://...onrender.com/api` base URL.
- In Vercel project settings → Environment Variables, set `VITE_API_URL` to that value and redeploy.
- Locally, you can create a `.env` file in `frontend` containing `VITE_API_URL=http://localhost:5002/api` for dev.

---

## 4. Local Verification

Frontend:
```bash
cd frontend
npm install
npm run build
```

Backend:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
flask run --app app:create_app --debug
```

---

Deployment is now a matter of pushing to GitHub—Vercel and Render will rebuild automatically when your tracked branch changes.
