from pydantic import BaseModel
from typing import List

# Describes a single output piece (e.g., one batch of planks)
class OutputItem(BaseModel):
    species: str
    quantity: float
    unit: str

# Describes the entire sawmill processing event
class ProcessRequest(BaseModel):
    parent_timber_id: str
    outputs: List[OutputItem]
    expected_waste: float
    processor_name: str
    location: str