import re
from typing import Dict
from backend.chatbot.schemas import LLMIntentOutput

# Safe target mapping for page navigation
NAVIGATION_TARGETS = {
    "dashboard": ["dashboard", "home", "main overview"],
    "timber": ["timber", "inventory", "teakwood", "batch", "batches"],
    "shipment": ["shipment", "shipments", "dispatch", "delivery"],
    "monitoring": ["monitoring", "live control", "gps", "tracking", "map", "route"],
    "alerts": ["alerts", "alert center", "security alerts", "warnings"],
    "blockchain": ["blockchain", "ledger", "explorer", "blocks"],
    "drivers": ["drivers", "driver"],
    "vehicles": ["vehicles", "fleet", "trucks", "vehicle"],
    "trace": ["trace", "traceability", "qr", "verify timber"]
}

# Live data patterns mapped to application resource actions
LIVE_DATA_PATTERNS = {
    "shipments": ["how many shipments", "active shipments", "shipment count", "list shipments", "in transit"],
    "alerts": ["active alerts", "how many alerts", "open alerts", "unresolved alerts", "security alerts count"],
    "timber": ["registered timber", "timber count", "how many timber", "total timber"],
    "vehicles": ["vehicle status", "how many vehicles", "available vehicles", "truck count"],
    "drivers": ["driver list", "how many drivers", "available drivers"]
}

class IntentRouter:
    """Classifies user messages into navigation, live_data, or knowledge intents."""

    def route(self, query: str) -> LLMIntentOutput:
        query_clean = query.strip().lower()

        # 1. Check for Navigation Intents (Fast Pattern Matching)
        nav_target = self._check_navigation(query_clean)
        if nav_target:
            return LLMIntentOutput(
                intent="navigation",
                confidence=0.98,
                target=nav_target
            )

        # 2. Check for Live Data Requests (Fast Pattern Matching)
        live_resource = self._check_live_data(query_clean)
        if live_resource:
            return LLMIntentOutput(
                intent="live_data",
                confidence=0.95,
                resource=live_resource,
                operation="count" if "how many" in query_clean or "count" in query_clean else "list"
            )

        # 3. Default to Domain Knowledge (RAG)
        return LLMIntentOutput(
            intent="knowledge",
            confidence=0.90
        )

    def _check_navigation(self, query: str) -> str | None:
        # Check explicit navigation verbs
        nav_triggers = ["open", "go to", "take me to", "show", "navigate to", "view", "switch to"]
        
        has_nav_trigger = any(trigger in query for trigger in nav_triggers)
        
        for target, keywords in NAVIGATION_TARGETS.items():
            for kw in keywords:
                # Direct command like "open monitoring" or "show alerts"
                if has_nav_trigger and kw in query:
                    return target
                # Single word page names like "dashboard" or "monitoring"
                if query == kw or query == f"go {kw}" or query == f"show {kw}":
                    return target
                    
        return None

    def _check_live_data(self, query: str) -> str | None:
        for resource, phrases in LIVE_DATA_PATTERNS.items():
            for phrase in phrases:
                if phrase in query:
                    return resource
        return None