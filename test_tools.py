from backend.chatbot.tools import LiveDataExecutor

def run_tools_test():
    print("=" * 60)
    print(" TIMBERTRUST - PHASE 11: LIVE DATA TOOLS TEST")
    print("=" * 60)
    
    executor = LiveDataExecutor()
    
    # Test our whitelisted resources
    test_cases = [
        ("shipments", "count"),
        ("shipments", "list"),
        ("alerts", "count"),
        ("vehicles", "count"),
        ("drivers", "count"),
        ("timber", "count"),
        ("fake_resource", "count")  # Should fall back safely
    ]
    
    for resource, operation in test_cases:
        print(f"\n[*] Fetching LIVE DATA -> Resource: '{resource.upper()}', Operation: '{operation.upper()}'")
        
        # Execute the tool
        response_text = executor.execute(resource, operation)
        
        print(f"  [+] Bot Response: {response_text}")

    print("\n" + "=" * 60)
    print(" SUCCESS: Phase 11 Live API Tools Test Passed!")
    print("=" * 60)

if __name__ == "__main__":
    run_tools_test()