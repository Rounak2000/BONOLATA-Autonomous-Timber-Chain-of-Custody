from fastapi import APIRouter, HTTPException
from backend.models.verification import TimberVerification
from backend.services import verification_service

router = APIRouter()

@router.post("/api/verification/verify")
def verify_timber(verification: TimberVerification):
    # Security check: Ensure the status is valid before processing
    if verification.status not in ["VERIFIED", "REJECTED"]:
        raise HTTPException(status_code=400, detail="Status must be VERIFIED or REJECTED")
        
    # Send data to the service layer to do the actual work
    updated_timber = verification_service.process_verification(verification)
    
    # If the service returns None, it means the timber ID was wrong
    if not updated_timber:
        raise HTTPException(status_code=404, detail="Timber not found")
        
    return {
        "message": f"Timber {verification.status} successfully (DEMO VERIFICATION)", 
        "data": updated_timber
    }