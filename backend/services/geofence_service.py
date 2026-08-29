import math
from backend.utils.json_db import load_data, append_data

CHECKPOINTS_FILE = "checkpoints.json"

# The Haversine formula to calculate real-world distance in meters
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371000  # Radius of the Earth in meters
    
    # Convert latitude and longitude from degrees to radians for the math formula
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2.0) ** 2
        
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance_in_meters = R * c
    return distance_in_meters

def create_checkpoint(checkpoint_data):
    existing = load_data(CHECKPOINTS_FILE)
    checkpoint_id = f"CHK-{len(existing) + 1:04d}"
    
    new_checkpoint = checkpoint_data.dict()
    new_checkpoint["checkpoint_id"] = checkpoint_id
    
    append_data(CHECKPOINTS_FILE, new_checkpoint)
    return new_checkpoint

def get_all_checkpoints():
    return load_data(CHECKPOINTS_FILE)

# This is the radar! It checks if a vehicle is inside any geofence.
def check_location_against_checkpoints(vehicle_lat, vehicle_lng):
    checkpoints = load_data(CHECKPOINTS_FILE)
    inside_checkpoints = []
    
    for chk in checkpoints:
        # Calculate distance between vehicle and the center of the checkpoint
        dist = calculate_distance(vehicle_lat, vehicle_lng, chk["latitude"], chk["longitude"])
        
        # If the distance is smaller than the radius, we are INSIDE the circle!
        if dist <= chk["radius_meters"]:
            inside_checkpoints.append({
                "checkpoint_id": chk["checkpoint_id"],
                "name": chk["name"],
                "distance_meters": round(dist, 2)
            })
            
    return inside_checkpoints