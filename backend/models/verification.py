from pydantic import BaseModel
from typing import Optional

# This defines the data a Verifier must submit to approve/reject timber
class TimberVerification(BaseModel):
    timber_id: str
    status: str  # Must be exactly "VERIFIED" or "REJECTED"
    verifier_name: str
    comments: Optional[str] = None # Optional notes about why it was approved/rejected