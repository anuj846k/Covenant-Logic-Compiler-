# Covenant Logic Compiler - API Documentation

**Base URL:** `http://localhost:8000/api/v1/agreements`

---

## Endpoints

### 1. Upload PDF

**POST** `/upload`

Upload an LMA loan agreement PDF.

**Request:**

```
Content-Type: multipart/form-data
file: <PDF file>
```

**Response:**

```json
{
  "agreement_id": "agr_abc123",
  "filename": "agreement.pdf",
  "page_count": 415,
  "s3_key": "agreements/abc123_agreement.pdf",
  "upload_time": "2026-01-06T16:00:00.000000",
  "definitions_found": true,
  "definitions_page_range": "200-300"
}
```

---

### 2. Extract Covenants

**POST** `/extract`

Extract covenant definitions from uploaded PDF using AI.

**Request:**

```json
{
  "agreement_id": "agreements/48c2e458_aggrementdemo.pdf"
}
```

**Response:**

```json
{
  "agreement_id": "agreements/48c2e458_aggrementdemo.pdf",
  "extraction_time": "2026-01-06T17:24:11.099906",
  "success": true,
  "ebitda_definition": {
    "base_metric": "operating profit",
    "section_ref": "Various sections",
    "page": "Various pages",
    "add_backs": [
      {
        "name": "depreciation",
        "section_ref": "Various sections",
        "page": "Various pages"
      },
      {
        "name": "amortization",
        "section_ref": "Various sections",
        "page": "Various pages"
      },
      {
        "name": "impairment costs",
        "section_ref": "Various sections",
        "page": "Various pages"
      }
    ],
    "deductions": [],
    "caps": [
      {
        "item": "synergies",
        "cap_type": "pro forma increase",
        "cap_value": "full run rate effect",
        "section_ref": "Clause 24.3",
        "page": "224-225"
      }
    ]
  },
  "covenants": [
    {
      "name": "Leverage Ratio",
      "formula": "Consolidated Total Net Debt / Consolidated Pro Forma EBITDA",
      "legal_text": "The ratio shall not exceed...",
      "section_ref": "Clause 24.2(a)(i)(A)",
      "page": "224",
      "limit_value": 6.75,
      "limit_type": "max"
    },
    {
      "name": "Leverage Ratio",
      "formula": "Consolidated Total Net Debt / Consolidated Pro Forma EBITDA",
      "section_ref": "Clause 24.2(b)(i)(A)",
      "page": "225",
      "limit_value": 7.5,
      "limit_type": "max"
    },
    {
      "name": "Debt Service Coverage Ratio",
      "formula": "Consolidated Pro Forma EBITDA / Consolidated Debt Service",
      "section_ref": "Clause 24.2(c)(i)",
      "page": "225",
      "limit_value": 1,
      "limit_type": "min"
    }
  ]
}
```

---

### 3. Generate Code

**POST** `/generate-code`

Generate Python calculation functions from extracted covenants.

**Request:**

```json
{
  "agreement_id": "agreements/48c2e458_aggrementdemo.pdf"
}
```

**Response:**

```json
{
  "agreement_id": "agreements/48c2e458_aggrementdemo.pdf",
  "code": "def calculate_ebitda(...):\n    ...\n\ndef calculate_leverage_ratio(...):\n    ...",
  "functions": [
    "calculate_ebitda",
    "calculate_leverage_ratio",
    "calculate_debt_service_coverage_ratio"
  ],
  "generation_time": "2026-01-06T17:26:01.886558",
  "contract_refs": []
}
```

---

### 4. Calculate Compliance

**POST** `/calculate`

Calculate covenant compliance using financial data.

**Request:**

```json
{
  "agreement_id": "agreements/48c2e458_aggrementdemo.pdf",
  "consolidated_ebit": 50000000,
  "depreciation": 5000000,
  "amortisation": 2000000,
  "impairment_costs": 0,
  "senior_debt": 200000000,
  "total_debt": 350000000,
  "interest_expense": 15000000,
  "principal_payments": 10000000
}
```

**Response (Compliant):**

```json
{
  "agreement_id": "agreements/48c2e458_aggrementdemo.pdf",
  "calculation_time": "2026-01-06T17:26:58.293542",
  "ebitda": 57000000,
  "covenants": [
    {
      "name": "Senior Leverage Ratio",
      "value": 3.51,
      "limit": 6.75,
      "limit_type": "max",
      "compliant": true,
      "section_ref": "Section 24.2(a)"
    },
    {
      "name": "Total Leverage Ratio (Super Senior)",
      "value": 6.14,
      "limit": 7.5,
      "limit_type": "max",
      "compliant": true,
      "section_ref": "Section 24.2(b)"
    },
    {
      "name": "Debt Service Coverage Ratio",
      "value": 2.28,
      "limit": 1,
      "limit_type": "min",
      "compliant": true,
      "section_ref": "Section 24.2(c)"
    }
  ],
  "all_compliant": true,
  "breached_covenants": [],
  "trace": {
    "ebitda_components": {
      "consolidated_ebit": { "value": 50000000, "ref": "Section 24" },
      "depreciation": { "value": 5000000, "ref": "Section 24" },
      "amortisation": { "value": 2000000, "ref": "Section 24" },
      "impairment_costs": { "value": 0, "ref": "Section 24" }
    },
    "debt_figures": {
      "senior_debt": 200000000,
      "total_debt": 350000000
    },
    "debt_service": {
      "interest_expense": 15000000,
      "principal_payments": 10000000
    }
  }
}
```

**Response (Non-Compliant):**

```json
{
  "agreement_id": "agreements/48c2e458_aggrementdemo.pdf",
  "ebitda": 39000000,
  "covenants": [
    {
      "name": "Senior Leverage Ratio",
      "value": 7.69,
      "limit": 6.75,
      "compliant": false
    },
    {
      "name": "Total Leverage Ratio (Super Senior)",
      "value": 12.82,
      "limit": 7.5,
      "compliant": false
    },
    {
      "name": "Debt Service Coverage Ratio",
      "value": 0.65,
      "limit": 1,
      "compliant": false
    }
  ],
  "all_compliant": false,
  "breached_covenants": [
    "Senior Leverage Ratio",
    "Total Leverage Ratio (Super Senior)",
    "Debt Service Coverage Ratio"
  ]
}
```

---

## Frontend Requirements

### Pages to Build

| Page                      | Endpoints Used        | Description                                  |
| ------------------------- | --------------------- | -------------------------------------------- |
| **Upload**                | `POST /upload`        | Drag-drop PDF upload                         |
| **Extraction Results**    | `POST /extract`       | Show EBITDA definition and covenants         |
| **Generated Code**        | `POST /generate-code` | Display Python code with syntax highlighting |
| **Compliance Calculator** | `POST /calculate`     | Form for financial inputs + results          |

### UI Components

#### 1. Upload Page

- File drag-and-drop zone
- Progress indicator
- Success/error message
- Navigate to extraction on success

#### 2. Extraction Results

- EBITDA card showing base metric, add-backs, caps
- Covenants table with columns: Name, Formula, Limit, Section Ref
- Loading spinner during extraction (~10 seconds)

#### 3. Compliance Calculator

Form inputs:

- `consolidated_ebit` (number, required)
- `depreciation` (number, default 0)
- `amortisation` (number, default 0)
- `impairment_costs` (number, default 0)
- `senior_debt` (number, required)
- `total_debt` (number, required)
- `interest_expense` (number, required)
- `principal_payments` (number, default 0)

Results display:

- EBITDA calculated value
- Covenant cards with:
  - Green/Red status indicator
  - Value vs Limit comparison
  - Section reference link
- Overall compliance banner (green/red)
- Breached covenants list if any

### Sample Data for Testing

**Compliant scenario:**

```json
{
  "consolidated_ebit": 50000000,
  "depreciation": 5000000,
  "amortisation": 2000000,
  "impairment_costs": 0,
  "senior_debt": 200000000,
  "total_debt": 350000000,
  "interest_expense": 15000000,
  "principal_payments": 10000000
}
```

**Non-compliant scenario:**

```json
{
  "consolidated_ebit": 30000000,
  "depreciation": 3000000,
  "amortisation": 1000000,
  "impairment_costs": 5000000,
  "senior_debt": 300000000,
  "total_debt": 500000000,
  "interest_expense": 40000000,
  "principal_payments": 20000000
}
```

---

## Health Check

**GET** `/health`

```json
{ "status": "healthy", "app": "Covenant Logic Compiler", "version": "1.0.0" }
```
