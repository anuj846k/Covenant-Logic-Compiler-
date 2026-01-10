"""
Simple in-memory store to map agreement_id -> s3_key
This should ideally be in a database, but for the hackathon demo,
we'll use an in-memory dictionary.
"""

# In-memory storage: agreement_id -> s3_key
_agreement_storage = {}


def save_s3_key(agreement_id: str, s3_key: str):
    """Save the mapping of agreement_id to s3_key."""
    _agreement_storage[agreement_id] = s3_key


def get_s3_key(agreement_id: str) -> str:
    """Get the s3_key for an agreement_id."""
    if agreement_id not in _agreement_storage:
        raise KeyError(f"No S3 key found for agreement_id: {agreement_id}")
    return _agreement_storage[agreement_id]


def clear_storage():
    """Clear all stored mappings (useful for testing)."""
    _agreement_storage.clear()
