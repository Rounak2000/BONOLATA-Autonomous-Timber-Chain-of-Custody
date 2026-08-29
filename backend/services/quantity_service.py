from datetime import datetime
from backend.utils.json_db import load_data, find_by_id, update_by_id, append_data
from backend.models.processing import ProcessRequest
from backend.services.alert_service import create_alert
from backend.services.blockchain_service import record_transaction

TIMBER_FILE = "timber.json"

def process_timber_split(request: ProcessRequest):
    # 1. Find the parent timber
    parent = find_by_id(TIMBER_FILE, "timber_id", request.parent_timber_id)
    if not parent:
        return None, "Parent timber not found"
        
    if parent.get("verification_status") != "VERIFIED":
        return None, "Cannot process unverified timber"

    if parent.get("status") == "PROCESSED":
        return None, "This timber has already been processed"

    input_qty = parent.get("quantity", 0)
    
    # 2. Calculate totals
    total_output = sum([item.quantity for item in request.outputs])
    total_expected = total_output + request.expected_waste
    
    # Check for mismatch
    discrepancy = input_qty - total_expected
    alert_generated = None
    
    # Allow a tiny margin of error (e.g., 0.1) for decimal math, otherwise it's a mismatch
    if abs(discrepancy) > 0.1:
        alert_generated = create_alert(
            alert_type="QUANTITY_MISMATCH",
            related_id=request.parent_timber_id,
            message=f"Input: {input_qty}. Output+Waste: {total_expected}. Unexplained difference: {discrepancy} {parent.get('unit')}",
            severity="HIGH" if discrepancy > 10 else "MEDIUM"
        )

    # 3. Create the new child records
    existing_timber = load_data(TIMBER_FILE)
    base_id = len(existing_timber)
    
    child_records = []
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    
    for i, item in enumerate(request.outputs):
        child_id = f"{request.parent_timber_id}-{alphabet[i]}"
        
        new_child = {
            "timber_id": child_id,
            "species": item.species,
            "source_type": "Processed at Sawmill",
            "source_name": request.processor_name,
            "origin_location": request.location,
            "quantity": item.quantity,
            "unit": item.unit,
            "harvest_date": parent.get("harvest_date"),
            "certificate_number": parent.get("certificate_number"),
            "verification_status": "VERIFIED", # Inherits verification
            "created_at": datetime.now().isoformat(),
            "current_owner": request.processor_name,
            "parent_timber_id": request.parent_timber_id, # Links back to parent!
            "status": "ACTIVE"
        }
        append_data(TIMBER_FILE, new_child)
        child_records.append(new_child)

    # 4. Mark parent as PROCESSED
    parent["status"] = "PROCESSED"
    update_by_id(TIMBER_FILE, "timber_id", request.parent_timber_id, parent)

    # 5. Record event in Blockchain
    record_transaction({
        "event_type": "TIMBER_PROCESSED",
        "parent_id": request.parent_timber_id,
        "children_created": [child["timber_id"] for child in child_records],
        "processor": request.processor_name,
        "timestamp": datetime.now().isoformat(),
        "mismatch_alert": alert_generated["alert_id"] if alert_generated else None
    })

    return child_records, "Processing complete", alert_generated