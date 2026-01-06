"""
PDF Service - Extracts text from PDF files

This service handles:
1. Reading PDF files (uploaded LMA loan agreements)
2. Extracting text from specific pages
3. Finding Section 22 (Definitions) where covenants live
"""

import re
from io import BytesIO
from typing import Optional

from PyPDF2 import PdfReader


class PDFService:
    """
    Service for parsing and extracting text from PDF files.

    In the covenant workflow:
    1. User uploads LMA agreement PDF (350+ pages)
    2. We extract text from the PDF
    3. We find Section 22 (Definitions)
    4. We pass that text to the AI agent for covenant extraction
    """

    def extract_text_from_bytes(self, pdf_bytes: bytes) -> str:
        """
        Extract all text from a PDF file.

        Args:
            pdf_bytes: Raw bytes of the PDF file

        Returns:
            Full text content of the PDF

        Why BytesIO?
        - PdfReader expects a file-like object
        - BytesIO wraps bytes to behave like a file
        """
        pdf_file = BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)

        text_content = []
        for page_num, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            # Add page markers for traceability
            text_content.append(f"[PAGE {page_num + 1}]\n{page_text}")

        return "\n\n".join(text_content)

    def extract_pages(self, pdf_bytes: bytes, start_page: int, end_page: int) -> str:
        """
        Extract text from a specific range of pages.

        Args:
            pdf_bytes: Raw bytes of the PDF file
            start_page: First page to extract (1-indexed)
            end_page: Last page to extract (1-indexed)

        Returns:
            Text content from specified pages

        Why page ranges?
        - Section 22 (Definitions) is typically pages 280-320
        - We don't need to process the entire 350-page document
        """
        pdf_file = BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)

        text_content = []
        # Convert to 0-indexed
        for page_num in range(start_page - 1, min(end_page, len(reader.pages))):
            page = reader.pages[page_num]
            page_text = page.extract_text() or ""
            text_content.append(f"[PAGE {page_num + 1}]\n{page_text}")

        return "\n\n".join(text_content)

    def get_page_count(self, pdf_bytes: bytes) -> int:
        """
        Get the total number of pages in a PDF.

        Args:
            pdf_bytes: Raw bytes of the PDF file

        Returns:
            Number of pages
        """
        pdf_file = BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)
        return len(reader.pages)

    def find_section(self, pdf_bytes: bytes, section_name: str) -> Optional[dict]:
        """
        Search for a specific section in the PDF and return its content with location.

        Args:
            pdf_bytes: Raw bytes of the PDF file
            section_name: Section to find (e.g., "Section 22", "Definitions")

        Returns:
            Dict with section text and page numbers, or None if not found

        Why this matters for covenants:
        - LMA agreements have a standard structure
        - Section 22 contains all covenant definitions
        - Finding it automatically saves manual searching
        """
        pdf_file = BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)

        section_pattern = re.compile(rf"{re.escape(section_name)}", re.IGNORECASE)

        found_pages = []
        section_text = []

        for page_num, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""

            if section_pattern.search(page_text):
                found_pages.append(page_num + 1)
                section_text.append(f"[PAGE {page_num + 1}]\n{page_text}")

        if not found_pages:
            return None

        return {
            "section_name": section_name,
            "pages": found_pages,
            "start_page": min(found_pages),
            "end_page": max(found_pages),
            "text": "\n\n".join(section_text),
        }

    def extract_definitions_section(self, pdf_bytes: bytes) -> dict:
        """
        Specifically extract Section 22 (Definitions) from an LMA agreement.

        This is the key section containing:
        - Consolidated EBITDA definition
        - Senior Debt definition
        - Leverage Ratio definition
        - All add-backs and caps

        Returns:
            Dict with definitions text and metadata
        """
        # Try common section names for definitions
        section_names = [
            "Section 22",
            "SECTION 22",
            "Definitions",
            "DEFINITIONS",
            "Interpretation and Definitions",
        ]

        for section_name in section_names:
            result = self.find_section(pdf_bytes, section_name)
            if result:
                return {
                    "found": True,
                    "section": result["section_name"],
                    "start_page": result["start_page"],
                    "end_page": result["end_page"],
                    "page_count": len(result["pages"]),
                    "text": result["text"],
                }

        # If no specific section found, return full document
        # (let the AI agent figure it out)
        return {
            "found": False,
            "section": "Full Document",
            "start_page": 1,
            "end_page": self.get_page_count(pdf_bytes),
            "page_count": self.get_page_count(pdf_bytes),
            "text": self.extract_text_from_bytes(pdf_bytes),
        }
