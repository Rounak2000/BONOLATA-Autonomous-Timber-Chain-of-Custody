import os
import qrcode
from backend.utils.json_db import load_data, find_by_id

def get_timber_history(timber_id: str):
    # 1. Get the main timber record
    timber = find_by_id("timber.json", "timber_id", timber_id)
    if not timber:
        return None
        
    # 2. Get all shipments related to this timber
    all_shipments = load_data("shipments.json")
    timber_shipments = [s for s in all_shipments if s.get("timber_id") == timber_id]
    
    # 3. Get all blockchain events related to this timber
    blockchain = load_data("blockchain.json")
    events = []
    
    for block in blockchain:
        txn = block.get("transaction", {})
        if isinstance(txn, dict):
            # Check if this transaction mentions our timber (as parent or exact id)
            if txn.get("timber_id") == timber_id or txn.get("parent_id") == timber_id:
                events.append({
                    "timestamp": block["timestamp"],
                    "details": txn
                })

    return {
        "timber": timber,
        "shipments": timber_shipments,
        "blockchain_events": events
    }

def generate_qr(timber_id: str):
    qr_folder = "qr_codes"
    file_path = os.path.join(qr_folder, f"{timber_id}.png")
    
    # If we haven't generated it yet, make it now!
    if not os.path.exists(file_path):
        # We encode a dummy URL that points to our trace page
        # In the real world, this would be "https://timbertrust.com/trace.html?id=..."
        url = f"http://127.0.0.1/trace.html?id={timber_id}"
        
        img = qrcode.make(url)
        img.save(file_path)
        
    return file_path