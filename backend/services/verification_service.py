from datetime import datetime
from backend.utils.json_db import find_by_id, update_by_id
from backend.models.verification import TimberVerification

TIMBER_FILE = "timber.json"

def process_verification(verification_data: TimberVerification):
    # 1. Find the existing timber record in our database
    timber = find_by_id(TIMBER_FILE, "timber_id", verification_data.timber_id)
    
    # If the ID doesn't exist, return None so the route knows it failed
    if not timber:
        return None
        
    # 2. Update the specific fields in the dictionary
    timber["verification_status"] = verification_data.status
    timber["verified_by"] = verification_data.verifier_name
    timber["verification_comments"] = verification_data.comments
    
    # .isoformat() creates a standard, computer-readable timestamp string
    timber["verified_at"] = datetime.now().isoformat()
    
    # 3. Save the updated dictionary back to the JSON file
    update_by_id(TIMBER_FILE, "timber_id", verification_data.timber_id, timber)
    
    return timber