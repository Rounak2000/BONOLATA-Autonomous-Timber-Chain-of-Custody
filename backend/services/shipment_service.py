from datetime import datetime
from backend.utils.json_db import load_data, append_data, find_by_id
from backend.models.shipment import ShipmentCreate
from backend.services.blockchain_service import record_transaction

SHIPMENTS_FILE = "shipments.json"
TIMBER_FILE = "timber.json"
VEHICLES_FILE = "vehicles.json"

def create_shipment(shipment_data: ShipmentCreate):
    # 1. Validate that the timber exists
    timber = find_by_id(TIMBER_FILE, "timber_id", shipment_data.timber_id)
    if not timber:
        return None, "Timber not found"
        
    # 2. Validate that the vehicle exists
    vehicle = find_by_id(VEHICLES_FILE, "vehicle_id", shipment_data.vehicle_id)
    if not vehicle:
        return None, "Vehicle not found"
        
    # Ensure the vehicle actually has a driver assigned!
    driver_id = vehicle.get("driver_id")
    if not driver_id:
        return None, "Cannot start shipment: No driver assigned to this vehicle"

    # 3. Generate Shipment ID
    existing = load_data(SHIPMENTS_FILE)
    shipment_id = f"SHP-{len(existing) + 1:04d}"
    
    timestamp = datetime.now().isoformat()
    
   # 4. Build the complete shipment record
    new_shipment = {
        "shipment_id": shipment_id,
        "timber_id": shipment_data.timber_id,
        "vehicle_id": shipment_data.vehicle_id,
        "driver_id": driver_id,  
        "source": shipment_data.source,
        "destination": shipment_data.destination,
        "expected_start": shipment_data.expected_start,
        "expected_arrival": shipment_data.expected_arrival,
        "expected_checkpoints": shipment_data.expected_checkpoints, # NEW
        "status": "CREATED",     
        "route": [],             
        "created_at": timestamp
    }
    
    # 5. Save to JSON database
    append_data(SHIPMENTS_FILE, new_shipment)
    
    # 6. Secure the event in the Blockchain
    record_transaction({
        "event_type": "SHIPMENT_CREATED",
        "shipment_id": shipment_id,
        "timber_id": shipment_data.timber_id,
        "vehicle_id": shipment_data.vehicle_id,
        "timestamp": timestamp
    })
    
    return new_shipment, "Shipment created successfully"

def get_all_shipments():
    return load_data(SHIPMENTS_FILE)

def get_shipment_by_id(shipment_id: str):
    return find_by_id(SHIPMENTS_FILE, "shipment_id", shipment_id)