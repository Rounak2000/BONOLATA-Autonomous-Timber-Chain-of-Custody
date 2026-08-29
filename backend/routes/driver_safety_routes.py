from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Safely import your existing services
from backend.services.alert_service import create_alert
from backend.utils.json_db import load_data

router = APIRouter(prefix="/api/driver-safety", tags=["Driver Safety"])

class DrowsinessAlertPayload(BaseModel):
    driver_id: str
    vehicle_id: str
    shipment_id: str
    severity: str
    confidence: float
    coordinates: Optional[dict] = None

@router.post("/alert")
async def trigger_safety_alert(payload: DrowsinessAlertPayload):
    """
    Receives an alert from the edge-AI frontend and logs it to the existing system.
    """
    try:
        # Construct message based on severity
        state_msg = "Possible Drowsiness Detected" if payload.severity == "CRITICAL" else "Driver Attention Reduced"
        message = f"{state_msg}. Confidence: {payload.confidence*100:.1f}%."
        
        if payload.coordinates:
            message += f" Location: {payload.coordinates.get('lat')}, {payload.coordinates.get('lng')}"

        # Reuse existing alert creation logic
        new_alert = create_alert(
            alert_type="DRIVER_FATIGUE",
            related_id=payload.shipment_id,  # Associate with shipment for map integration
            message=message,
            severity=payload.severity
        )
        
        return {"success": True, "alert": new_alert}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{driver_id}")
async def get_driver_safety_status(driver_id: str):
    """Mock/Helper endpoint to fetch driver context for the UI."""
    drivers = load_data("drivers.json")
    driver = next((d for d in drivers if d.get("driver_id") == driver_id), None)
    
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
        
    return {"driver": driver, "monitoring_active": False}