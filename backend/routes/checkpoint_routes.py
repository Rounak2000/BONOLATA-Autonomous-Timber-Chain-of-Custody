from fastapi import APIRouter
from backend.models.checkpoint import CheckpointCreate
from backend.services import geofence_service

router = APIRouter()

@router.post("/api/checkpoints")
def add_checkpoint(checkpoint: CheckpointCreate):
    new_chk = geofence_service.create_checkpoint(checkpoint)
    return {"message": "Checkpoint created", "data": new_chk}

@router.get("/api/checkpoints")
def list_checkpoints():
    return {"data": geofence_service.get_all_checkpoints()}