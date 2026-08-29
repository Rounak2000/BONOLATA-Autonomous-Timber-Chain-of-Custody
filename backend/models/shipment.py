from pydantic import BaseModel
from typing import List, Optional

class ShipmentCreate(BaseModel):
    timber_id: str
    vehicle_id: str
    source: str
    destination: str
    expected_start: str
    expected_arrival: str
    # NEW: A list of checkpoint IDs the truck is supposed to pass through
    expected_checkpoints: List[str] = []