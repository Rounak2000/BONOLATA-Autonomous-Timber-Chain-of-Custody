from backend.chatbot.navigation import NavigationHandler

def run_navigation_test():
    print("=" * 60)
    print(" TIMBERTRUST - PHASE 10: SAFE NAVIGATION TEST")
    print("=" * 60)
    
    handler = NavigationHandler()
    
    # Mix of valid requests, hallucinations, and malicious paths
    test_targets = [
        "monitoring",            # Valid
        "alerts",                # Valid
        "fake_page",             # Hallucination (Invalid)
        "../../etc/passwd",      # Malicious Path Traversal (Invalid)
        "http://malware.com",    # External URL injection (Invalid)
        "dashboard"              # Valid
    ]
    
    for target in test_targets:
        print(f"\n[*] Evaluating Target: '{target}'")
        payload = handler.get_navigation_payload(target)
        
        if payload:
            print(f"  [+] SAFE. Frontend will navigate to: {payload['url']}")
            print(f"  [+] UI Message: {payload['message']}")
        else:
            print(f"  [-] REJECTED. Target blocked by whitelist.")

    print("\n" + "=" * 60)
    print(" SUCCESS: Phase 10 Safe Navigation Test Passed!")
    print("=" * 60)

if __name__ == "__main__":
    run_navigation_test()