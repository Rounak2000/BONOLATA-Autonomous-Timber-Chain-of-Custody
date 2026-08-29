from fastapi import APIRouter, HTTPException
from backend.models.transfer import TransferRequest
from backend.services import transfer_service

router = APIRouter()

@router.post("/api/transfer")
def transfer_ownership(transfer_req: TransferRequest):
    record, message = transfer_service.process_transfer(transfer_req)
    
    if not record:
        # If record is None, it means the service rejected it
        raise HTTPException(status_code=400, detail=message)
        
    return {"message": message, "transaction": record}