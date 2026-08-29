from datetime import datetime
from backend.utils.json_db import load_data, append_data, find_by_id
from backend.models.timber import TimberCreate

FILENAME = "timber.json"

def create_timber(timber_data: TimberCreate):
    # 1. Load existing data to figure out the next ID number
    existing_records = load_data(FILENAME)
    
    # Generate an ID like TEAK-0001, TEAK-0002
    next_number = len(existing_records) + 1
    new_timber_id = f"TEAK-{next_number:04d}"
    
    # 2. Prepare the complete record
    # We take the user's data and add our system-generated fields
    new_record = timber_data.dict()
    new_record["timber_id"] = new_timber_id
    new_record["verification_status"] = "PENDING"
    new_record["created_at"] = datetime.now().isoformat()
    new_record["parent_timber_id"] = None
    
    # 3. Save to database
    append_data(FILENAME, new_record)
    
    return new_record

def get_all_timber():
    return load_data(FILENAME)

def get_timber_by_id(timber_id: str):
    return find_by_id(FILENAME, "timber_id", timber_id)