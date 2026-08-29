# TimberTrust Overview
TimberTrust is a Blockchain-Based Teakwood Supply Chain Traceability and Smart Transportation Monitoring System. 

## Core Architecture
TimberTrust uses a lightweight, modular architecture:
- **Backend:** Python and FastAPI.
- **Database:** Local JSON files (e.g., `shipments.json`, `alerts.json`, `timber.json`) acting as a lightweight, fast storage mechanism.
- **Frontend:** Vanilla JavaScript, HTML, CSS, and Leaflet.js for interactive mapping.

## Key Modules
1. **Timber Inventory:** Manages verified teakwood batches.
2. **Fleet & Logistics:** Manages registered drivers, vehicles, and active shipments.
3. **Live Control Center:** Provides real-time tracking of active shipments.
4. **Security & Ledger:** Contains the Alert Center for anomalies and a Blockchain Explorer to view immutable transaction logs.