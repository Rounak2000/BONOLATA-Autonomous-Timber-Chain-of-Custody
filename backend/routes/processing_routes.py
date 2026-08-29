from fastapi import APIRouter, HTTPException
from backend.models.processing import ProcessRequest
from backend.services import quantity_service
from backend.utils.json_db import load_data

router = APIRouter()

@router.post("/api/processing/split")
def split_timber(request: ProcessRequest):
    children, message, alert = quantity_service.process_timber_split(request)
    
    if not children:
        raise HTTPException(status_code=400, detail=message)
        
    return {
        "message": message,
        "children": children,
        "alert_generated": alert
    }

# A quick helper route to view our alerts
@router.get("/api/alerts")
def get_alerts():
    return load_data("alerts.json")