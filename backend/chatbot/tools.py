import os
from typing import List, Dict

# Safely import existing TimberTrust services
from backend.services import transport_service
from backend.services import alert_service
from backend.utils.json_db import load_data

class LiveDataExecutor:
    """Executes read-only API tools to fetch live data from the application database."""
    
    @staticmethod
    def execute(resource: str, operation: str) -> str:
        """Routes the request to the appropriate existing backend service."""
        resource = resource.lower()
        operation = operation.lower()
        
        try:
            if resource == "shipments":
                data = transport_service.get_all_shipments()
                return LiveDataExecutor._format_shipments(data, operation)
                
            elif resource == "alerts":
                data = alert_service.get_all_alerts()
                return LiveDataExecutor._format_alerts(data, operation)
                
            elif resource == "vehicles":
                data = transport_service.get_all_vehicles()
                return f"There are currently {len(data)} registered vehicles in the fleet."
                
            elif resource == "drivers":
                data = transport_service.get_all_drivers()
                return f"There are currently {len(data)} registered drivers in the system."
                
            elif resource == "timber":
                # Fallback to json_db utility if a specific timber_service doesn't exist yet
                data = load_data("timber.json") if os.path.exists("timber.json") else []
                return f"There are currently {len(data)} verified timber batches registered in the inventory."
                
            else:
                return f"I cannot access live data for '{resource}' at the moment."
                
        except Exception as e:
            return f"Error retrieving system data: {str(e)}"

    # --- Formatting Helpers ---
    # These prevent dumping raw JSON to the user and create natural sentences.

    @staticmethod
    def _format_shipments(data: List[Dict], operation: str) -> str:
        active = [s for s in data if s.get("status") not in ["DELIVERED", "COMPLETED"]]
        
        if operation == "count" or not active:
            return f"There are currently {len(data)} total shipments, of which {len(active)} are actively in transit."
            
        # If they want a list/summary, provide the first 3 active shipments
        summary = ", ".join([f"{s.get('shipment_id')} ({s.get('status')})" for s in active[:3]])
        return f"There are {len(active)} active shipments. Recent ones include: {summary}."

    @staticmethod
    def _format_alerts(data: List[Dict], operation: str) -> str:
        # alert_service.get_all_alerts() typically already filters for OPEN alerts, 
        # but we double check here just in case.
        open_alerts = [a for a in data if a.get("status") != "RESOLVED"]
        
        if not open_alerts:
            return "The system is currently secure. There are no active or unresolved alerts."
            
        if operation == "count":
            return f"There are currently {len(open_alerts)} unresolved security alerts."
            
        summary = ", ".join([f"{a.get('type')} ({a.get('severity')})" for a in open_alerts[:3]])
        return f"There are {len(open_alerts)} active alerts, including: {summary}."