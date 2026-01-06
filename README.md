# Covenant Logic Compiler

AI-powered system that extracts covenant definitions from LMA loan agreements and converts them to executable Python code.

## Quick Start

### Prerequisites

- Python 3.11+
- AWS account (for S3)
- Groq API key (free at https://console.groq.com)

### 1. Clone and Setup

```bash
git clone <repo-url>
cd lmahack/backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Variables

Create `.env` in the `backend` folder:

```env
# AWS S3 (for PDF storage)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your-bucket-name

# Groq AI (free API for LLM)
GROQ_API_KEY=gsk_your_groq_key
```

**Get your keys:**

- AWS: https://console.aws.amazon.com/iam
- Groq: https://console.groq.com (free, no credit card)

### 3. Run the Server

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs for Swagger UI.

---

## API Endpoints

| Endpoint                           | Method | Description                |
| ---------------------------------- | ------ | -------------------------- |
| `/api/v1/agreements/upload`        | POST   | Upload LMA PDF             |
| `/api/v1/agreements/extract`       | POST   | Extract covenants using AI |
| `/api/v1/agreements/generate-code` | POST   | Generate Python functions  |
| `/api/v1/agreements/calculate`     | POST   | Calculate compliance       |

See `API_DOCS.md` for full documentation with examples.

---

## Test the API

### 1. Upload a PDF

```bash
curl -X POST "http://localhost:8000/api/v1/agreements/upload" \
  -F "file=@your_agreement.pdf"
```

### 2. Extract Covenants

```bash
curl -X POST "http://localhost:8000/api/v1/agreements/extract" \
  -H "Content-Type: application/json" \
  -d '{"agreement_id": "YOUR_AGREEMENT_ID"}'
```

### 3. Calculate Compliance

```bash
curl -X POST "http://localhost:8000/api/v1/agreements/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "agreement_id": "YOUR_AGREEMENT_ID",
    "consolidated_ebit": 50000000,
    "depreciation": 5000000,
    "amortisation": 2000000,
    "impairment_costs": 0,
    "senior_debt": 200000000,
    "total_debt": 350000000,
    "interest_expense": 15000000,
    "principal_payments": 10000000
  }'
```

---

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── agreements.py      # API endpoints
│   ├── agents/
│   │   └── pdf_extractor.py   # AI extraction agent
│   ├── services/
│   │   ├── rag_service.py     # Vector search (ChromaDB)
│   │   ├── pdf_service.py     # PDF parsing
│   │   └── s3_service.py      # AWS S3 storage
│   ├── schemas/
│   │   └── agreement.py       # Pydantic models
│   ├── config.py              # Settings
│   └── main.py                # FastAPI app
├── chroma_db/                 # Local vector database (auto-created)
├── requirements.txt
└── .env
```

---

## How It Works

1. **Upload PDF** → Stored in S3
2. **Extract** → RAG splits PDF into chunks, semantic search finds covenant sections, AI extracts definitions
3. **Generate Code** → AI creates Python functions for covenant calculations
4. **Calculate** → Run calculations on financial data, get compliance status

---

## Tech Stack

- **FastAPI** - API framework
- **ChromaDB** - Local vector database for RAG
- **Sentence Transformers** - Text embeddings
- **Groq + Llama 3.3** - AI extraction (free tier)
- **AWS S3** - PDF storage
- **PyMuPDF** - PDF parsing

---

## Troubleshooting

### "GROQ_API_KEY not set"

Add `GROQ_API_KEY` to your `.env` file.

### "Token limit exceeded"

Groq free tier has 12K token limit. The system is configured to handle this.

### "Module not found"

Run `pip install -r requirements.txt` in the virtual environment.
