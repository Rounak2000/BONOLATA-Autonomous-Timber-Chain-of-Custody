from backend.blockchain.blockchain import Blockchain
# NEW: Import our alert tool
from backend.services.alert_service import create_alert

timber_blockchain = Blockchain()

def get_chain():
    return timber_blockchain.load_chain()

def validate_chain():
    is_valid, message = timber_blockchain.is_chain_valid()
    
    # NEW RULE: If the blockchain is broken, generate a CRITICAL alert ticket!
    if not is_valid:
        create_alert(
            alert_type="BLOCKCHAIN_TAMPER",
            related_id="SYSTEM",
            message=f"CRITICAL SECURITY FAILURE: {message}",
            severity="CRITICAL"
        )
        
    return {"is_valid": is_valid, "message": message}

def record_transaction(transaction_data: dict):
    new_block = timber_blockchain.add_block(transaction_data)
    return new_block