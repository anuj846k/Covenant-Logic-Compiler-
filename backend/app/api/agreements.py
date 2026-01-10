"""Agreement API routes for covenant extraction and compliance calculation."""

import re
import uuid
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from app.config import settings
from app.schemas.agreement import (
    AgreementUploadResponse,
    CalculationResponse,
    CertificateRequest,
    CovenantResult,
    ExtractionRequest,
    FinancialDataInput,
    GeneratedCodeResponse,
)
from app.services import agreement_storage
from app.services.pdf_service import PDFService
from app.services.s3_service import S3Service

router = APIRouter()

s3_service = S3Service()
pdf_service = PDFService()


class ManualCovenantUpdate(BaseModel):
    covenants: List[dict]
    ebitda_definition: Optional[dict] = None


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

        # Store the mapping of agreement_id -> s3_key
        agreement_storage.save_s3_key(agreement_id, s3_key)

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
        # Get the correct S3 key for this agreement
        s3_key = agreement_storage.get_s3_key(request.agreement_id)
        pdf_bytes = s3_service.download_file(s3_key)
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

        # Save extracted covenants for use in /calculate
        from app.services.covenant_store import save_covenants

        save_covenants(
            request.agreement_id,
            {
                "ebitda_definition": extraction_result.get("ebitda_definition"),
                "covenants": extraction_result.get("covenants", []),
            },
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


@router.put("/covenants/{agreement_id}")
async def update_covenants(agreement_id: str, update_data: ManualCovenantUpdate):
    """Update covenant and EBITDA data after manual human editing.

    This endpoint allows users to manually correct AI-extracted data,
    implementing human-in-the-loop oversight for enterprise compliance.
    """
    from app.services.covenant_store import get_covenants, save_covenants

    try:
        # Get existing extraction data (defensive: handle misses)
        existing_data = get_covenants(agreement_id) or {}

        # Update the data with manually edited values
        updated_data = {
            **existing_data,
            "covenants": update_data.covenants,
        }

        if update_data.ebitda_definition:
            updated_data["ebitda_definition"] = update_data.ebitda_definition

        # Save the updated data
        save_covenants(agreement_id, updated_data)

        return {
            "agreement_id": agreement_id,
            "updated_at": datetime.utcnow().isoformat(),
            "covenants_count": len(update_data.covenants),
            "message": "Covenants updated successfully",
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to update covenants: {str(e)}"
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
        # Get the correct S3 key for this agreement
        s3_key = agreement_storage.get_s3_key(request.agreement_id)
        pdf_bytes = s3_service.download_file(s3_key)
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
    """Calculate covenant compliance from financial data using extracted limits."""
    from app.services.covenant_store import get_covenant_limits

    try:
        # Fetch dynamic limits from extracted covenants
        limits = get_covenant_limits(data.agreement_id)

        # Use extracted limits or fall back to defaults
        senior_limit = limits.get("senior_leverage", {}).get("value", 6.75)
        super_senior_limit = limits.get("super_senior_leverage", {}).get("value", 7.50)
        dscr_limit = limits.get("dscr", {}).get("value", 1.00)

        senior_section = limits.get("senior_leverage", {}).get(
            "section", "Section 24.2(a)"
        )
        super_senior_section = limits.get("super_senior_leverage", {}).get(
            "section", "Section 24.2(b)"
        )
        dscr_section = limits.get("dscr", {}).get("section", "Section 24.2(c)")

        # Calculate EBITDA
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
                limit=senior_limit,
                limit_type="max",
                compliant=senior_leverage <= senior_limit,
                section_ref=senior_section,
            ),
            CovenantResult(
                name="Total Leverage Ratio (Super Senior)",
                value=round(total_leverage, 2),
                limit=super_senior_limit,
                limit_type="max",
                compliant=total_leverage <= super_senior_limit,
                section_ref=super_senior_section,
            ),
            CovenantResult(
                name="Debt Service Coverage Ratio",
                value=round(dscr, 2),
                limit=dscr_limit,
                limit_type="min",
                compliant=dscr >= dscr_limit,
                section_ref=dscr_section,
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


@router.post("/certificate")
async def generate_compliance_certificate(request: CertificateRequest):
    """Generate a PDF compliance certificate based on calculation results."""
    from fastapi.responses import Response

    from app.services.certificate_service import generate_certificate

    try:
        pdf_bytes = generate_certificate(request.dict())

        filename = f"Compliance_Certificate_{request.company_name.replace(' ', '_')}_{request.test_date.replace(' ', '_')}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate certificate: {str(e)}"
        )
