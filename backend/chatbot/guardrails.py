import re
from typing import Tuple, Optional

# Max character limit for user input
MAX_INPUT_LENGTH = 500

# Patterns commonly used for prompt injection or HTML/Script attacks
INJECTION_PATTERNS = [
    r"ignore\s+all\s+previous\s+instructions",
    r"ignore\s+above\s+instructions",
    r"system\s+prompt",
    r"you\s+are\s+now\s+a",
    r"<script\b[^>]*>",
    r"javascript:",
    r"drop\s+table",
    r"delete\s+from"
]

class InputGuardrail:
    """Validates and sanitizes incoming user messages."""

    @staticmethod
    def validate_and_sanitize(user_input: str) -> Tuple[bool, str, Optional[str]]:
        """
        Validates user input length and checks for injection patterns.
        
        Returns:
            (is_valid: bool, sanitized_text: str, error_message: Optional[str])
        """
        if not user_input or not user_input.strip():
            return False, "", "Please enter a non-empty message."

        # 1. Clean whitespace and HTML tags
        cleaned = user_input.strip()
        cleaned = re.sub(r'<[^>]*>', '', cleaned) # Strip raw HTML tags

        # 2. Check length limit
        if len(cleaned) > MAX_INPUT_LENGTH:
            return False, "", f"Your message exceeds the maximum allowed length of {MAX_INPUT_LENGTH} characters."

        # 3. Check for prompt injection / security patterns
        cleaned_lower = cleaned.lower()
        for pattern in INJECTION_PATTERNS:
            if re.search(pattern, cleaned_lower):
                return False, "", "Your request contained invalid keywords or formatting and was blocked for security."

        return True, cleaned, None