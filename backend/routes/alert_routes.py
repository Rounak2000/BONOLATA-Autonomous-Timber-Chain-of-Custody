from fastapi import APIRouter, HTTPException
from backend.services import alert_service

router = APIRouter()

@router.get("/api/alerts")
def get_alerts():
    alerts = alert_service.get_all_alerts()
    return {"data": alerts}

@router.put("/api/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: str):
    alert = alert_service.resolve_alert(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert resolved safely.", "data": alert}