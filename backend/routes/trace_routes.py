from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from backend.services import trace_service, transport_service

router = APIRouter()

@router.get("/api/trace/{timber_id}")
def get_trace_data(timber_id: str):
    data = trace_service.get_timber_history(timber_id)
    if not data:
        raise HTTPException(status_code=404, detail="Timber history not found")
    return {"data": data}

@router.get("/api/trace/{timber_id}/qr")
def get_qr_code(timber_id: str):
    file_path = trace_service.generate_qr(timber_id)
    # FileResponse sends an actual image file instead of JSON!
    return FileResponse(file_path)

@router.post("/api/transport/shipments")
def create_shipment(payload: dict):
    # Your shipment creation logic
    shipment = transport_service.create_shipment(payload)
    return {"message": "Shipment dispatched successfully", "data": shipment}