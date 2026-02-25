# FinePrint AI 🧾

An AI-powered Legal Agreement Risk Analyzer that detects hidden clauses and generates a risk score from user-uploaded agreements.

## 🎯 Product Objective
FinePrint AI allows users to upload legal agreements (PDFs) and uses a Machine Learning pipeline (BERT/Transformers) to:
- Detect risky legal clauses automatically
- Highlight dangerous terms (Auto Renewal, Hidden Charges, etc.)
- Convert legal jargon into simple English
- Assign a Legal Risk Score out of 100
- Generate a Negotiation Message for WhatsApp or Email

## 🏗️ Tech Stack
- **Backend**: Python, FastAPI, Prisma ORM, PostgreSQL, HuggingFace Transformers, PyMuPDF
- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, ShadCN UI, Framer Motion

## 🚀 Getting Started (Local Development)

### 1. Start the Database
The project requires a PostgreSQL database. A `docker-compose.yml` is provided.
```bash
docker-compose up -d db
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run Prisma Migrations
prisma db push

# Start the FastAPI server
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:3000` to view the app.

## ☁️ Deployment
### Backend (Render/Docker)
A `Dockerfile` is included in the `backend/` directory. You can deploy this to Render or any Docker-compatible hosting.
Ensure environment variables (`DATABASE_URL`, `SECRET_KEY`) are set.

### Frontend (Vercel)
The `frontend/` directory is Next.js 14 and is ready to be imported and deployed directly on Vercel.

## 📦 ML Pipeline Details
- **Clause Detection**: `facebook/bart-large-mnli` (Zero-shot classification)
- **Risk Severity**: `nlptown/bert-base-multilingual-uncased-sentiment`
- **Simplifier**: `t5-small` (Summarization/Translation)
