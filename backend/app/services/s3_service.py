import boto3
from botocore.exceptions import ClientError
from app.config import settings
import uuid
from pathlib import Path


class S3Service:
    """
    Service class to handle all S3 operations.

    Why a class?
    - Keeps S3 client as instance variable (reusable connection)
    - Groups related operations together
    - Easy to mock in tests
    """

    def __init__(self):
        """
        Initialize S3 client with AWS credentials.

        boto3.client() creates a connection to AWS S3.
        We get credentials from settings (loaded from .env)
        """
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
            region_name=settings.aws_region,
        )
        self.bucket_name = settings.s3_bucket_name

    def upload_file(
        self, file_content: bytes, original_filename: str, folder: str = "agreements"
    ) -> str:
        """
        Upload a file to S3 and return its key (path in S3).

        Args:
            file_content: The raw bytes of the file
            original_filename: Original name like "loan_agreement.pdf"
            folder: S3 folder to organize files ("agreements", "financials", "certificates")

        Returns:
            s3_key: The path in S3 where file is stored

        Why generate UUID?
        - Prevents filename collisions
        - "loan.pdf" from user A won't overwrite user B's file
        """
        # Generate unique filename: agreements/abc123_loan_agreement.pdf
        file_extension = Path(original_filename).suffix  # .pdf, .xlsx, etc.
        unique_id = str(uuid.uuid4())[:8]  # Short unique ID
        s3_key = f"{folder}/{unique_id}_{original_filename}"

        try:
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=s3_key,
                Body=file_content,
                ContentType=self._get_content_type(file_extension),
            )
            return s3_key
        except ClientError as e:
            raise Exception(f"Failed to upload file to S3: {str(e)}")

    def download_file(self, s3_key: str) -> bytes:
        """
        Download a file from S3.

        Args:
            s3_key: Path in S3 like "agreements/abc123_loan.pdf"

        Returns:
            File content as bytes
        """
        try:
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=s3_key)
            return response["Body"].read()
        except ClientError as e:
            raise Exception(f"Failed to download file from S3: {str(e)}")

    def generate_presigned_url(self, s3_key: str, expiration: int = 3600) -> str:
        """
        Generate a temporary download URL for a file.

        Why presigned URLs?
        - Files in S3 are private by default
        - This creates a temporary link (expires in 1 hour)
        - User can download without AWS credentials

        Args:
            s3_key: Path to file in S3
            expiration: URL valid for this many seconds (default 1 hour)

        Returns:
            URL string that anyone can use to download the file
        """
        try:
            url = self.s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": s3_key},
                ExpiresIn=expiration,
            )
            return url
        except ClientError as e:
            raise Exception(f"Failed to generate presigned URL: {str(e)}")

    def delete_file(self, s3_key: str) -> bool:
        """
        Delete a file from S3.

        Args:
            s3_key: Path to file in S3

        Returns:
            True if deleted successfully
        """
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=s3_key)
            return True
        except ClientError as e:
            raise Exception(f"Failed to delete file from S3: {str(e)}")

    def _get_content_type(self, extension: str) -> str:
        """
        Map file extension to MIME type.

        Why?
        - S3 serves files with correct headers
        - Browser knows how to handle downloaded file
        """
        content_types = {
            ".pdf": "application/pdf",
            ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".xls": "application/vnd.ms-excel",
            ".csv": "text/csv",
            ".py": "text/x-python",
            ".json": "application/json",
        }
        return content_types.get(extension.lower(), "application/octet-stream")
