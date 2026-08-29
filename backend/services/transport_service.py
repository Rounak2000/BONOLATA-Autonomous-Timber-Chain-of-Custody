import random
from datetime import datetime
from backend.utils.json_db import load_data, append_data, find_by_id, update_by_id
from backend.models.transport import DriverCreate, VehicleCreate
from backend.services.geofence_service import check_location_against_checkpoints, calculate_distance, load_data as load_checkpoints
from backend.services.alert_service import create_alert

DRIVERS_FILE = "drivers.json"
VEHICLES_FILE = "vehicles.json"
SHIPMENTS_FILE = "shipments.json"

# --- DRIVER LOGIC ---

def create_driver(driver_data: DriverCreate):
    existing = load_data(DRIVERS_FILE)
    driver_id = f"DRV-{len(existing) + 1:04d}"
    
    new_driver = driver_data.dict() if hasattr(driver_data, "dict") else driver_data
    new_driver["driver_id"] = driver_id
    new_driver["status"] = "AVAILABLE"
    
    append_data(DRIVERS_FILE, new_driver)
    return new_driver

def get_all_drivers():
    return load_data(DRIVERS_FILE)


# --- VEHICLE LOGIC ---

def create_vehicle(vehicle_data: VehicleCreate):
    existing = load_data(VEHICLES_FILE)
    
    new_vehicle = vehicle_data.dict() if hasattr(vehicle_data, "dict") else vehicle_data
    
    if not new_vehicle.get("vehicle_id"):
        new_vehicle["vehicle_id"] = f"VEH-{len(existing) + 1:04d}"
        
    if not new_vehicle.get("driver_id") or str(new_vehicle.get("driver_id")).strip() == "":
        new_vehicle["driver_id"] = None
        
    new_vehicle["status"] = "AVAILABLE"
    
    append_data(VEHICLES_FILE, new_vehicle)
    return new_vehicle

def assign_driver_to_vehicle(vehicle_id: str, driver_id: str):
    vehicle = find_by_id(VEHICLES_FILE, "vehicle_id", vehicle_id)
    if not vehicle:
        return None, "Vehicle not found"
        
    driver = find_by_id(DRIVERS_FILE, "driver_id", driver_id)
    if not driver:
        return None, "Driver not found"
        
    if driver.get("status") != "AVAILABLE":
        return None, "Driver is currently not available"

    vehicle["driver_id"] = driver_id
    update_by_id(VEHICLES_FILE, "vehicle_id", vehicle_id, vehicle)
    
    return vehicle, "Driver assigned successfully"

def get_all_vehicles():
    return load_data(VEHICLES_FILE)


# --- SHIPMENT LOGIC ---

def get_all_shipments():
    return load_data(SHIPMENTS_FILE)

def get_shipment_by_id(shipment_id: str):
    return find_by_id(SHIPMENTS_FILE, "shipment_id", shipment_id)

def create_shipment(data):
    try:
        # Convert Pydantic model to dictionary if passed as an object
        if hasattr(data, "dict"):
            data = data.dict()
        elif hasattr(data, "model_dump"):
            data = data.model_dump()

        shipment_id = f"SHP-{random.randint(1000, 9999)}"

        src_lat = float(data.get("source_latitude", 26.5405))
        src_lng = float(data.get("source_longitude", 88.7194))
        dst_lat = float(data.get("destination_latitude", 22.8800))
        dst_lng = float(data.get("destination_longitude", 88.0100))

        new_shipment = {
            "shipment_id": shipment_id,
            "timber_id": data.get("timber_id", "UNKNOWN"),
            "vehicle_id": data.get("vehicle_id", "UNKNOWN"),
            "driver_id": data.get("driver_id", "UNKNOWN"),
            "source": data.get("source", "N/A"),
            "source_latitude": src_lat,
            "source_longitude": src_lng,
            "destination": data.get("destination", "N/A"),
            "destination_latitude": dst_lat,
            "destination_longitude": dst_lng,
            "expected_start": data.get("expected_start", datetime.now().isoformat()),
            "expected_arrival": data.get("expected_arrival", datetime.now().isoformat()),
            "expected_checkpoints": data.get("expected_checkpoints", []),
            "status": "IN_TRANSIT",
            "route": [
                {
                    "latitude": src_lat,
                    "longitude": src_lng,
                    "timestamp": datetime.now().isoformat()
                }
            ],
            "created_at": datetime.now().isoformat()
        }

        append_data(SHIPMENTS_FILE, new_shipment)

        # Log dispatch transaction to blockchain
        try:
            from backend.services import blockchain_service
            blockchain_service.record_transaction({
                "event": "SHIPMENT_DISPATCHED",
                "shipment_id": shipment_id,
                "timber_id": new_shipment["timber_id"],
                "vehicle_id": new_shipment["vehicle_id"],
                "driver_id": new_shipment["driver_id"],
                "source": new_shipment["source"],
                "destination": new_shipment["destination"]
            })
        except Exception as b_err:
            print(f"Warning: Blockchain log skipped: {b_err}")

        return new_shipment, None

    except Exception as e:
        print(f"Error in create_shipment: {e}")
        return None, str(e)


# --- GPS TELEMETRY & ALERT LOGIC ---
def update_shipment_location(shipment_id: str, lat: float, lng: float):
    shipment = find_by_id(SHIPMENTS_FILE, "shipment_id", shipment_id)
    if not shipment:
        return None, "Shipment not found"

    if shipment.get("status") in ["CREATED", "IN_TRANSIT"]:
        shipment["status"] = "IN_TRANSIT"

    current_time = datetime.now().isoformat()
    warnings = []

    # Check against the last recorded location
    if len(shipment.get("route", [])) > 0:
        last_loc = shipment["route"][-1]
        
        # RULE 1: UNEXPECTED STOP
        if last_loc["latitude"] == lat and last_loc["longitude"] == lng:
            create_alert(
                alert_type="UNEXPECTED_STOP",
                related_id=shipment_id,
                message=f"Vehicle has not moved from {lat}, {lng}",
                severity="LOW"
            )
            warnings.append("Vehicle is stopped.")
            
        # RULE 2: ROUTE DEVIATION (Sudden telemetry jump > 10km)
        else:
            dist = calculate_distance(lat, lng, last_loc["latitude"], last_loc["longitude"])
            if dist > 10000:
                create_alert(
                    alert_type="ROUTE_DEVIATION",
                    related_id=shipment_id,
                    message=f"Vehicle suddenly jumped {round(dist/1000, 1)}km! Possible tampering.",
                    severity="HIGH"
                )
                warnings.append("Route Deviation Detected!")

    # RULE 3: DESTINATION ARRIVAL CHECK (Within 200m of destination)
    dst_lat = shipment.get("destination_latitude")
    dst_lng = shipment.get("destination_longitude")
    
    if dst_lat and dst_lng:
        dist_to_dest = calculate_distance(lat, lng, float(dst_lat), float(dst_lng))
        if dist_to_dest <= 200:
            shipment["status"] = "DELIVERED"
            warnings.append("DELIVERED: Vehicle reached destination successfully!")
            
            # Record delivery completion to Blockchain
            try:
                from backend.services import blockchain_service
                blockchain_service.record_transaction({
                    "event": "SHIPMENT_DELIVERED",
                    "shipment_id": shipment_id,
                    "destination": shipment.get("destination", "N/A"),
                    "completed_at": current_time
                })
            except Exception as b_err:
                print(f"Warning: Blockchain delivery log failed: {b_err}")

    new_location = {
        "latitude": lat,
        "longitude": lng,
        "timestamp": current_time
    }
    
    shipment["route"].append(new_location)
    update_by_id(SHIPMENTS_FILE, "shipment_id", shipment_id, shipment)

    warning_text = " | ".join(warnings)
    if warning_text:
        warning_text = f" | WARNINGS: {warning_text}"

    return shipment, f"Location updated.{warning_text}"