# 🏦 Covenant Logic Compiler

**AI-powered compliance automation for LMA loan agreements**

> Transform complex legal covenants into executable code, automate compliance testing, and generate audit-ready certificates — in minutes, not weeks.

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://your-frontend-url.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Cloud%20Run-blue)](https://covenant-api-xxxxx.run.app)

---

## 🎯 Problem We Solve

**The Logic-to-Code Gap in Covenant Compliance**

| Current Pain Point                        | Our Solution                               |
| :---------------------------------------- | :----------------------------------------- |
| 📄 Manual PDF review (days/weeks)         | ⚡ AI extracts covenants in seconds        |
| 🧮 Excel-based calculations (error-prone) | 🔒 Executable Python functions (auditable) |
| 📝 Static compliance reports              | 📊 Real-time testing with any financials   |
| ❌ No audit trail                         | ✅ LMA-compliant PDF certificates          |

---

## ✨ Key Features

### 1️⃣ Smart Document Upload

Upload any LMA-standard loan agreement PDF. Securely stored in AWS S3.

### 2️⃣ AI Covenant Extraction

RAG-powered semantic search identifies covenant sections. Groq Llama 3.3 extracts precise definitions with limits and formulas.

### 3️⃣ Code Generation

Automatically generates executable Python functions for each covenant calculation (Leverage Ratio, DSCR, Interest Cover, etc.).

### 4️⃣ Real-Time Compliance Testing

Input financial data, run calculations, get instant pass/fail results with detailed breakdowns.

### 5️⃣ Digital Signature & Certification

Sign directly on-screen. Generate LMA-compliant PDF certificates with full audit traceability.

---

## 🎥 Demo Video

> _~3 minute walkthrough showing the complete flow_

[📺 Watch Demo](https://your-demo-video-link.com)

---

## 🌐 Live URLs

| Component       | URL                                                        |
| :-------------- | :--------------------------------------------------------- |
| **Frontend**    | https://your-frontend.vercel.app                           |
| **Backend API** | https://covenant-api-609382621286.asia-south1.run.app      |
| **API Docs**    | https://covenant-api-609382621286.asia-south1.run.app/docs |

---

## 👥 Target Users

- **Credit Analysts** — Faster covenant compliance checks
- **Loan Administrators** — Automated quarterly testing
- **Audit Teams** — Traceable, verifiable calculations
- **Legal/Ops Teams** — Reduced manual document review

---

## 💰 Commercial Viability

| Component             | Description                                              |
| :-------------------- | :------------------------------------------------------- |
| **Value Proposition** | 90% reduction in covenant compliance time                |
| **Scalability**       | Serverless architecture, handles unlimited agreements    |
| **Efficiency Gains**  | Days → Minutes for each compliance cycle                 |
| **Market Impact**     | Standardizes covenant interpretation across institutions |

---

## 🛠️ Tech Stack

| Layer              | Technology                                            |
| :----------------- | :---------------------------------------------------- |
| **Frontend**       | Next.js 14, TypeScript, Tailwind CSS, Shadcn UI       |
| **Backend**        | FastAPI (Python), Pydantic, Uvicorn                   |
| **AI/ML**          | Groq Llama 3.3, Sentence Transformers, ChromaDB (RAG) |
| **Storage**        | AWS S3 (PDFs), ChromaDB (vectors)                     |
| **Deployment**     | Vercel (frontend), Google Cloud Run (backend)         |
| **PDF Generation** | ReportLab                                             |

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Python 3.11+
- Node.js 18+
- AWS account (S3)
- Groq API key (free at https://console.groq.com)

### Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your API keys

uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 to use the app.

---

## 📁 Project Structure

```
lmahack/
├── frontend/                 # Next.js web app
│   ├── src/
│   │   ├── app/dashboard/    # 6-step compliance wizard
│   │   ├── components/       # Reusable UI components
│   │   └── lib/api.ts        # Backend API client
│   └── package.json
│
├── backend/                  # FastAPI server
│   ├── app/
│   │   ├── api/              # REST endpoints
│   │   ├── agents/           # AI extraction logic
│   │   ├── services/         # Business logic (RAG, S3, PDF)
│   │   └── main.py           # App entry point
│   ├── Dockerfile            # Cloud Run deployment
│   └── requirements.txt
│
└── README.md
```

---

## 📡 API Endpoints

| Endpoint                           | Method | Description                     |
| :--------------------------------- | :----- | :------------------------------ |
| `/api/v1/agreements/upload`        | POST   | Upload LMA PDF                  |
| `/api/v1/agreements/extract`       | POST   | AI-extract covenants            |
| `/api/v1/agreements/generate-code` | POST   | Generate Python functions       |
| `/api/v1/agreements/calculate`     | POST   | Run compliance calculations     |
| `/api/v1/agreements/certificate`   | POST   | Generate signed PDF certificate |
| `/health`                          | GET    | Health check                    |

Full docs: `/docs` (Swagger UI)

---

## 🔒 Security

- API keys stored as environment variables
- HTTPS everywhere (Cloud Run + Vercel)
- PDFs stored in private S3 bucket
- No sensitive data logged

---

## 🏆 LMA Edge Hackathon

**Category:** Keeping Loans on Track

This project automates the critical but manual process of covenant compliance testing — a key pain point for loan administrators who currently rely on spreadsheets and manual PDF review.

---

## 📄 License

MIT

---

## 👨‍💻 Team

Built with ❤️ for the LMA Edge Hackathon 2026
