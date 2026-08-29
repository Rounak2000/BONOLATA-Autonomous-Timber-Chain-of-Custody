from fastapi import APIRouter, HTTPException
from backend.models.timber import TimberCreate
from backend.services import timber_service

# APIRouter is like a mini-FastAPI app just for timber-related URLs
router = APIRouter()

@router.post("/api/timber")
def register_timber(timber: TimberCreate):
    new_record = timber_service.create_timber(timber)
    return {"message": "Timber registered successfully", "data": new_record}

@router.get("/api/timber")
def get_all_timber():
    data = timber_service.get_all_timber()
    return {"data": data}

@router.get("/api/timber/{timber_id}")
def get_timber(timber_id: str):
    data = timber_service.get_timber_by_id(timber_id)
    if not data:
        # If not found, return a standard 404 error
        raise HTTPException(status_code=404, detail="Timber not found")
    return {"data": data}