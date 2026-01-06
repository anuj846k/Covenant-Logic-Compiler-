"""Agreement API routes for covenant extraction and compliance calculation."""

import re
import uuid
from datetime import datetime

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import settings
from app.schemas.agreement import (
    AgreementUploadResponse,
    CalculationResponse,
    CovenantResult,
    ExtractionRequest,
    FinancialDataInput,
    GeneratedCodeResponse,
)
from app.services.pdf_service import PDFService
from app.services.s3_service import S3Service

router = APIRouter()

s3_service = S3Service()
pdf_service = PDFService()


@router.post("/upload", response_model=AgreementUploadResponse)
async def upload_agreement(
    file: UploadFile = File(..., description="LMA Agreement PDF file"),
):
    """Upload an LMA loan agreement PDF to S3 and extract metadata."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are accepted.",
        )

    contents = await file.read()
    file_size_mb = len(contents) / (1024 * 1024)

    if file_size_mb > settings.max_file_size_mb:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {settings.max_file_size_mb}MB",
        )

    try:
        agreement_id = f"agr_{uuid.uuid4().hex[:12]}"
        s3_key = s3_service.upload_file(
            file_content=contents, original_filename=file.filename, folder="agreements"
        )
        page_count = pdf_service.get_page_count(contents)
        definitions = pdf_service.extract_definitions_section(contents)

        return AgreementUploadResponse(
            agreement_id=agreement_id,
            filename=file.filename,
            page_count=page_count,
            s3_key=s3_key,
            upload_time=datetime.utcnow(),
            definitions_found=definitions["found"],
            definitions_page_range=f"{definitions['start_page']}-{definitions['end_page']}"
            if definitions["found"]
            else None,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to process agreement: {str(e)}"
        )


@router.post("/extract")
async def extract_covenants(request: ExtractionRequest):
    """Extract covenant definitions from an agreement using RAG and AI."""
    from app.agents.pdf_extractor import extract_covenants_from_text
    from app.services.rag_service import RAGService

    try:
        pdf_bytes = s3_service.download_file(request.agreement_id)
        full_text = pdf_service.extract_text_from_bytes(pdf_bytes)

        rag = RAGService()
        rag.index_document(request.agreement_id, full_text)

        queries = [
            "EBITDA definition calculation add backs deductions",
            "leverage ratio covenant limit shall not exceed",
            "interest coverage ratio financial covenant",
            "debt service coverage ratio",
            "financial definitions Section 24 Clause 24",
            "conditions precedent financial covenants",
            "capital expenditure capex limits",
        ]

        relevant_text = rag.get_relevant_text(
            document_id=request.agreement_id,
            queries=queries,
            n_per_query=3,
        )

        extraction_result = extract_covenants_from_text(relevant_text)

        if not extraction_result["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Extraction failed: {extraction_result.get('error', 'Unknown error')}",
            )

        return {
            "agreement_id": request.agreement_id,
            "extraction_time": datetime.utcnow().isoformat(),
            "success": True,
            "ebitda_definition": extraction_result.get("ebitda_definition"),
            "covenants": extraction_result.get("covenants", []),
            "raw_response": extraction_result.get("raw_response"),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to extract covenants: {str(e)}"
        )


@router.post("/generate-code", response_model=GeneratedCodeResponse)
async def generate_code(request: ExtractionRequest):
    """Generate executable Python code from extracted covenant definitions."""
    from app.agents.pdf_extractor import (
        extract_covenants_from_text,
        generate_python_code,
    )
    from app.services.rag_service import RAGService

    try:
        pdf_bytes = s3_service.download_file(request.agreement_id)
        full_text = pdf_service.extract_text_from_bytes(pdf_bytes)

        rag = RAGService()
        rag.index_document(request.agreement_id, full_text)

        queries = [
            "EBITDA definition calculation add backs deductions",
            "leverage ratio covenant limit shall not exceed",
            "interest coverage ratio financial covenant",
            "debt service coverage ratio",
            "financial definitions Section 24 Clause 24",
            "conditions precedent financial covenants",
            "capital expenditure capex limits",
        ]

        relevant_text = rag.get_relevant_text(
            document_id=request.agreement_id,
            queries=queries,
            n_per_query=3,
        )

        extraction_result = extract_covenants_from_text(relevant_text)

        if not extraction_result["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Extraction failed: {extraction_result.get('error', 'Unknown error')}",
            )

        covenant_data = {
            "ebitda_definition": extraction_result.get("ebitda_definition"),
            "covenants": extraction_result.get("covenants", []),
        }

        generated_code = generate_python_code(covenant_data)
        function_names = re.findall(r"def (\w+)\(", generated_code)
        contract_refs = list(
            set(re.findall(r"Section [\d.]+\([a-z]\)?", generated_code))
        )

        return GeneratedCodeResponse(
            agreement_id=request.agreement_id,
            code=generated_code,
            functions=function_names,
            generation_time=datetime.utcnow(),
            contract_refs=contract_refs,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate code: {str(e)}"
        )


@router.post("/calculate", response_model=CalculationResponse)
async def calculate_covenants(data: FinancialDataInput):
    """Calculate covenant compliance from financial data."""
    try:
        ebitda = (
            data.consolidated_ebit
            + data.depreciation
            + data.amortisation
            + data.impairment_costs
        )

        senior_leverage = data.senior_debt / ebitda if ebitda > 0 else float("inf")
        total_leverage = data.total_debt / ebitda if ebitda > 0 else float("inf")

        debt_service = data.interest_expense + data.principal_payments
        dscr = ebitda / debt_service if debt_service > 0 else float("inf")

        covenants = [
            CovenantResult(
                name="Senior Leverage Ratio",
                value=round(senior_leverage, 2),
                limit=6.75,
                limit_type="max",
                compliant=senior_leverage <= 6.75,
                section_ref="Section 24.2(a)",
            ),
            CovenantResult(
                name="Total Leverage Ratio (Super Senior)",
                value=round(total_leverage, 2),
                limit=7.50,
                limit_type="max",
                compliant=total_leverage <= 7.50,
                section_ref="Section 24.2(b)",
            ),
            CovenantResult(
                name="Debt Service Coverage Ratio",
                value=round(dscr, 2),
                limit=1.00,
                limit_type="min",
                compliant=dscr >= 1.00,
                section_ref="Section 24.2(c)",
            ),
        ]

        all_compliant = all(c.compliant for c in covenants)
        breached = [c.name for c in covenants if not c.compliant]

        trace = {
            "ebitda_components": {
                "consolidated_ebit": {
                    "value": data.consolidated_ebit,
                    "ref": "Section 24",
                },
                "depreciation": {"value": data.depreciation, "ref": "Section 24"},
                "amortisation": {"value": data.amortisation, "ref": "Section 24"},
                "impairment_costs": {
                    "value": data.impairment_costs,
                    "ref": "Section 24",
                },
            },
            "debt_figures": {
                "senior_debt": data.senior_debt,
                "total_debt": data.total_debt,
            },
            "debt_service": {
                "interest_expense": data.interest_expense,
                "principal_payments": data.principal_payments,
            },
        }

        return CalculationResponse(
            agreement_id=data.agreement_id,
            calculation_time=datetime.utcnow(),
            ebitda=ebitda,
            covenants=covenants,
            all_compliant=all_compliant,
            breached_covenants=breached,
            trace=trace,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation failed: {str(e)}")


@router.get("/download/{agreement_id}")
async def download_agreement(agreement_id: str):
    """Get a presigned S3 URL for downloading an agreement."""
    raise HTTPException(
        status_code=501,
        detail="Download endpoint not implemented.",
    )
