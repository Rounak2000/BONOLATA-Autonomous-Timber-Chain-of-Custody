from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# 1. User Request Schema
class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's chat message")
    session_id: Optional[str] = Field("default", description="Session ID for conversation memory")

# 2. Navigation Payload Schema
class NavigationData(BaseModel):
    target: str = Field(..., description="The safe key for frontend routing (e.g., 'monitoring', 'shipment')")

# 3. Final API Response Schema (Sent to Frontend)
class ChatResponse(BaseModel):
    answer: str = Field(..., description="The textual response from the AI")
    intent: str = Field(..., description="One of: 'knowledge', 'navigation', 'live_data', 'unknown'")
    navigation: Optional[NavigationData] = Field(None, description="Navigation target if intent is 'navigation'")
    sources: Optional[List[Dict[str, str]]] = Field(default=[], description="List of source metadata used for RAG")

# 4. Internal LLM Routing Schema (Used to parse the LLM's raw output securely)
class LLMIntentOutput(BaseModel):
    intent: str
    confidence: float
    target: Optional[str] = None       # Used for navigation
    operation: Optional[str] = None    # Used for live API tools
    resource: Optional[str] = None     # Used for live API tools