"""Covenant extraction and code generation agents using Agno and Groq."""

import json

from agno.agent import Agent, RunOutput
from agno.models.groq import Groq


def create_extraction_agent() -> Agent:
    """Create an agent for extracting covenant definitions from PDF text."""
    extraction_prompt = """You are an expert legal document analyst specializing in LMA credit agreements.

Extract covenant definitions from the agreement text. For each covenant, identify:
- Name and formula
- Section reference and page number
- Limit value and type (max/min)

For EBITDA, extract:
- Base metric
- Add-backs (depreciation, amortization, etc.)
- Deductions and caps

Respond in valid JSON format only."""

    return Agent(
        model=Groq(id="llama-3.3-70b-versatile"),
        description="Covenant Definition Extractor",
        instructions=[extraction_prompt],
        markdown=False,
    )


def extract_covenants_from_text(pdf_text: str) -> dict:
    """Extract covenant definitions from PDF text using AI."""
    agent = create_extraction_agent()

    prompt = f"""Extract all covenant definitions from this LMA agreement text.

Return a JSON object with:
{{
    "ebitda_definition": {{
        "base_metric": "operating profit",
        "section_ref": "Section 22.1",
        "page": 285,
        "add_backs": [{{"name": "depreciation", "section_ref": "Section 22.1(d)", "page": 285}}],
        "deductions": [],
        "caps": [{{"item": "synergies", "cap_type": "percentage", "cap_value": 0.20, "section_ref": "Section 22.1(f)"}}]
    }},
    "covenants": [
        {{
            "name": "Senior Leverage Ratio",
            "formula": "Senior Debt / EBITDA",
            "legal_text": "The ratio shall not exceed...",
            "section_ref": "Section 22.3",
            "page": 290,
            "limit_value": 5.0,
            "limit_type": "max"
        }}
    ]
}}

Agreement text:
{pdf_text[:50000]}
"""

    try:
        run_output: RunOutput = agent.run(prompt)
        response_text = run_output.content

        if "```json" in response_text:
            json_start = response_text.find("```json") + 7
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end].strip()
        elif "```" in response_text:
            json_start = response_text.find("```") + 3
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end].strip()

        result = json.loads(response_text)

        return {
            "success": True,
            "ebitda_definition": result.get("ebitda_definition"),
            "covenants": result.get("covenants", []),
            "raw_response": response_text,
        }

    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"Failed to parse JSON: {str(e)}",
            "raw_response": response_text if "response_text" in locals() else None,
        }
    except Exception as e:
        return {"success": False, "error": str(e), "raw_response": None}


def create_code_generation_agent() -> Agent:
    """Create an agent for generating Python code from covenant definitions."""
    code_gen_prompt = """You are a Python developer specializing in financial calculations.

Convert covenant definitions into executable Python functions with:
- Type hints and docstrings
- Return dicts with 'value', 'trace' (contract refs), and 'compliant' boolean
- Handle caps and complex calculations

Return ONLY Python code, no explanations."""

    return Agent(
        model=Groq(id="llama-3.3-70b-versatile"),
        description="Covenant Code Generator",
        instructions=[code_gen_prompt],
        markdown=False,
    )


def generate_python_code(covenant_data: dict) -> str:
    """Generate Python code from extracted covenant definitions."""
    agent = create_code_generation_agent()

    prompt = f"""Generate Python code for covenant compliance based on:

{json.dumps(covenant_data, indent=2)}

Create functions for:
1. EBITDA calculation with add-backs and caps
2. Each covenant ratio with compliance check

Return ONLY Python code."""

    response = agent.run(prompt)
    code = response.content if hasattr(response, "content") else str(response)

    if "```python" in code:
        code_start = code.find("```python") + 9
        code_end = code.find("```", code_start)
        code = code[code_start:code_end].strip()

    return code
