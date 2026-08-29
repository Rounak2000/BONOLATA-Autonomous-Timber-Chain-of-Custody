from typing import Optional, Dict

# Strict whitelist matching frontend HTML files
SAFE_PAGE_MAP = {
    "dashboard": "dashboard.html",
    "timber": "timber.html",
    "shipment": "shipment.html",
    "monitoring": "monitoring.html",
    "alerts": "alerts.html",
    "blockchain": "blockchain.html",
    "drivers": "drivers.html",
    "vehicles": "vehicles.html",
    "trace": "trace.html"
}

class NavigationHandler:
    """Validates navigation intents against a strict safety whitelist."""
    
    @staticmethod
    def get_navigation_payload(target: str) -> Optional[Dict[str, str]]:
        """
        Checks if the target is in the safe whitelist.
        Returns a structured dictionary for the frontend if safe, or None if invalid.
        """
        if not target:
            return None
            
        target_lower = target.lower()
        
        # Security Check: Reject anything not in the explicit whitelist
        if target_lower in SAFE_PAGE_MAP:
            return {
                "target": target_lower,
                "url": SAFE_PAGE_MAP[target_lower],
                "message": f"Sure — opening {target_lower.title()}."
            }
        
        # If the LLM hallucinates a page or a user attempts path traversal, reject it.
        return None