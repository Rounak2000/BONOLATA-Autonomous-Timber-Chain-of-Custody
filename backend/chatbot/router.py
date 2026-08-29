from fastapi import APIRouter, HTTPException
from backend.chatbot.schemas import ChatRequest, ChatResponse, NavigationData
from backend.chatbot.intent_router import IntentRouter
from backend.chatbot.navigation import NavigationHandler
from backend.chatbot.tools import LiveDataExecutor
from backend.chatbot.rag import RAGRetriever
from backend.chatbot.llm import LLMClient
from backend.chatbot.guardrails import InputGuardrail
from typing import Dict, List

router = APIRouter()

print("[*] Initializing TimberTrust AI Chatbot Components...")
intent_router = IntentRouter()
nav_handler = NavigationHandler()
live_executor = LiveDataExecutor()
retriever = RAGRetriever()
llm = LLMClient(model="qwen2.5:1.5b")

SESSION_MEMORY: Dict[str, List[Dict]] = {}

@router.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # 0. Apply Defensive Guardrails & Input Sanitization
        is_valid, sanitized_message, error_msg = InputGuardrail.validate_and_sanitize(request.message)
        if not is_valid:
            return ChatResponse(
                answer=error_msg or "Invalid input.",
                intent="unknown",
                navigation=None,
                sources=[]
            )

        session_id = request.session_id or "default"
        if session_id not in SESSION_MEMORY:
            SESSION_MEMORY[session_id] = []
            
        history = SESSION_MEMORY[session_id]
        
        # 1. Classify the user's intent
        intent_data = intent_router.route(sanitized_message)
        
        final_answer = ""
        intent_type = intent_data.intent
        nav_payload_data = None
        sources = []
        
        # 2. Handle Navigation Intent
        if intent_type == "navigation" and intent_data.target:
            nav_payload = nav_handler.get_navigation_payload(intent_data.target)
            if nav_payload:
                final_answer = nav_payload["message"]
                nav_payload_data = NavigationData(target=nav_payload["target"])
            else:
                final_answer = "I couldn't locate that page in the application."
                intent_type = "unknown"
        
        # 3. Handle Live Data Intent
        elif intent_type == "live_data" and intent_data.resource and intent_data.operation:
            final_answer = live_executor.execute(intent_data.resource, intent_data.operation)
            
        # 4. Handle Knowledge (RAG) Intent
        else:
            chunks = retriever.retrieve(sanitized_message, top_k=2)
            llm_result = await llm.generate_rag_response(sanitized_message, chunks, chat_history=history)
            
            if llm_result.get("success"):
                final_answer = llm_result["answer"]
                sources = llm_result.get("sources", [])
            else:
                final_answer = llm_result.get("answer", "I'm having trouble processing that right now.")

        # 5. Update Memory
        history.append({"role": "user", "content": sanitized_message})
        history.append({"role": "assistant", "content": final_answer})
        SESSION_MEMORY[session_id] = history[-6:]
        
        return ChatResponse(
            answer=final_answer,
            intent=intent_type,
            navigation=nav_payload_data,
            sources=sources
        )

    except Exception as e:
        print(f"[!] Chatbot Exception: {e}")
        return ChatResponse(
            answer="I'm sorry, I encountered an unexpected error while processing your request.",
            intent="unknown",
            navigation=None,
            sources=[]
        )