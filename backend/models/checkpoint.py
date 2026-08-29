from pydantic import BaseModel

class CheckpointCreate(BaseModel):
    name: str
    latitude: float
    longitude: float
    radius_meters: float  # How big is the virtual circle?