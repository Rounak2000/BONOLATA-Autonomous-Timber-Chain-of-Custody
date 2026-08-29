from pydantic import BaseModel
from typing import Optional

# What the user submits when transferring timber
class TransferRequest(BaseModel):
    timber_id: str
    to_owner: str
    location: str
    remarks: Optional[str] = None