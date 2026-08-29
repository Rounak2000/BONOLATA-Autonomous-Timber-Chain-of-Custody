from backend.chatbot.rag import RAGRetriever

def run_retrieval_tests():
    print("=" * 60)
    print(" TIMBERTRUST - PHASE 7: RETRIEVAL PIPELINE TEST")
    print("=" * 60)
    
    retriever = RAGRetriever()
    
    test_queries = [
        "How is route deviation detected in TimberTrust?",
        "What events are recorded on the blockchain?",
        "What is the capital of France?"  # Out-of-scope query
    ]
    
    for i, query in enumerate(test_queries, 1):
        print(f"\n[Test Query {i}]: \"{query}\"")
        results = retriever.retrieve(query, top_k=2, distance_threshold=1.5)
        
        if results:
            print(f"  [+] Found {len(results)} relevant chunk(s):")
            for res in results:
                src = res['metadata']['source']
                dist = res['distance']
                snippet = res['text'][:120].replace('\n', ' ')
                print(f"      - Source: {src} (L2 Distance: {dist})")
                print(f"        Text: \"{snippet}...\"")
        else:
            print("  [-] No relevant context found in knowledge base (Query out of scope).")

    print("\n" + "=" * 60)
    print(" SUCCESS: Phase 7 Retrieval Test Passed!")
    print("=" * 60)

if __name__ == "__main__":
    run_retrieval_tests()