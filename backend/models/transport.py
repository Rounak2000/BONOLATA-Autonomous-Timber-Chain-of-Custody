from pydantic import BaseModel
from typing import Optional

class DriverCreate(BaseModel):
    name: str
    license_number: str
    phone: str

class VehicleCreate(BaseModel):
    registration_number: str
    vehicle_type: str
    # NEW: Tell FastAPI to accept these fields from the frontend
    vehicle_id: Optional[str] = None
    driver_id: Optional[str] = None

class AssignDriver(BaseModel):
    driver_id: str

# NEW: Data required for a GPS location ping
class LocationUpdate(BaseModel):
    latitude: float
    longitude: float