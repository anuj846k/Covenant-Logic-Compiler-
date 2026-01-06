# Project Glossary - Terms & Concepts

## 🏦 Finance Terms (LMA Loan Agreements)

### Parties

| Term                     | Definition                                                                      |
| ------------------------ | ------------------------------------------------------------------------------- |
| **Senior Lenders**       | Main banks providing the primary loan. Get paid FIRST if company defaults       |
| **Super Senior Lenders** | Special lenders with HIGHER priority than Senior. Get paid before everyone else |
| **Borrower**             | The company taking the loan                                                     |
| **LMA**                  | Loan Market Association - standard templates for loan agreements                |

### Key Metrics

| Term                                   | Definition                                                    | Formula                                               |
| -------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| **EBITDA**                             | Earnings Before Interest, Tax, Depreciation & Amortization    | Profit + Interest + Tax + Depreciation + Amortization |
| **Consolidated EBITDA**                | EBITDA for the entire corporate group (parent + subsidiaries) | Sum of all group companies' EBITDA                    |
| **Leverage Ratio**                     | How much debt relative to earnings                            | Total Debt ÷ EBITDA                                   |
| **Debt Service Coverage Ratio (DSCR)** | Can the company afford to pay its debts?                      | Cashflow ÷ (Interest + Principal Payments)            |
| **Interest Coverage Ratio**            | Can they pay the interest?                                    | EBITDA ÷ Interest Expense                             |

### Covenant Terms

| Term                   | Definition                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------- |
| **Covenant**           | A promise/condition in a loan agreement the borrower must keep                         |
| **Financial Covenant** | A covenant based on financial ratios (e.g., "Leverage ≤ 6.75x")                        |
| **Add-backs**          | Items ADDED back to profit when calculating EBITDA (depreciation, restructuring costs) |
| **Deductions**         | Items SUBTRACTED when calculating EBITDA (non-cash income, asset sale gains)           |
| **Caps**               | Maximum limits on certain adjustments (e.g., "synergies not exceeding 25%")            |
| **Step-down Schedule** | Covenant limits that get stricter over time (e.g., 6.75x → 6.50x → 6.25x)              |
| **Quarter Date**       | Financial testing date every 3 months                                                  |
| **First Test Date**    | First date when covenants are tested after loan starts                                 |

### Financial Data Inputs (for /calculate endpoint)

| Field                  | What It Is                                                               | Example |
| ---------------------- | ------------------------------------------------------------------------ | ------- |
| **consolidated_ebit**  | Operating Profit - Revenue minus operating costs (before interest & tax) | £50M    |
| **depreciation**       | Non-cash expense for wear on physical assets (buildings, machines)       | £5M     |
| **amortisation**       | Non-cash expense for intangible assets (patents, goodwill)               | £2M     |
| **impairment_costs**   | Write-downs when assets lose value unexpectedly                          | £0      |
| **senior_debt**        | Loans from main banks - get paid FIRST if company fails                  | £200M   |
| **total_debt**         | ALL debt (senior + junior + other loans)                                 | £350M   |
| **interest_expense**   | Annual interest payments on the debt                                     | £15M    |
| **principal_payments** | Repayment of the actual loan (not interest)                              | £10M    |

---

## 🤖 Tech Terms (AI/ML)

### RAG (Retrieval Augmented Generation)

| Term          | Definition                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------- |
| **RAG**       | Technique to handle large documents with LLMs: split → embed → search → send relevant parts |
| **Chunk**     | A small piece of text (2000 chars each in our system)                                       |
| **Embedding** | Converting text to numbers (vectors) that represent meaning                                 |
| **Vector**    | Array of numbers representing text meaning, e.g., [0.12, -0.34, 0.78, ...]                  |

### Databases

| Term                  | Definition                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| **ChromaDB**          | Vector database for storing embeddings and doing similarity search. Runs locally (no server needed) |
| **Vector Database**   | Database specialized for storing vectors and finding similar ones                                   |
| **Embedded Database** | Database stored as local files (like SQLite), no separate server required                           |

### Search Types

| Term                  | Definition                                 | Example                                              |
| --------------------- | ------------------------------------------ | ---------------------------------------------------- |
| **Keyword Search**    | Find exact word matches                    | Query "car" → only finds documents with "car"        |
| **Semantic Search**   | Find by MEANING, not just words            | Query "car" → finds "automobile", "vehicle", "sedan" |
| **Similarity Search** | Find vectors that are mathematically close | Similar meanings = similar numbers                   |

### AI/LLM Terms

| Term                      | Definition                                           |
| ------------------------- | ---------------------------------------------------- |
| **LLM**                   | Large Language Model (like GPT, Gemini, Llama)       |
| **Groq**                  | Fast, free LLM provider using custom chips           |
| **Llama**                 | Open-source LLM from Meta, used via Groq             |
| **Gemini**                | Google's LLM (we hit quota limits here)              |
| **Token**                 | Unit of text (~4 characters). LLMs have token limits |
| **TPM**                   | Tokens Per Minute - rate limit for APIs              |
| **Agno**                  | Python framework for building AI agents              |
| **Sentence Transformers** | ML model that converts text to vectors               |

---

## 📁 Project Files

| File               | Purpose                                                      |
| ------------------ | ------------------------------------------------------------ |
| `rag_service.py`   | Chunks PDF, creates embeddings, stores in ChromaDB, searches |
| `pdf_extractor.py` | AI agent that extracts covenant definitions                  |
| `agreements.py`    | API endpoints for upload, extract, generate code             |
| `pdf_service.py`   | Reads and parses PDF files                                   |
| `s3_service.py`    | Uploads/downloads files to AWS S3                            |
| `chroma_db/`       | Local folder where ChromaDB stores vector data               |

---

## 🔄 How RAG Works (Flow)

```
1. CHUNK: Split 415-page PDF → 612 chunks (2000 chars each)
2. EMBED: Convert each chunk → vector [0.12, -0.34, ...]
3. STORE: Save vectors in ChromaDB (local SQLite file)
4. QUERY: "leverage ratio limit" → find similar vectors
5. RETRIEVE: Get top matching chunks (from pages 219, 220, 224)
6. SEND TO LLM: Only send relevant chunks (fits token limit)
7. EXTRACT: LLM returns structured covenant data as JSON
```

---

## 🎯 Why This Matters

**Problem**: Bank analysts manually read 400+ page loan agreements to find covenant definitions. Takes days.

**Solution**: AI automatically extracts covenants in seconds, enabling instant compliance monitoring.

---

_Last updated: January 2026_
