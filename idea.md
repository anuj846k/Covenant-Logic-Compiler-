# TRACK: KEEPING LOANS ON TRACK

## "AI-Powered Covenant Logic Compiler"

**In one sentence:** "We convert legal covenant definitions from LMA loan agreements into executable Python code that automatically calculates compliance, eliminating 49 hours of manual Excel work per loan per quarter."

**The Innovation:** Instead of humans manually translating legal text into Excel formulas (slow, error-prone, duplicated), AI generates Python code that all parties can use.

## After a Loan is Given (Post-Closing)

Banks must monitor financial covenants, like:
- Debt / EBITDA
- Interest coverage
- Leverage ratio

This happens every quarter.

## How It Works Today

1. Borrower sends financials
2. Analyst opens:
   - PDFs
   - Excel sheets
3. Analyst:
   - Reads the legal contract
   - Manually calculates ratios in Excel
   - Checks if numbers match the contract

This is called "stare and compare".

### Result

- Slow
- Error-prone
- Not scalable
- Misses early warning signals

This is the "operational paradox":
- Loans are sophisticated
- Operations are still manual

## What is the Real Root Problem?

**Not** "lack of dashboards".  
**Not** "bad UX".

**The real problem is:**

### Logic-to-Code Gap

**Meaning:**
- Loan agreements are written in legal English
- Software needs executable logic
- Humans manually translate: Legal text → Excel formulas

That translation step is:
- Manual
- Slow
- Different for every deal
- The biggest bottleneck

## Why Existing Tools Don't Solve This

### Cardo AI
- Good at data storage
- Extracts fields (dates, rates)
- **Humans still encode covenant logic**

### Moody's
- Strong workflows
- Templates
- **But covenants are too bespoke for templates**

### BankStride
- Great for reminders & document collection
- Trusts borrower's compliance certificate
- **Does not independently calculate**

**Common issue:**
- They help humans work faster
- They do not replace the logic translation

## What Does "Smart Covenant Monitoring" Mean Here?

It means:
1. Read the legal covenant text
2. Automatically convert it into real code (Python)
3. Run that code on financial data
4. Get:
   - Accurate results
   - Consistent calculations
   - No Excel errors

**LLMs are used to:**
- write the code
- **NOT** to do the math

This avoids hallucinations.

## FEW FEATURES SUGGESTION

### ✅ 1. Covenant Logic Compiler (Your Differentiator)

**What it does:**
- Takes covenant clauses from the loan agreement (PDF/Word)
- Converts them into real executable Python logic
- Stores logic as code, not templates

**Example:**

```
"Net Debt to EBITDA shall not exceed 4.0x"
→
def leverage_ratio(net_debt, ebitda):
    return net_debt / ebitda
```

**Why judges care:**
- Solves the Logic-to-Code Gap
- No competitor does this end-to-end

### ✅ 2. Independent Covenant Calculation (No Trusting Borrower)

**What it does:**
- Takes raw financial inputs (CSV / API / uploaded Excel)
- Runs compiled covenant code
- Produces:
  - Ratio value
  - Threshold
  - Pass / Fail
  - Headroom

**Why it matters:**
- Lenders no longer "trust" borrower-prepared certificates
- Eliminates Excel errors

### ✅ 3. Explainability & Traceability (Trust Builder)

**What it does:**
- Every calculated number links back to:
  - Clause number
  - Exact contract text
- Click → see source

**Judges love this:**
- Black-box AI is rejected in finance
- This is auditable AI

### ✅ 4. Compliance Certificate Auto-Generation

**What it does:**
- Auto-generates a compliance certificate:
  - Same structure as Schedule / LMA format
  - Ready for signature

**Value:**
- Replaces Word + Excel + email loop
- Still keeps human sign-off

### 🔸 5. Early Warning Engine

**What it does:**
- Simulates:
  - EBITDA drop
  - Interest rate rise
- Flags "approaching breach" before quarter end

**Example:**  
"At current burn rate, covenant breach likely in 2 quarters."

This hits the "Keeping Loans on Track" theme perfectly.

### 🔸 6. Amendment / Waiver Voting Module (additional)

**What it does:**
- Digitizes waiver voting:
  - Each lender votes
  - System auto-tallies % thresholds
  - Issues waiver once majority met

**Why it's powerful:**
- Waivers are frequent
- Still extremely manual today

### 🔸 7. Frozen GAAP Support (Judge-Level Sophistication) (additional)

**What it does:**
- Runs covenant logic using:
  - Current GAAP
  - Frozen GAAP (as per contract)
- Shows difference side-by-side

Even a mock demo of this signals deep domain understanding.

---

## Topic: Borrowers' Honest Errors in Financial Reporting (Logic-to-Code Breakdown)

### Point 1: Borrowers Make Mistakes (Honest Errors)

**Example: Q1 2025 Financial Calculation:**

| Metric | Amount |
|--------|--------|
| Net Income | $50M |
| Add: Interest | $10M |
| Add: Tax | $8M |
| Add: Depreciation | $12M |
| **Equals: EBITDA** | **$80M** |

**Leverage Calculation:**  
Debt ($400M) / EBITDA ($80M) = 5.0x ✅

Borrower submits: "We're compliant at 5.0x"

**Agent Bank (JPMorgan) recalculates and finds:**

Wait... the loan agreement says:  
`"EBITDA = Operating Income + D&A"`

But Acme calculated it as:  
`"Net Income + Interest + Tax + D&A"`

Let me check Acme's financials more carefully:

- Operating Income: $65M ← This is BEFORE interest/tax
- + Depreciation: $12M
- = EBITDA: $77M ← **NOT $80M!**

**Leverage = $400M / $77M = 5.19x ❌ BREACH!**  
(Limit is 5.0x)

> **Note:** This is where waiver point can come which is mentioned in the exaclidraw (its an additional feature)

Borrower made an honest mistake - they used "Net Income" instead of "Operating Income" as the starting point.  
This happens ALL THE TIME because covenant definitions are confusing.  
If the bank just accepts Acme's number and Acme goes bankrupt, regulators will fine the bank for inadequate monitoring.

So borrower and agent bank + 15 banks who are involved in the loan will have to calculate on their side causing repetition and errors.

And the contracts & agreements can change the leverage ratio and other calculation logic that comes in the compliance certificate.

## Full Lifecycle:

### What Exactly Does the Agent Bank Calculate Each Quarter?

**Q1 2025 Monitoring - Step by Step**

- **Date:** April 15, 2025
- **Loan:** Acme Corporation Leveraged Buyout (borrower)
- **Agent Bank:** JPMorgan
- **Analyst:** Sarah (Loan Operations)

#### Step 1: Receive Documents from Borrower

**Q1 Financial Statements:**
- Consolidated Income Statement
- Consolidated Balance Sheet
- Cash Flow Statement

**Compliance Certificate (PDF):**
- Senior Leverage Ratio: 4.8x ✅ (limit: 5.0x)
  - EBITDA: $83.3M
  - Senior Debt: $400M

**Supporting Schedules:**
- Subsidiary consolidation
- Add-backs reconciliation
- One-time items memo

#### Step 2: Open the LMA Credit Agreement

Sarah opens the 375-page LMA Senior Facilities Agreement and navigates to:
- Section 22 (Definitions) - pages 280-320
- Schedule 8 (Form of Compliance Certificate) - pages 360-365

#### Step 3: Extract the EBITDA Definition

Sarah finds this in Section 22.1:

```
"Consolidated EBITDA" means, for any Relevant Period, 
the consolidated operating profit of the Group:
(a) before deducting any interest, commission, fees...
(b) before deducting any Tax...
(c) before taking into account any Exceptional Items...
(d) after adding back any amount attributable to depreciation...
(e) after adding back Transaction Costs (up to €15M per annum)
(f) after adding back Synergies (capped at 20% of Consolidated EBITDA 
    calculated before this add-back)
(g) minus any non-cash income or gains on disposals
```

This is the FORMULA she must implement in Excel.

#### Step 4: Build/Update Excel Calculation

Sarah opens her Excel file: `Acme_Q1_2025_Covenant_Calc.xlsx`

- If this is a new deal: She must build formulas from scratch (2-3 hours)
- If continuing: She updates data inputs (still 1-2 hours to verify everything)

#### Step 5: Extract Data from Acme's Financials

Sarah goes through Acme's financial statements line by line:

| Item | Where Found | Amount |
|------|-------------|--------|
| Operating Profit | Income Statement, Line 12 | $65M |
| Interest Expense | Income Statement, Line 18 | $12M |
| Tax Expense | Income Statement, Line 20 | $8M |
| Depreciation | Cash Flow Statement, Note 4 | $15M |
| Amortization | Cash Flow Statement, Note 4 | $3M |

#### Step 6: Check for "One-Time Items"

Sarah sees in Acme's memo:

**Add-backs requested:**
- Restructuring costs: $8M
- Acquisition costs: $3M
- FX losses (non-cash): $2M
- Expected synergies: $10M

Now Sarah must VERIFY each one:

**Restructuring Costs ($8M):**
- Check: Is this allowed per the credit agreement?
- Opens Section 22.1(c): "Exceptional Items include restructuring"
- Checks Acme's Board minutes: Was this approved?
- ✅ Allowed

**Acquisition Costs ($3M):**
- Section 22.1(e): "Transaction Costs up to €15M per annum"
- This quarter: $3M
- Running total YTD: $3M (under €15M limit)
- ✅ Allowed

**FX Losses ($2M):**
- Check: Is this truly "non-cash"?
- Reviews the P&L note: "Unrealized FX loss"
- Section 22.1(g): "minus non-cash income, PLUS non-cash losses"
- ✅ Allowed

**Expected Synergies ($10M):**
- Section 22.1(f): "Synergies capped at 20% of EBITDA before add-back"
- Problem: **CIRCULAR REFERENCE**
- Must calculate: Base EBITDA first, then cap, then final EBITDA

**Sarah's calculation:**

```
Base EBITDA (before synergies):
= Operating Profit + D&A + Other add-backs
= $65M + $18M + $8M + $3M + $2M
= $96M

Synergies Cap = 20% × $96M = $19.2M
Claimed synergies = $10M
Since $10M < $19.2M → ✅ Allowed

Final EBITDA = $96M + $10M = $106M
```

#### Step 7: Calculate Senior Leverage

**Senior Debt (from Balance Sheet):**
- = Term Loan A + Term Loan B
- = $250M + $150M
- = $400M

**Senior Leverage = $400M / $106M = 3.77x**

#### Step 8: Compare with Borrower's Certificate

**Acme's Certificate said:**
- EBITDA: $83.3M
- Leverage: 4.8x

**Sarah's Calculation:**
- EBITDA: $106M
- Leverage: 3.77x

🚨 **MAJOR DISCREPANCY!**

#### Step 9: Investigate the Difference

Sarah calls Acme's CFO:

- **Sarah:** "You reported an EBITDA of $83.3M, but I calculated $106M. Can you explain?"
- **CFO:** "Oh, we didn't add back the synergies because we're being conservative."
- **Sarah:** "But the credit agreement allows you to add them back. Your actual ratio is 3.77x, which is better than you reported."
- **CFO:** "Oh! We didn't realize we could include those. That's good news!"

**Alternative Scenario (Borrower Overstated):**

What if it went the other way?

- Acme claims: EBITDA = $106M, Leverage = 3.77x ✅
- Sarah calculates: EBITDA = $95M, Leverage = 4.21x ❌
- Reason: Acme added back $11M in "expected synergies" but the cap was only $10M.
- Result: Sarah must notify Acme and the 15 participant banks of a potential covenant breach.

### 🔄 What Happens Each Quarter?

You asked: "Can't they just reuse the formula?"

The formula is reusable, but the WORK is in:

#### 1. New Data Entry (Every Quarter)

Different numbers each quarter:
- Operating Profit changes
- Debt balance changes
- New one-time items appear

**Time:** 30-60 minutes just to extract data from PDFs/Excel

#### 2. New One-Time Items (Every Quarter)

- Q1: Restructuring costs ($8M) ✅ Allowed
- Q2: Legal settlement ($5M) ❓ Must check if "non-recurring"
- Q3: Acquisition costs ($12M) ❓ Must check YTD cap (€15M limit)
- Q4: Asset sale gain ($20M) ❓ Must subtract from EBITDA

Each quarter has NEW items that require JUDGMENT.  
**Time:** 30-60 minutes per item to verify

#### 3. Subsidiary Changes

Q2: Acme acquires a new subsidiary (NewCo)

Now Sarah must:
- Add NewCo's financials to the calculation
- Check: Is NewCo fully consolidated?
- Check: Should NewCo's historical EBITDA be pro-forma'd?
- Update the calculation

**Time:** 1-2 hours for acquisition adjustments

#### 4. Accounting Changes

Q3: Acme's auditor changes how they classify certain expenses

Now Sarah must:
- Understand the reclassification
- Check if it affects covenant calculations
- Adjust if necessary

**Time:** 1-2 hours

#### 5. Cross-Checking Multiple Covenants

Sarah doesn't just calculate ONE ratio. She must calculate ALL covenants:

- Senior Leverage Ratio = Senior Debt / EBITDA
- Total Leverage Ratio = Total Debt / EBITDA
- Interest Coverage Ratio = EBITDA / Interest Expense
- Fixed Charge Coverage Ratio = (EBITDA - CapEx - Taxes) / (Interest + Principal Repayments)
- Capex Limit = CapEx ≤ $50M per year

Each covenant requires separate verification.  
**Time:** 3-4 hours total per quarter

### Summary: What Agent Bank Calculates

| What | Why | Time |
|------|-----|------|
| EBITDA | Core metric, verify borrower's calculation | 1-2 hours |
| One-Time Add-backs | Check each is allowed, verify caps | 1 hour |
| Senior Debt Balance | Verify from balance sheet, check what's included | 30 min |
| Total Debt Balance | Include sub debt, exclude certain items | 30 min |
| All Leverage Ratios | Calculate each covenant | 30 min |
| Interest Coverage | Verify borrower can afford interest | 30 min |
| CapEx Compliance | Check YTD spending vs. limit | 30 min |
| Cross-check Borrower | Compare with certificate, investigate differences | 30 min |
| Documentation | Write memo, prepare for participant banks | 1 hour |
| **Total** | | **4-6 hours per loan, per quarter** |

### Today's Reality:

- Formula is in the analyst's head (or buried in Excel)
- New analyst each quarter? Must re-learn from the PDF
- Excel file gets corrupted? Must rebuild
- Different analysts interpret differently? Inconsistent results
- 500 loans? 500 different Excel files to maintain

### With AI-Generated Code:

- Formula is in Python code (version-controlled, shareable)
- New analyst? Just run the code
- Code is deterministic - same input = same output
- All 15 banks can use the same code (transparency)
- New quarter? Just upload new financials, code handles everything
- Amendment? AI regenerates code automatically

**BORROWER SIDE:**
1. Uploads LMA agreement → Gets Python code
2. Uploads own Q1 financials
3. System GENERATES compliance certificate automatically
4. Sends to bank
   ↓

**AGENT BANK SIDE:**
5. Uses SAME Python code (shared by borrower)
6. Uploads borrower's financials
7. Instantly verifies (same code = same result)
8. ✅ No discrepancies!

---

## THE IMPLEMENTATION PLAN

### PART 1: For Borrowers (Compliance Certificate Generation)

**Borrower uploads:**
1. LMA Agreement (PDF)
2. Q1 Financials (Excel)

**System outputs:**
- ✅ Professional PDF Compliance Certificate
- ✅ Shows all covenant calculations
- ✅ Ready to send to bank
- ✅ Uses the same Python code as bank will use

**Time:** 2 minutes (vs. 4 hours in Excel)

### PART 2: For Agent Banks (Verification)

**Agent bank receives:**
1. Borrower's certificate
2. Python code (shared by borrower)
3. Borrower's financials

**System verifies:**
- ✅ Runs same code
- ✅ Compares results
- ✅ Flags any discrepancies

**Time:** 30 seconds (vs. 4 hours manual)

### PART 3: For Participant Banks (Transparency)

**All 15 participant banks:**
- ✅ Get same Python code
- ✅ Can run independently
- ✅ See transparent calculations
- ✅ No "black box" AI

**Time:** 30 seconds per bank (vs. 3 hours each)  
**Total syndicate savings:** 45 hours → 7.5 minutes

---

## ABOVE IS THE MANUAL PROCESS DONE TILL NOW

---

# FINAL IMPLEMENTATION PLAN
## Smart Covenant Monitoring - LMA Hackathon 2025

## 📊 THE PROBLEM

**Current Reality in Syndicated Lending:**

When a $1 billion loan is syndicated across 15 banks:
- Borrower spends 4 hours/quarter building Excel to calculate covenants
- Agent bank spends 4 hours/quarter manually verifying calculations
- 15 participant banks each spend 3 hours independently recalculating
- **Total wasted time: 49 hours per loan per quarter**

- Error-prone: Manual Excel leads to discrepancies and disputes
- Root cause: The "Logic-to-Code Gap" - legal covenant definitions must be manually translated into Excel formulas for every loan

## 💡 THE SOLUTION

AI-powered system that converts LMA loan agreements into executable Python code

**The Innovation:**
- Upload PDF → Get working Python code in 30 seconds
- Upload financials → Get instant covenant calculations
- Generate professional compliance certificates automatically
- Share code across syndicate → Zero duplication, zero discrepancies

**Time Savings:**
- Borrower: 4 hours → 2 minutes
- Agent bank: 4 hours → 30 seconds
- 15 participant banks: 45 hours → 7.5 minutes
- **Total: 49 hours → 10 minutes (99.7% reduction)**

## 🏗️ THREE-PART ARCHITECTURE

### PART 1: For Borrowers (Certificate Generation)

**Input:**
- LMA Agreement PDF (350 pages)
- Q1 Financial Statements (Excel/CSV)

**Process:**
- AI reads Section 22 (Definitions) from PDF
- Extracts ALL covenant formulas (Senior Leverage, Total Leverage, Interest Coverage, etc.)
- Generates Python code that implements those formulas
- Parses financial data from Excel
- Runs Python code to calculate all covenants
- Generates professional PDF compliance certificate (Schedule 8 format)

**Output:**
- ✅ Python code (downloadable, shareable)
- ✅ Covenant calculation results (all 3-5 covenants)
- ✅ Professional PDF certificate ready to send to bank

**Value:** Eliminate 4 hours of manual Excel work per quarter

### PART 2: For Agent Banks (Verification)

**Input:**
- Borrower's compliance certificate (PDF)
- Python code (shared by borrower)
- Borrower's financial statements (Excel/CSV)

**Process:**
- System extracts borrower's claimed numbers from certificate
- Loads the Python code (same code borrower used)
- Runs calculations using borrower's financials
- Compares system results vs. borrower's claims
- Flags any discrepancies

**Output:**
- ✅ Verification report showing:
  - Borrower claimed: Senior Leverage 4.8x
  - System calculated: Senior Leverage 3.77x
  - ⚠️ Discrepancy: -1.03x (borrower underreported)
  - Root cause: Borrower didn't add back allowed synergies

**Value:** Eliminate 4 hours of manual verification per quarter

### PART 3: For Participant Banks (Transparency)

**The Syndicate Problem:**
- 15 banks all lent money, all need to monitor independently
- Currently: Each bank builds their own Excel (15 different versions)
- Result: 15 × 3 hours = 45 hours of duplicated effort

**The Solution:**
- Agent bank generates Python code from agreement
- Shares code with all 15 participant banks
- Each bank downloads code, runs locally (30 seconds)
- Same code + same data = same results (deterministic)

**Output:**
- ✅ All 15 banks use identical calculation logic
- ✅ Transparent (banks can read the Python code)
- ✅ No "black box" AI
- ✅ Zero discrepancies across syndicate

**Value:** Eliminate 45 hours of duplicated work per quarter

## 🎯 TIER 1 FEATURES (Must Build for Hackathon)

### 1. PDF Upload & Covenant Extraction

**What it does:**
- User uploads LMA Senior Facilities Agreement PDF
- AI finds Section 22 (Definitions) - typically pages 280-320
- Extracts ALL covenant definitions:
  - Consolidated EBITDA (with all add-backs and caps)
  - Senior Debt definition (what's included/excluded)
  - Total Debt definition
  - Senior Leverage formula and limit
  - Total Leverage formula and limit
  - Interest Coverage formula and minimum
  - Fixed Charge Coverage (if present)
  - CapEx limits (if present)

**Technical Approach:**
- Use PDF parser (LlamaParse, PyPDF2, or similar)
- Use Claude API to extract structured covenant data
- Store in JSON format with clause references

**Output:** Structured data showing all covenant rules with contract references  
**Time to build:** 1.5 hours

### 2. Python Code Generation

**What it does:**
- Takes extracted covenant definitions (legal language)
- Converts to executable Python functions
- Handles complex logic:
  - Circular references (e.g., synergy cap is % of EBITDA, but synergies are added to EBITDA)
  - Conditional logic (e.g., add-backs only if Board approved)
  - Caps and limits (e.g., transaction costs max €15M per year)
  - Multi-step calculations

**Example Conversion:**

**Legal Text:** "Consolidated EBITDA means operating profit plus depreciation plus Synergies, provided that Synergies shall not exceed 20% of Consolidated EBITDA calculated before giving effect to such add-back"

**Generated Python Function:**

```python
def calculate_consolidated_ebitda(operating_profit, depreciation, synergies_claimed):
    """
    Consolidated EBITDA per Section 22.1
    """
    # Base EBITDA (before synergies)
    base_ebitda = operating_profit + depreciation
    
    # Synergy cap: 20% of base
    synergy_cap = base_ebitda * 0.20
    
    # Apply cap
    allowed_synergies = min(synergies_claimed, synergy_cap)
    
    # Final EBITDA
    final_ebitda = base_ebitda + allowed_synergies
    
    # Return with metadata for traceability
    return {
        'base_ebitda': base_ebitda,
        'synergy_cap': synergy_cap,
        'synergies_claimed': synergies_claimed,
        'synergies_allowed': allowed_synergies,
        'final_ebitda': final_ebitda,
        'contract_ref': 'Section 22.1(f)',
        'trace': build_trace()  # For explainability
    }
```

**Technical Approach:**
- Use Claude API with prompt: "Convert this covenant definition to executable Python code"
- Include examples in prompt (few-shot learning)
- Add metadata tags for traceability
- Validate generated code for syntax errors

**Output:** Working Python code for all covenants with embedded metadata  
**Time to build:** 2 hours

### 3. Financial Data Upload & Parsing

**What it does:**
- User uploads borrower's financial statements (Excel or CSV)
- System extracts key data points:

**From Income Statement:**
- Operating profit
- Interest expense
- Tax expense
- Depreciation & amortization

**From Balance Sheet:**
- Total debt (by category: senior, subordinated)
- Cash and cash equivalents
- Restricted cash (excluded)

**From Notes/Schedules:**
- One-time items (restructuring costs, acquisition costs, etc.)
- FX gains/losses (cash vs. non-cash)
- Expected synergies from acquisitions

**Technical Approach:**
- Use pandas to read Excel/CSV
- Implement smart matching (e.g., "Operating Profit" might be labeled "EBIT" or "Operating Income")
- Allow user to map fields if auto-detection uncertain
- Store source references (which cell/line each number came from)

**Output:** Clean, structured financial data ready for calculations with source tracking  
**Time to build:** 1.5 hours

### 4. Explainability & Traceability ⭐ [CRITICAL FOR TRUST]

**What it does:**
- Creates a complete audit trail for every calculated number
- Links each result back to:
  - Specific contract clause (Section and paragraph)
  - Python code line that performed the calculation
  - Source financial data used as input
  - Logic applied (caps, conditions, adjustments)
- Makes "black box" AI transparent and trustworthy
- Enables click-to-see-source functionality in UI

**Why it matters:**
- Banks require proof, not magic: Finance industry won't trust AI without transparency
- Regulatory compliance: Auditors and regulators need to verify calculations
- Dispute resolution: When borrower disagrees, show exact contract clause
- Trust building: Transforms AI from "mysterious algorithm" to "auditable system"
- Key differentiator: This is what makes your solution enterprise-grade vs. toy demo

**How it works:**

#### Step 1: Enhanced Code Generation (integrates with Feature 2)

When generating Python code, include metadata tags:

```python
def calculate_consolidated_ebitda(operating_profit, depreciation, 
                                  restructuring, synergies_claimed):
    """
    Consolidated EBITDA per Section 22.1
    """
    # Base calculation with metadata
    base_ebitda = operating_profit + depreciation + restructuring
    
    # Build audit trail
    trace = {
        'operating_profit': {
            'value': operating_profit,
            'contract_ref': 'Section 22.1(a) - Consolidated operating profit',
            'source_doc': 'Income Statement, Line 12',
            'page': 285
        },
        'depreciation': {
            'value': depreciation,
            'contract_ref': 'Section 22.1(d) - Depreciation and amortization',
            'source_doc': 'Cash Flow Statement, Note 4',
            'page': 285
        },
        'restructuring': {
            'value': restructuring,
            'contract_ref': 'Section 22.1(c) - Exceptional Items',
            'source_doc': 'Board Minutes, March 15, 2025',
            'condition': 'Board approved',
            'page': 286
        }
    }
    
    # Handle synergy cap with full trace
    synergy_cap = base_ebitda * 0.20
    allowed_synergies = min(synergies_claimed, synergy_cap)
    
    trace['synergies'] = {
        'claimed': synergies_claimed,
        'allowed': allowed_synergies,
        'cap': synergy_cap,
        'cap_logic': '20% of base EBITDA per Section 22.1(f)',
        'contract_ref': 'Section 22.1(f) - Synergies cap',
        'page': 287,
        'decision': f'{"Capped" if synergies_claimed > synergy_cap else "Under cap"}'
    }
    
    final_ebitda = base_ebitda + allowed_synergies
    
    return {
        'value': final_ebitda,
        'components': trace,  # Full audit trail
        'contract_ref': 'Section 22.1'
    }
```

#### Step 2: Store Contract References (integrates with Feature 1)

During PDF extraction, map each covenant definition to its location:

```json
{
  "covenant_definitions": {
    "consolidated_ebitda": {
      "section": "22.1",
      "page": 285,
      "full_text": "Consolidated EBITDA means, for any Relevant Period...",
      "components": {
        "operating_profit": {
          "clause": "22.1(a)",
          "text": "consolidated operating profit of the Group"
        },
        "synergies": {
          "clause": "22.1(f)",
          "text": "Synergies not exceeding 20%",
          "cap_type": "percentage",
          "cap_value": 0.20
        }
      }
    }
  }
}
```

#### Step 3: Interactive UI Display (integrates with Feature 7)

**Dashboard View:**
```
Senior Leverage Ratio: 3.77x ✅ [📋 Show Calculation]
```

Click "Show Calculation" → Modal Opens:

```
┌────────────────────────────────────────────────────┐
│  SENIOR LEVERAGE CALCULATION                       │
├────────────────────────────────────────────────────┤
│                                                    │
│  Formula: Senior Debt ÷ EBITDA                    │
│  Contract: Section 22.3, Page 290                 │
│                                                    │
│  Senior Debt: $400M                               │
│  └─ [📋 View Breakdown]                           │
│                                                    │
│  EBITDA: $106M                                    │
│  └─ [📋 View Breakdown]                           │
│                                                    │
│  Result: $400M ÷ $106M = 3.77x                   │
│  Limit: ≤ 5.0x (Section 22.3)                    │
│  Status: ✅ COMPLIANT (Headroom: 1.23x)           │
│                                                    │
│  [Download Audit Report] [Close]                  │
└────────────────────────────────────────────────────┘
```

Click "View Breakdown" on EBITDA → Nested Modal:

```
┌────────────────────────────────────────────────────┐
│  EBITDA DETAILED CALCULATION                       │
├────────────────────────────────────────────────────┤
│                                                    │
│  Operating Profit: $65M                           │
│  ├─ Source: Income Statement, Line 12            │
│  ├─ Contract: Section 22.1(a), Page 285          │
│  └─ [📄 View Clause]                              │
│                                                    │
│  + Depreciation & Amortization: $18M              │
│  ├─ Source: Cash Flow, Note 4                    │
│  ├─ Contract: Section 22.1(d), Page 285          │
│  └─ [📄 View Clause]                              │
│                                                    │
│  + Restructuring Costs: $8M                       │
│  ├─ Source: Board Minutes, March 15, 2025        │
│  ├─ Contract: Section 22.1(c), Page 286          │
│  ├─ Verification: Board approved ✓               │
│  └─ [📄 View Clause]                              │
│                                                    │
│  + Synergies: $10M (capped)                      │
│  ├─ Claimed: $10M                                │
│  ├─ Cap: 20% × $96M = $19.2M                     │
│  ├─ Applied: $10M < $19.2M ✓ Under cap          │
│  ├─ Contract: Section 22.1(f), Page 287          │
│  ├─ [📄 View Clause] [📊 View Python Code]       │
│  └─ Logic: min(claimed, base × 0.20)             │
│                                                    │
│  = Total EBITDA: $106M                            │
│                                                    │
│  [Download Full Trace] [Close]                    │
└────────────────────────────────────────────────────┘
```

Click "View Clause" → Shows PDF Excerpt:

```
┌────────────────────────────────────────────────────┐
│  CONTRACT REFERENCE                                │
├────────────────────────────────────────────────────┤
│  Document: Senior Facilities Agreement              │
│  Section: 22.1(f)                                 │
│  Page: 287                                        │
├────────────────────────────────────────────────────┤
│                                                    │
│  "(f) after adding back Synergies                 │
│                                                    │
│   'Synergies' means cost savings and operating    │
│   expense reductions projected by the Borrower     │
│   in good faith to be realizable as a result      │
│   of any acquisition, PROVIDED THAT the aggregate   │
│   amount shall not exceed 20% of Consolidated     │
│   EBITDA calculated before giving effect to       │
│   such add-back."                                 │
│                                                    │
│  [View Full PDF] [Close]                          │
└────────────────────────────────────────────────────┘
```

#### Step 4: Verification with Root Cause Analysis

**Example: Discrepancy Detection with Trace**

```
┌────────────────────────────────────────────────────┐
│  ⚠️ DISCREPANCY DETECTED                          │
├────────────────────────────────────────────────────┤
│                                                    │
│  Metric: EBITDA                                   │
│  Borrower Claimed: $83.3M                         │
│  System Calculated: $106M                         │
│  Difference: +$22.7M (27% variance)               │
│                                                    │
├────────────────────────────────────────────────────┤
│  ROOT CAUSE ANALYSIS:                             │
│                                                    │
│  Operating Profit: ✅ Match                       │
│  ├─ Borrower: $65M                               │
│  └─ System: $65M                                  │
│                                                    │
│  Depreciation: ✅ Match                           │
│  ├─ Borrower: $18M                               │
│  └─ System: $18M                                  │
│                                                    │
│  Synergies: ⚠️ DISCREPANCY                        │
│  ├─ Borrower: $0M (not added back)               │
│  ├─ System: $10M (allowed per Section 22.1(f))   │
│  ├─ Contract: "Synergies not exceeding 20%"      │
│  ├─ Cap verification: $10M < $19.2M ✓              │
│  └─ Difference: $10M                              │
│                                                    │
│  Restructuring: ⚠️ DISCREPANCY                    │
│  ├─ Borrower: $0M (not added back)               │
│  ├─ System: $8M (allowed per Section 22.1(c))   │
│  ├─ Verification: Board approved March 15 ✓      │
│  └─ Difference: $8M                               │
│                                                    │
├────────────────────────────────────────────────────┤
│  CONCLUSION:                                      │
│  Borrower was conservative and did not add back   │
│  allowed items. System calculation follows        │
│  contract exactly. Recommend using system value.  │
│                                                    │
│  [Show Contract Clauses] [Contact Borrower]       │
│  [Accept System Value] [Override]                │
└────────────────────────────────────────────────────┘
```

**Key UI Features:**
- 📋 "Show Details" button next to every number
- Expandable/collapsible calculation trees
- Contract clause viewer (PDF excerpt with page numbers)
- Python code viewer (shows exact logic used)
- Color coding: Green (match), Red (discrepancy), Yellow (warning)
- Downloadable audit report (comprehensive PDF)

**Technical Approach:**
- Code Generation: Add metadata fields to all generated functions
- Data Storage: Store contract-to-code mapping in JSON with page references
- UI Components:
  - Modal/drawer for detailed breakdowns
  - Tree view for nested calculations
  - PDF excerpt viewer
  - Syntax highlighter for Python code snippets
- Libraries:
  - React for UI
  - Tailwind for styling
  - react-pdf for contract viewing
  - prism.js for code syntax highlighting

**Output:**
- ✅ Every number has full provenance
- ✅ Click any result → see contract clause with page number
- ✅ Click any result → see Python code that calculated it
- ✅ Click any result → see source financial data
- ✅ Fully auditable for regulators
- ✅ Transparent for all stakeholders
- ✅ Builds trust in AI calculations
- ✅ Enables dispute resolution

**Integration Points:**
- With Feature 2 (Code Generation): Add metadata to generated functions
- With Feature 1 (PDF Extraction): Store clause locations and page numbers
- With Feature 5 (Calculation Engine): Return results with trace data
- With Feature 6 (Certificate): Include audit trail in PDF
- With Feature 7 (UI): Display interactive trace viewer

**Time to build:** 1.5 hours
- 30 min: Add metadata to code generation
- 30 min: Build trace data structure
- 30 min: Create UI components (modals, tree view, contract viewer)

### 5. Multi-Covenant Calculation Engine ⭐

**What "Multi-Covenant" means:**

Real LMA agreements have 3-5 covenants that must ALL be tested quarterly:

**Covenant 1: Senior Leverage Ratio**
- Formula: Senior Debt ÷ EBITDA
- Typical limit: ≤ 5.0x
- Measures: Senior debt burden relative to earnings

**Covenant 2: Total Leverage Ratio**
- Formula: Total Debt ÷ EBITDA
- Typical limit: ≤ 6.5x
- Measures: Total debt burden (including subordinated debt)

**Covenant 3: Interest Coverage Ratio**
- Formula: EBITDA ÷ Interest Expense
- Typical minimum: ≥ 3.0x
- Measures: Ability to afford interest payments

**Covenant 4: Fixed Charge Coverage (if applicable)**
- Formula: (EBITDA - CapEx - Cash Taxes) ÷ (Interest + Principal Payments)
- Typical minimum: ≥ 1.5x
- Measures: Ability to service all fixed obligations

**Covenant 5: CapEx Limit (if applicable)**
- Typical limit: ≤ $50M per year
- Measures: Restricts spending on new assets

**Why ALL covenants must be calculated:**
- Banks never test just one covenant
- All must be checked simultaneously each quarter
- One covenant might be fine while another is close to breach
- This is NOT optional - it's how covenant monitoring works in practice

**What the system does:**
- Uses generated Python code
- Feeds in financial data
- Calculates ALL covenants at once (not one-by-one)
- Returns results for all with full traceability

**Output Dashboard Example:**

```
COVENANT COMPLIANCE SUMMARY - Q1 2025

1. Senior Leverage Ratio
   Calculated: 3.77x | Limit: ≤ 5.0x
   Status: ✅ COMPLIANT (Headroom: 1.23x)
   [📋 Show Details]

2. Total Leverage Ratio  
   Calculated: 4.24x | Limit: ≤ 6.5x
   Status: ✅ COMPLIANT (Headroom: 2.26x)
   [📋 Show Details]

3. Interest Coverage Ratio
   Calculated: 8.83x | Limit: ≥ 3.0x
   Status: ✅ COMPLIANT (Buffer: 5.83x)
   [📋 Show Details]

4. Fixed Charge Coverage
   Calculated: 2.15x | Limit: ≥ 1.5x
   Status: ✅ COMPLIANT (Buffer: 0.65x)
   [📋 Show Details]

5. Capital Expenditure
   Q1 Actual: $12M | Annual Limit: $50M
   Status: ✅ COMPLIANT (24% used)
   [📋 Show Details]

OVERALL: ALL COVENANTS COMPLIANT ✅

⚠️ Watch: Fixed Charge Coverage closest to limit
```

**Technical Approach:**
- Execute all Python functions in sequence
- Use shared EBITDA calculation (computed once, used by multiple ratios)
- Check each result against limits/minimums
- Flag warnings if within 10% of breach
- Include full trace data for each covenant

**Output:** Complete covenant dashboard with all results and traceability  
**Time to build:** 2 hours

### 6. Compliance Certificate Generation (PDF) ⭐

**What it does:**
- Takes covenant calculation results
- Generates professional PDF certificate
- Follows Schedule 8 format (standard LMA template)
- Includes detailed breakdown of calculations
- Includes audit trail references

**Certificate Sections:**

#### Section 1: Header
- Borrower name: "Acme Corporation"
- Agreement reference: "Senior Facilities Agreement dated January 1, 2024"
- Reporting period: "Q1 2025 (January 1 - March 31, 2025)"
- Date of certificate: "April 15, 2025"

#### Section 2: Covenant Compliance Table
- Lists all covenants with calculations
- Shows actual ratio vs. limit
- Compliance status for each
- References to supporting schedules

#### Section 3: EBITDA Calculation Detail

Line-by-line breakdown:
- Operating profit: $65M (per Section 22.1(a))
- Add: Depreciation & Amortization: $18M (per Section 22.1(d))
- Add: Restructuring costs: $8M (per Section 22.1(c))
- Add: Acquisition transaction costs: $3M (per Section 22.1(e))
- Add: FX losses (non-cash): $1.8M (per Section 22.1(g))
- Add: Synergies (capped at 20%): $10M (per Section 22.1(f))
- ────────────────────────────────────────────────────
- = Consolidated EBITDA: $106M

#### Section 4: Debt Calculation Detail

**Senior Debt:**
- Term Loan A: $250M
- Term Loan B: $150M
- ──────────────────
- Total Senior Debt: $400M (per Section 22.2)

**Total Debt:**
- Senior Debt: $400M
- Subordinated Notes: $50M
- ──────────────────
- Total Debt: $450M
- Less: Cash: ($20M)
- ──────────────────
- Net Debt: $430M

#### Section 5: Methodology Note (NEW - for explainability)

"Calculations performed using automated covenant calculation system per Section 22 definitions. All add-backs verified against Board approvals and contract caps. Full audit trail available upon request."

No black box AI issues as the user knows where the calc came from as it shows the source and exact page.

#### Section 6: Certification Statement

"I hereby certify that the above calculations are accurate and comply with the Senior Facilities Agreement dated January 1, 2024..."

- Signature line for CFO
- Date

**Technical Approach:**
- Use ReportLab or similar PDF library
- Create template matching Schedule 8 format
- Populate with calculation results and contract references
- Include section/page references for audit trail
- Generate professional-looking PDF

**Output:** Downloadable PDF ready to send to bank with full traceability  
**Time to build:** 1.5 hours

### 7. User Interface (React Artifact) ⭐

**Two Modes:**

#### BORROWER MODE

**Screen 1: Upload Agreement**
- "Upload Your LMA Credit Agreement"
- Drag-and-drop PDF upload
- Progress: "Parsing Section 22... 80%"
- Results: "Found 5 covenants: Senior Leverage, Total Leverage, Interest Coverage, Fixed Charge, CapEx"

**Screen 2: View Generated Code**
- "Python Code Generated"
- Code display with syntax highlighting
- Shows embedded metadata and traceability
- Download button
- "This code will be shared with your lenders"

**Screen 3: Upload Financials**
- "Upload Q1 2025 Financial Statements"
- Excel/CSV upload
- Preview extracted data with source references
- Allow manual adjustments if needed
- Shows which cells/lines data came from

**Screen 4: Calculation Results**
- Dashboard showing all covenant results
- Color-coded (green = compliant, yellow = warning, red = breach)
- [NEW] 📋 "Show Details" button next to each covenant
- [NEW] Expandable EBITDA breakdown with contract references
- [NEW] Click any number → see source
- Download certificate button

**Screen 5: Download Package**
- "Your compliance package is ready"
- Download: Compliance Certificate (PDF)
- Download: Python Code (for bank)
- [NEW] Download: Audit Trail Report
- Email to bank option

#### BANK VERIFICATION MODE

**Screen 1: Upload Borrower Submission**
- "Upload Borrower's Compliance Certificate"
- PDF upload (extracts claimed values)
- "Upload Borrower's Python Code"
- "Upload Borrower's Financial Statements"

**Screen 2: Verification Results**
- Side-by-side comparison:
  - Left: What borrower claimed
  - Right: What system calculated
- [NEW] Highlighted discrepancies with drill-down
- [NEW] Root cause analysis showing exact difference
- [NEW] Contract clause references for disputed items
- [NEW] Line-by-line breakdown of variances

**Screen 3: Approve or Flag**
- If match: "✅ Verified - All calculations match"
- If discrepancy: "⚠️ Review Required - Variance detected"
- [NEW] "Show Why" button explaining discrepancy
- [NEW] Link to contract clauses
- Contact borrower button
- Approve button
- Flag for committee review button

**UI Design Principles:**
- Clean, professional banking aesthetic
- Minimal clicks (max 3 steps for any workflow)
- Real-time progress indicators
- Clear error messages
- [NEW] Interactive explainability (click any number)
- [NEW] Collapsible detail views
- Mobile-responsive (bonus)

**Technical Approach:**
- Build as React artifact (can demo in Claude.ai)
- Use Tailwind CSS for styling
- File upload components
- PDF viewer component
- Syntax highlighter for code display
- [NEW] Modal/drawer components for drill-down
- [NEW] Tree view for nested calculations
- [NEW] Tooltip components for quick references

**Time to build:** 2 hours (increased from 1.5 for explainability features)

### Total BUILD TIME

| Feature | Time |
|---------|------|
| 1. PDF Upload & Extraction | 1.5 hrs |
| 2. Python Code Generation | 2 hrs |
| 3. Financial Data Parsing | 1.5 hrs |
| 4. Explainability & Traceability | 1.5 hrs |
| 5. Multi-Covenant Calculation | 2 hrs |
| 6. Certificate Generation | 1.5 hrs |
| 7. User Interface | 2 hrs |
| **TOTAL** | **12 hours** |

---

## 🎬 DEMO SCRIPT (3 Minutes)

### Setup (15 seconds)
"The problem: 49 hours of manual Excel work per loan, per quarter, across 15 banks. The solution: AI that compiles legal covenants into executable code."

### Act 1: Borrower Side (60 seconds)
"Sarah, CFO of Acme, uploads her 350-page credit agreement."
- [Upload PDF]
"In 10 seconds, AI extracts all covenant definitions."
- [Show results: 5 covenants found]
"System generates Python code."
- [Show code with metadata]
"Sarah uploads Q1 financials. All covenants calculated instantly."
- [Show dashboard with all results]
**[NEW - Explainability Demo]**
"But here's what makes this enterprise-grade: full transparency."
- [Click "Show Details" on EBITDA]
"Click any number, see exactly where it came from. This $10M synergy? Section 22.1(f), capped at 20%."
- [Click "View Clause"]
"Here's the exact contract language. No black box. Fully auditable."
- [Close modal]
"Professional certificate generated. Ready to send. Time: 2 minutes."

### Act 2: Bank Verification (45 seconds)
"JPMorgan receives Sarah's submission and verifies instantly."
- [Upload certificate + code + financials]
- [Click "Verify"]
"Perfect match. But if there were discrepancies..."
- [Show mock discrepancy screen]
"...the system shows exactly why. Root cause: Borrower didn't add back allowed synergies."
- [Show drill-down with contract references]
"Banks can see the exact clause that allows it. Dispute resolved instantly."

### Act 3: Syndicate (30 seconds)
"This loan has 15 participant banks. They all get the same code."
- [Show sharing screen]
"Same code, same data, same results. Zero discrepancies. 45 hours of duplicated work eliminated."

### Finale (30 seconds)
"Before: 49 hours of manual Excel.  
After: 10 minutes automated.  
99.7% time reduction.

CovenantCommandCenter extracts data. We execute logic.  
Cardo AI manages storage. We compile covenants into code.  
Moody's uses templates. We handle bespoke definitions.

And unlike all of them: we're fully auditable. Every number traces back to its contract clause. That's what makes this production-ready.

Thank you."

---

## 🆚 COMPETITIVE DIFFERENTIATION

### vs. CovenantCommandCenter
- **They:** Extract and organize covenant terms (10 seconds)
- **We:** Extract + compile to executable code + calculate + audit trail
- **Gap:** They stop at extraction. We execute the full workflow.

### vs. Cardo AI
- **They:** Data lakehouse and managed onboarding service
- **We:** Autonomous code generation and calculation
- **Gap:** They assist humans. We replace the manual calculation step.

### vs. Moody's Analytics
- **They:** Standardized templates and spreading tools
- **We:** Custom code generation for bespoke covenant definitions
- **Gap:** They force deals into templates. We adapt to unique logic.

### vs. BankStride
- **They:** Document collection and workflow automation
- **We:** Independent covenant calculation and verification
- **Gap:** They trust borrower's math. We verify independently.

### vs. ALL Competitors: Explainability
- **They:** Black box AI or opaque calculations
- **We:** Full audit trail linking every number to contract clauses
- **Gap:** They ask for trust. We provide proof.

---

## 📋 FINAL CHECKLIST

### ✅ Build (12 hours):
- [ ] PDF upload + covenant extraction (1.5h)
- [ ] Python code generation with metadata (2h)
- [ ] Financial data parsing with source tracking (1.5h)
- [ ] Explainability & traceability layer (1.5h)
- [ ] Multi-covenant calculation engine (2h)
- [ ] PDF certificate generation with audit trail (1.5h)
- [ ] React UI with drill-down features (2h)

### ✅ Demo prep:
- [ ] Sample LMA agreement PDF
- [ ] Sample financial statements (Excel)
- [ ] 3-minute demo script
- [ ] Explainability "wow moment" rehearsed

### ✅ Pitch deck:
- [ ] Problem slide (49 hours wasted)
- [ ] Solution slide (Logic-to-Code compiler)
- [ ] Demo (live walkthrough)
- [ ] Explainability slide (audit trail screenshot)
- [ ] Differentiation slide (vs. 4 competitors)
- [ ] Roadmap slide (Scenarios, Waivers, Frozen GAAP)

---

## 🎯 YOUR WINNING MESSAGE

"We've built an AI Covenant Logic Compiler that converts LMA loan agreements into executable Python code. Upload a 350-page PDF, get working code in 30 seconds. Upload financials, get instant compliance verification. Generate professional certificates automatically.

The key differentiator: full auditability. Every number links back to the exact contract clause. Click any result, see the source. This transparency is what makes AI trustworthy for banks.

Borrowers use it to eliminate 4 hours of Excel work. Banks use it to verify in 30 seconds. 15 syndicate members share the same code: zero discrepancies.

We don't just extract covenants. We execute them. And we prove it."

---

## COMPETITIVE DIFFERENTIATION

### vs. CovenantCommandCenter

**What they do:**
- Extract covenant terms from PDFs (10 seconds)
- Normalize terminology (87+ variations)
- Store in user-customizable database

**What they DON'T do:**
- ❌ Generate executable code
- ❌ Calculate covenants automatically
- ❌ Generate compliance certificates
- ❌ Verify borrower calculations

**Our advantage:** "They extract. We execute. They save 20 minutes on data entry. We save 49 hours on calculation."

### vs. Cardo AI

**What they do:**
- Data lakehouse for private credit
- Managed service for onboarding
- Data quality tools

**What they DON'T do:**
- ❌ Convert legal logic to code
- ❌ Independent covenant calculation
- ❌ Borrower-side certificate generation

**Our advantage:** "They manage data storage. We automate calculation logic. Different problems."

### vs. Moody's Analytics

**What they do:**
- Workflow automation
- Standardized spreading templates
- Compliance tracking

**What they DON'T do:**
- ❌ Handle bespoke covenant definitions
- ❌ Generate code for custom logic
- ❌ Adapt to non-standard terms

**Our advantage:** "They use rigid templates. We generate custom code for each deal's unique logic."

### vs. BankStride

**What they do:**
- Document collection automation
- Exception tracking
- Borrower portal

**What they DON'T do:**
- ❌ Calculate covenants from financials
- ❌ Verify borrower's math
- ❌ Independent compliance testing

**Our advantage:** "They collect documents. We calculate compliance. They trust the borrower. We verify independently."
