import sys
import os

def run_inspection():
    print("=" * 60)
    print(" TIMBERTRUST - PHASE 1: ENVIRONMENT & SYSTEM AUDIT")
    print("=" * 60)

    # 1. Check Python Version
    print(f"\n[1/4] Python Version: {sys.version.split()[0]}")
    if sys.version_info < (3, 9):
        print("    ⚠️ Warning: Python 3.9+ is recommended.")
    else:
        print("    ✅ Python version is compatible.")

    # 2. Check Core Dependencies
    print("\n[2/4] Checking Required AI & Backend Dependencies:")
    dependencies = [
        "fastapi",
        "uvicorn",
        "pydantic",
        "httpx",
        "numpy",
        "faiss",
        "sentence_transformers"
    ]
    
    missing = []
    for dep in dependencies:
        try:
            __import__(dep)
            print(f"    ✅ {dep}: Installed")
        except ImportError:
            print(f"    ❌ {dep}: NOT installed")
            missing.append(dep)

    # 3. Verify Existing Backend Modules
    print("\n[3/4] Verifying Existing TimberTrust Services & Utils:")
    modules_to_test = [
        "backend.utils.json_db",
        "backend.services.transport_service",
        "backend.services.alert_service",
        "backend.services.blockchain_service"
    ]
    
    failed_modules = []
    for mod in modules_to_test:
        try:
            __import__(mod)
            print(f"    ✅ {mod}: Import successful")
        except Exception as e:
            print(f"    ❌ {mod}: Import failed ({e})")
            failed_modules.append(mod)

    # 4. Summary & Readiness
    print("\n" + "=" * 60)
    if not missing and not failed_modules:
        print(" SUCCESS: Phase 1 Environment Audit Passed!")
        print(" Your system is 100% ready for Phase 2 (RAG Knowledge Base).")
    else:
        print(" ACTION REQUIRED: Please install missing packages before proceeding.")
        if missing:
            print(f" Missing Packages: {', '.join(missing)}")
        if failed_modules:
            print(f" Failed Backend Modules: {', '.join(failed_modules)}")
    print("=" * 60)

if __name__ == "__main__":
    run_inspection()