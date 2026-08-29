from fastapi import APIRouter, HTTPException
from backend.models.shipment import ShipmentCreate
from backend.services import shipment_service

router = APIRouter()

@router.post("/api/shipments")
def create_shipment(shipment: ShipmentCreate):
    new_shipment, message = shipment_service.create_shipment(shipment)
    
    if not new_shipment:
        raise HTTPException(status_code=400, detail=message)
        
    return {"message": message, "data": new_shipment}

@router.get("/api/shipments")
def list_shipments():
    return {"data": shipment_service.get_all_shipments()}

@router.get("/api/shipments/{shipment_id}")
def get_shipment(shipment_id: str):
    shipment = shipment_service.get_shipment_by_id(shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return {"data": shipment}