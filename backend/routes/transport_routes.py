from fastapi import APIRouter, HTTPException
from backend.models.transport import DriverCreate, VehicleCreate, AssignDriver, LocationUpdate
from backend.services import transport_service

router = APIRouter()

# --- DRIVER ROUTES ---

@router.post("/api/drivers")
def add_driver(driver: DriverCreate):
    new_driver = transport_service.create_driver(driver)
    return {"message": "Driver added", "data": new_driver}

@router.get("/api/drivers")
def list_drivers():
    return {"data": transport_service.get_all_drivers()}


# --- VEHICLE ROUTES ---

@router.post("/api/vehicles")
def add_vehicle(vehicle: VehicleCreate):
    new_vehicle = transport_service.create_vehicle(vehicle)
    return {"message": "Vehicle added", "data": new_vehicle}

@router.get("/api/vehicles")
def list_vehicles():
    return {"data": transport_service.get_all_vehicles()}

@router.put("/api/vehicles/{vehicle_id}/assign")
def assign_driver(vehicle_id: str, assign_req: AssignDriver):
    vehicle, message = transport_service.assign_driver_to_vehicle(vehicle_id, assign_req.driver_id)
    if not vehicle:
        raise HTTPException(status_code=400, detail=message)
    return {"message": message, "vehicle": vehicle}


# --- SHIPMENT ROUTES ---

@router.get("/api/transport/shipments")
def list_shipments():
    return {"data": transport_service.get_all_shipments()}

@router.post("/api/transport/shipments")
def create_shipment(payload: dict):
    shipment, err = transport_service.create_shipment(payload)
    if err:
        raise HTTPException(status_code=400, detail=f"Shipment error: {err}")
    return {"message": "Shipment dispatched successfully", "data": shipment}

@router.get("/api/transport/shipments/{shipment_id}")
def get_shipment(shipment_id: str):
    shipment = transport_service.get_shipment_by_id(shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return {"data": shipment}


# --- GPS TELEMETRY ROUTES ---

# Dual route decorators prevent 405 "Method Not Allowed" errors by matching both URL formats
@router.post("/api/transport/shipments/{shipment_id}/location")
@router.post("/api/transport/{shipment_id}/location")
def update_location(shipment_id: str, location: LocationUpdate):
    shipment, message = transport_service.update_shipment_location(
        shipment_id, 
        location.latitude, 
        location.longitude
    )
    
    if not shipment:
        raise HTTPException(status_code=404, detail=message)
        
    return {"message": message, "data": shipment}