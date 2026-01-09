"""In-memory store for extracted covenant data."""

from typing import Optional

# Simple in-memory store: agreement_id -> extraction result
_covenant_store: dict = {}


def save_covenants(agreement_id: str, extraction_result: dict) -> None:
    """Save extracted covenants for an agreement."""
    _covenant_store[agreement_id] = extraction_result


def get_covenants(agreement_id: str) -> Optional[dict]:
    """Retrieve stored covenants by agreement ID."""
    return _covenant_store.get(agreement_id)


def get_covenant_limits(agreement_id: str) -> dict:
    """Get covenant limits as a structured dict for calculation."""
    data = _covenant_store.get(agreement_id)
    if not data:
        return {}

    limits = {}
    for covenant in data.get("covenants", []):
        name = covenant.get("name", "").lower()
        limit_value = covenant.get("limit_value")
        limit_type = covenant.get("limit_type", "max")
        section_ref = covenant.get("section_ref", "")

        if "leverage" in name and "senior" in name.lower():
            # Check if it's super senior or regular senior
            if "super" in name.lower() or "24.2(b)" in section_ref:
                limits["super_senior_leverage"] = {
                    "value": limit_value,
                    "type": limit_type,
                    "section": section_ref,
                }
            else:
                limits["senior_leverage"] = {
                    "value": limit_value,
                    "type": limit_type,
                    "section": section_ref,
                }
        elif "leverage" in name:
            # Generic leverage - check section ref
            if "24.2(a)" in section_ref:
                limits["senior_leverage"] = {
                    "value": limit_value,
                    "type": limit_type,
                    "section": section_ref,
                }
            elif "24.2(b)" in section_ref:
                limits["super_senior_leverage"] = {
                    "value": limit_value,
                    "type": limit_type,
                    "section": section_ref,
                }
        elif "debt service" in name.lower() or "dscr" in name.lower():
            limits["dscr"] = {
                "value": limit_value,
                "type": limit_type,
                "section": section_ref,
            }
        elif "interest coverage" in name.lower():
            limits["interest_coverage"] = {
                "value": limit_value,
                "type": limit_type,
                "section": section_ref,
            }

    return limits


def clear_store() -> None:
    """Clear all stored covenants (useful for testing)."""
    _covenant_store.clear()
