import random
from datetime import datetime
from backend.utils.json_db import load_data, save_data, append_data

ALERTS_FILE = "alerts.json"

def create_alert(alert_type: str, related_id: str, message: str, severity: str):
    alert_id = f"ALT-{random.randint(1000, 9999)}"
    
    new_alert = {
        "alert_id": alert_id,
        "type": alert_type,          
        "related_id": related_id,    
        "message": message,
        "severity": severity,        
        "status": "OPEN",            
        "timestamp": datetime.now().isoformat()
    }
    
    append_data(ALERTS_FILE, new_alert)
    
    if alert_type != "BLOCKCHAIN_TAMPER":
        try:
            from backend.services import blockchain_service
            blockchain_service.record_transaction({
                "event": "SECURITY_ALERT_TRIGGERED",
                "alert_id": alert_id,
                "alert_type": alert_type,
                "related_id": related_id,
                "severity": severity,
                "message": message
            })
        except Exception as e:
            print(f"Warning: Could not record alert to blockchain: {e}")
    
    return new_alert

def get_all_alerts():
    alerts = load_data(ALERTS_FILE)
    return [a for a in alerts if a.get("status") != "RESOLVED"]

def resolve_alert(alert_id: str):
    alerts = load_data(ALERTS_FILE)
    
    target_alert = None
    remaining_alerts = []
    
    # 1. Search through all alerts first
    for alert in alerts:
        if alert.get("alert_id") == alert_id:
            target_alert = alert
        else:
            remaining_alerts.append(alert)
            
    # 2. ✅ FIXED: Check if found AFTER checking all items in the list
    if not target_alert:
        return None

    save_data(ALERTS_FILE, remaining_alerts)
    
    try:
        from backend.services import blockchain_service
        blockchain_service.record_transaction({
            "event": "SECURITY_ALERT_RESOLVED",
            "alert_id": alert_id,
            "related_id": target_alert.get("related_id"),
            "status": "RESOLVED_AND_PURGED"
        })
    except Exception as e:
        print(f"Warning: Could not record resolution to blockchain: {e}")
        
    return target_alert