import fitz  # PyMuPDF
import io

class PDFExtractor:
    @staticmethod
    def extract_text(file_bytes: bytes) -> str:
        """
        Extracts raw text from a PDF file byte stream using PyMuPDF.
        """
        text = ""
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text()
            doc.close()
        except Exception as e:
            raise RuntimeError(f"Failed to extract text from PDF: {e}")
        
        return text

    @staticmethod
    def clean_text(text: str) -> str:
        """
        Basic cleaning: remove excessive newlines and spaces.
        """
        # Replace multiple newlines with a single newline
        import re
        text = re.sub(r'\n+', '\n', text)
        # Replace multiple spaces with a single space
        text = re.sub(r' +', ' ', text)
        return text.strip()
