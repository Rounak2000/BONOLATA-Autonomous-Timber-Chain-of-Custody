import asyncio
from backend.chatbot.rag import RAGRetriever
from backend.chatbot.llm import LLMClient

async def run_llm_test():
    print("=" * 60)
    print(" TIMBERTRUST - PHASE 8: LLM COMMUNICATION TEST (QWEN)")
    print("=" * 60)
    
    # 1. Initialize Retriever and Qwen LLM Client
    retriever = RAGRetriever()
    llm = LLMClient(model="qwen2.5:1.5b")
    
    query = "How does route deviation work in TimberTrust?"
    print(f"\n[+] User Query: \"{query}\"")
    
    # 2. Retrieve context chunks
    chunks = retriever.retrieve(query, top_k=2)
    print(f"[+] Retrieved {len(chunks)} relevant context chunk(s).")
    
    # 3. Query Qwen LLM
    print(f"[*] Sending request to local Ollama ({llm.model})...")
    result = await llm.generate_rag_response(user_query=query, retrieved_chunks=chunks)
    
    print("\n--- LLM RESPONSE ---")
    print(f"Status Success: {result['success']}")
    print(f"Answer:\n{result['answer']}")
    print(f"Sources Used: {result['sources']}")
    
    print("\n" + "=" * 60)
    print(" SUCCESS: Phase 8 LLM Test Completed with Qwen!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(run_llm_test())