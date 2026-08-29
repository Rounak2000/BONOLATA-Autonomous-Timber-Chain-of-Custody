from pydantic import BaseModel
from typing import Optional

# This defines what data the user MUST send when registering new timber
class TimberCreate(BaseModel):
    species: str
    source_type: str
    source_name: str
    origin_location: str
    quantity: float
    unit: str
    harvest_date: str
    certificate_number: str
    certificate_hash: Optional[str] = None
    current_owner: str