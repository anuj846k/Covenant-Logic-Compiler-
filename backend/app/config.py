"""
Application Configuration

This file loads all environment variables and validates them using Pydantic.
Why Pydantic Settings?
- Automatic type validation
- Fails fast if required env vars are missing
- Provides autocomplete in your IDE
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    All application settings loaded from environment variables.

    Pydantic automatically looks for env vars with these EXACT names (case-insensitive).
    Example: aws_access_key_id -> looks for AWS_ACCESS_KEY_ID in .env
    """

    # ============================================
    # AWS S3 Configuration
    # ============================================
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str = "ap-south-1"  # Default to Mumbai region
    aws_s3_bucket_name: str

    @property
    def s3_bucket_name(self) -> str:
        """Alias for backward compatibility."""
        return self.aws_s3_bucket_name

    # ============================================
    # LLM Configuration (Google Gemini for Agno)
    # ============================================
    gemini_api_key: str = ""

    @property
    def google_api_key(self) -> str:
        """Alias for the Agno agent."""
        return self.gemini_api_key

    # ============================================
    # Application Settings
    # ============================================
    app_name: str = "Covenant Logic Compiler"
    debug: bool = False

    # ============================================
    # File Upload Settings
    # ============================================
    max_file_size_mb: int = 50  # Max 50MB for PDFs
    allowed_extensions: str = ".pdf,.xlsx,.xls,.csv"

    class Config:
        """
        Pydantic config for settings.

        env_file: Path to .env file
        env_file_encoding: Encoding of .env file
        case_sensitive: Whether env var names are case-sensitive
        """

        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"  # Ignore extra env vars like DATABASE_URL


# Create a singleton settings instance
# This is imported throughout the app: from app.config import settings
settings = Settings()
