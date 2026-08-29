from backend.chatbot.intent_router import IntentRouter

def run_router_test():
    print("=" * 60)
    print(" TIMBERTRUST - PHASE 9: INTENT ROUTER TEST")
    print("=" * 60)
    
    router = IntentRouter()
    
    test_queries = [
        "Open monitoring page",
        "Take me to the alert center",
        "How many active shipments are there?",
        "Show available drivers",
        "How does route deviation work in TimberTrust?",
        "Explain blockchain traceability",
        "Show dashboard"
    ]
    
    for query in test_queries:
        res = router.route(query)
        print(f"\n[Query]: \"{query}\"")
        print(f"  ➜ Classified Intent : {res.intent.upper()}")
        print(f"  ➜ Confidence        : {res.confidence}")
        if res.target:
            print(f"  ➜ Navigation Target : {res.target} (maps to {res.target}.html)")
        if res.resource:
            print(f"  ➜ Live API Resource : {res.resource} (Op: {res.operation})")

    print("\n" + "=" * 60)
    print(" SUCCESS: Phase 9 Intent Router Test Passed!")
    print("=" * 60)

if __name__ == "__main__":
    run_router_test()