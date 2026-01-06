"""
Pydantic Schemas for Agreement/Covenant Data

Schemas define the structure of data for:
- API request/response validation
- Automatic documentation
- Type hints throughout the code
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

# ============================================
# Covenant Definition Schemas
# ============================================


class CovenantDefinition(BaseModel):
    """
    Represents a single covenant extracted from the agreement.

    Example:
    {
        "name": "Senior Leverage Ratio",
        "formula": "Senior Debt / EBITDA",
        "legal_text": "The ratio of Senior Debt to EBITDA shall not exceed...",
        "section_ref": "Section 22.3",
        "page": 290,
        "limit_value": 5.0,
        "limit_type": "max"
    }
    """

    name: str = Field(..., description="Covenant name, e.g., 'Senior Leverage Ratio'")
    formula: str = Field(..., description="Mathematical formula in plain text")
    legal_text: str = Field(..., description="Original legal text from the agreement")
    section_ref: str = Field(
        ..., description="Contract section reference, e.g., 'Section 22.3'"
    )
    page: int = Field(..., description="PDF page number where this was found")
    limit_value: Optional[float] = Field(None, description="Threshold value, e.g., 5.0")
    limit_type: str = Field("max", description="'max' for ≤ limits, 'min' for ≥ limits")


class EBITDAComponent(BaseModel):
    """
    A component of the EBITDA calculation.

    EBITDA has many add-backs and adjustments defined in the agreement.
    Each component needs to be tracked for traceability.
    """

    name: str = Field(..., description="Component name, e.g., 'Restructuring Costs'")
    operation: str = Field(..., description="'add' or 'subtract'")
    section_ref: str = Field(..., description="Contract clause reference")
    page: int = Field(..., description="PDF page number")
    cap: Optional[float] = Field(None, description="Cap amount if applicable")
    cap_type: Optional[str] = Field(None, description="'fixed' or 'percentage'")
    conditions: Optional[str] = Field(
        None, description="Any conditions for this add-back"
    )


class EBITDADefinition(BaseModel):
    """
    Complete EBITDA definition extracted from the agreement.

    The EBITDA definition is crucial because most covenants reference it.
    Example: Leverage = Debt / EBITDA
    """

    base_metric: str = Field(
        ..., description="Starting point, e.g., 'Operating Profit'"
    )
    section_ref: str = Field(..., description="Section reference for EBITDA definition")
    page_range: str = Field(..., description="Page range, e.g., '285-287'")
    components: list[EBITDAComponent] = Field(default_factory=list)
    full_legal_text: str = Field(
        ..., description="Complete legal text of EBITDA definition"
    )


# ============================================
# Agreement Upload/Response Schemas
# ============================================


class AgreementUploadResponse(BaseModel):
    """
    Response after uploading an LMA agreement PDF.
    """

    agreement_id: str = Field(..., description="Unique identifier for this agreement")
    filename: str = Field(..., description="Original filename")
    page_count: int = Field(..., description="Total pages in the PDF")
    s3_key: str = Field(..., description="Storage location in S3")
    upload_time: datetime = Field(default_factory=datetime.utcnow)
    definitions_found: bool = Field(..., description="Whether Section 22 was found")
    definitions_page_range: Optional[str] = Field(
        None, description="Page range of definitions"
    )


class ExtractionRequest(BaseModel):
    """
    Request to extract covenants from an uploaded agreement.
    """

    agreement_id: str = Field(..., description="The agreement to process")
    extract_ebitda: bool = Field(True, description="Extract EBITDA definition")
    extract_covenants: bool = Field(
        True, description="Extract all covenant definitions"
    )


class ExtractionResponse(BaseModel):
    """
    Response containing extracted covenant data.
    """

    agreement_id: str
    extraction_time: datetime = Field(default_factory=datetime.utcnow)
    ebitda_definition: Optional[EBITDADefinition] = None
    covenants: list[CovenantDefinition] = Field(default_factory=list)
    generated_code: Optional[str] = Field(
        None, description="Python code for calculations"
    )


# ============================================
# Generated Code Schema
# ============================================


class GeneratedCodeResponse(BaseModel):
    """
    Response containing generated Python code for covenant calculations.

    This is THE KEY OUTPUT - executable Python that replaces Excel formulas.
    """

    agreement_id: str
    code: str = Field(..., description="Full Python code for all covenants")
    functions: list[str] = Field(..., description="List of function names generated")
    generation_time: datetime = Field(default_factory=datetime.utcnow)
    contract_refs: list[str] = Field(..., description="Contract sections referenced")

    class Config:
        json_schema_extra = {
            "example": {
                "agreement_id": "agr_abc123",
                "code": "def calculate_ebitda(operating_profit, depreciation):\n    ...",
                "functions": ["calculate_ebitda", "calculate_senior_leverage"],
                "contract_refs": ["Section 22.1", "Section 22.3"],
            }
        }


# ============================================
# Financial Data Input Schema
# ============================================


class FinancialDataInput(BaseModel):
    """
    Financial data required to calculate covenant compliance.

    This is what banks/borrowers provide - their actual financial numbers.
    """

    agreement_id: str = Field(
        ..., description="The agreement to calculate covenants for"
    )

    # EBITDA components
    consolidated_ebit: float = Field(
        ..., description="Consolidated EBIT (operating profit)"
    )
    depreciation: float = Field(0.0, description="Depreciation expense")
    amortisation: float = Field(0.0, description="Amortisation expense")
    impairment_costs: float = Field(0.0, description="Impairment costs")

    # Debt figures
    senior_debt: float = Field(..., description="Senior debt amount")
    total_debt: float = Field(..., description="Total debt amount (senior + other)")

    # Debt service
    interest_expense: float = Field(..., description="Total interest expense")
    principal_payments: float = Field(0.0, description="Principal repayments due")

    class Config:
        json_schema_extra = {
            "example": {
                "agreement_id": "agreements/8bcbbc67_aggrementdemo.pdf",
                "consolidated_ebit": 50000000,
                "depreciation": 5000000,
                "amortisation": 2000000,
                "impairment_costs": 0,
                "senior_debt": 200000000,
                "total_debt": 350000000,
                "interest_expense": 15000000,
                "principal_payments": 10000000,
            }
        }


class CovenantResult(BaseModel):
    """Result for a single covenant calculation."""

    name: str
    value: float
    limit: float
    limit_type: str  # "max" or "min"
    compliant: bool
    section_ref: str


class CalculationResponse(BaseModel):
    """
    Response containing covenant calculation results.
    """

    agreement_id: str
    calculation_time: datetime = Field(default_factory=datetime.utcnow)

    # Calculated values
    ebitda: float = Field(..., description="Calculated EBITDA")

    # Covenant results
    covenants: list[CovenantResult] = Field(default_factory=list)

    # Overall compliance
    all_compliant: bool = Field(..., description="True if all covenants are met")
    breached_covenants: list[str] = Field(
        default_factory=list, description="Names of breached covenants"
    )

    # Trace data for audit
    trace: dict = Field(
        default_factory=dict, description="Full calculation trace with contract refs"
    )
