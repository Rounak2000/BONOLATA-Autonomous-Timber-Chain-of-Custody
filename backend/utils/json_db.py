import json
import os

# 1. Find the exact path to the database folder
# This ensures it works no matter where you run the server from
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATABASE_DIR = os.path.join(BASE_DIR, "database")

def get_file_path(filename):
    return os.path.join(DATABASE_DIR, filename)

def load_data(filename):
    """Opens a JSON file and reads the list of data inside."""
    path = get_file_path(filename)
    
    # If the file doesn't exist yet, return an empty list
    if not os.path.exists(path):
        return []
    
    with open(path, "r") as file:
        return json.load(file)

def save_data(filename, data):
    """Takes a list of data and saves it into the JSON file."""
    path = get_file_path(filename)
    with open(path, "w") as file:
        # indent=4 formats the file beautifully so humans can read it easily!
        json.dump(data, file, indent=4)

def append_data(filename, new_record):
    """Loads existing data, adds one new item, and saves it back."""
    data = load_data(filename)
    data.append(new_record)
    save_data(filename, data)

def find_by_id(filename, id_field, id_value):
    """Searches the file for a specific item (e.g., finding a timber log by its ID)."""
    data = load_data(filename)
    for record in data:
        if record.get(id_field) == id_value:
            return record
    return None

def update_by_id(filename, id_field, id_value, updated_record):
    """Finds an existing item and replaces it with updated information."""
    data = load_data(filename)
    for i, record in enumerate(data):
        if record.get(id_field) == id_value:
            data[i] = updated_record
            save_data(filename, data)
            return True
    return False