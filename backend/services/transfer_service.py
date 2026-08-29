import random
from datetime import datetime
from backend.utils.json_db import find_by_id, update_by_id
from backend.models.transfer import TransferRequest
from backend.services.blockchain_service import record_transaction

TIMBER_FILE = "timber.json"

def process_transfer(transfer_req: TransferRequest):
    # 1. Find the timber in the database
    timber = find_by_id(TIMBER_FILE, "timber_id", transfer_req.timber_id)
    if not timber:
        return None, "Timber not found"
        
    # Only allow transfer if it has been verified!
    if timber.get("verification_status") != "VERIFIED":
        return None, "Cannot transfer unverified timber"
        
    # 2. Extract the current owner before we change it
    from_owner = timber.get("current_owner", "Unknown")
    
    # 3. Create a unique transaction receipt
    transaction_id = f"TXN-{random.randint(10000, 99999)}"
    timestamp = datetime.now().isoformat()
    
    # Create the permanent record for the blockchain
    transfer_record = {
        "event_type": "OWNERSHIP_TRANSFER",
        "transaction_id": transaction_id,
        "timber_id": transfer_req.timber_id,
        "from_owner": from_owner,
        "to_owner": transfer_req.to_owner,
        "location": transfer_req.location,
        "timestamp": timestamp,
        "remarks": transfer_req.remarks
    }
    
    # 4. Save to Blockchain!
    record_transaction(transfer_record)
    
    # 5. Update the JSON database with the new owner
    timber["current_owner"] = transfer_req.to_owner
    update_by_id(TIMBER_FILE, "timber_id", transfer_req.timber_id, timber)
    
    return transfer_record, "Transfer successful"