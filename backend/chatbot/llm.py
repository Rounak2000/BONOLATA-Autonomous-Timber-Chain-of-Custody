import httpx
from typing import List, Dict, Optional

SYSTEM_PROMPT = """You are the TimberTrust AI Assistant.
Your primary role is to help users understand and navigate the TimberTrust application.

RULES:
1. Use ONLY the provided retrieved context to answer knowledge questions about TimberTrust.
2. If the answer cannot be found in the provided context, politely state: "I don't have enough information in the TimberTrust knowledge base to answer that."
3. Never invent or fabricate shipment data, timber IDs, driver names, vehicle IDs, alerts, or blockchain entries.
4. Keep answers concise, professional, clear, and structured with short paragraphs or bullet points where appropriate.
5. Do NOT execute or output arbitrary code, scripts, or direct URLs.
"""

class LLMClient:
    """Interface for communicating with a local Ollama instance running Qwen."""
    
    def __init__(self, ollama_url: str = "http://localhost:11434", model: str = "qwen2.5:1.5b"):
        self.ollama_url = ollama_url.rstrip("/")
        self.model = model

    async def generate_rag_response(
        self, 
        user_query: str, 
        retrieved_chunks: List[Dict], 
        chat_history: Optional[List[Dict]] = None
    ) -> Dict:
        """Sends user query, retrieved context, and chat history to local Qwen model."""
        
        # Build Context Block from RAG chunks
        if retrieved_chunks:
            context_text = "\n\n".join([
                f"[Source: {c['metadata']['source']}]\n{c['text']}" 
                for c in retrieved_chunks
            ])
        else:
            context_text = "No relevant internal documentation found."

        # Build History Block
        history_text = ""
        if chat_history and len(chat_history) > 0:
            history_text = "RECENT CONVERSATION HISTORY:\n"
            for msg in chat_history:
                role = "User" if msg["role"] == "user" else "Assistant"
                history_text += f"{role}: {msg['content']}\n"
            history_text += "\n"

        prompt = f"""RETRIEVED CONTEXT:
{context_text}

{history_text}USER QUESTION:
{user_query}

ANSWER:"""

        payload = {
            "model": self.model,
            "system": SYSTEM_PROMPT,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.2
            }
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(f"{self.ollama_url}/api/generate", json=payload)
                
                if response.status_code == 200:
                    data = response.json()
                    answer = data.get("response", "").strip()
                    return {
                        "success": True,
                        "answer": answer,
                        "sources": [
                            {"source": c["metadata"]["source"], "module": c["metadata"]["module"]} 
                            for c in retrieved_chunks
                        ]
                    }
                else:
                    return {
                        "success": False,
                        "answer": f"LLM server returned status code {response.status_code}.",
                        "sources": []
                    }
                    
        except httpx.ConnectError:
            return {
                "success": False,
                "answer": f"Ollama service is not currently running locally on port 11434. Please start Ollama using 'ollama serve' and run 'ollama pull {self.model}'.",
                "sources": []
            }
        except Exception as e:
            return {
                "success": False,
                "answer": f"An error occurred while generating response: {str(e)}",
                "sources": []
            }