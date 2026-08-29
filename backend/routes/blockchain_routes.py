from fastapi import APIRouter
from backend.services import blockchain_service

router = APIRouter()

@router.get("/api/blockchain")
def view_blockchain():
    chain = blockchain_service.get_chain()
    return {"chain": chain, "length": len(chain)}

@router.get("/api/blockchain/validate")
def validate_blockchain():
    return blockchain_service.validate_chain()

@router.post("/api/blockchain/verify")
def manually_record_event(event_data: dict):
    # In the future, other Python files will call this automatically. 
    # For now, we expose a way to manually add a record via API for testing.
    block = blockchain_service.record_transaction(event_data)
    return {"message": "Event permanently recorded in blockchain", "block": block}