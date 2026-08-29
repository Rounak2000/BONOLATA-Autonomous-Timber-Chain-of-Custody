# 🌲 TimberTrust
**Blockchain-Based Teakwood Supply Chain Traceability and Smart Transportation Monitoring System**

## 📖 Problem Statement
The global timber supply chain faces massive challenges including illegal logging, fake certificates, record manipulation, and transit theft. Traditional databases cannot mathematically prove that historical records haven't been secretly altered. Furthermore, once timber is on the move, blind spots in transportation allow for unauthorized stops and route deviations.

## 🎯 Objectives
TimberTrust solves these problems through two core modules:
1. **Blockchain Traceability:** Ensures that once a timber log is registered, verified, processed, or transferred, the record becomes cryptographically permanent.
2. **Transportation Monitoring:** Uses simulated GPS pings and Haversine-formula geofencing to detect unauthorized route deviations, unexpected stops, and shipment delays in real-time.

> **Note:** Blockchain protects the *integrity* of recorded information, while verification mechanisms (simulated by Admin approval) improve the *reliability* of the information before it is recorded.

## 🚀 Features
* **Timber Registration:** Generate unique `TEAK-XXXX` IDs for raw materials.
* **Role-Based Verification:** Authorities must verify timber before it enters the trusted chain.
* **Custom Blockchain Ledger:** Implements SHA-256 hashing to secure transactions.
* **Tamper Detection:** Instantly flags the exact block if data is secretly altered.
* **Sawmill Processing Engine:** Mathematically compares input vs. output quantities and automatically flags theft (`QUANTITY_MISMATCH`).
* **Geofencing & GPS Simulation:** Calculates real-time distance to checkpoints.
* **Automated Security Alerts:** Triggers tickets for `ROUTE_DEVIATION`, `UNEXPECTED_STOP`, and `DELAYED_SHIPMENT`.
* **Consumer Traceability:** Generates a dynamic QR code that displays the tree's entire history to the end buyer.
* **Live Admin Dashboard:** Real-time statistics and interactive map visualization.

## 💻 Technology Stack
* **Backend:** Python, FastAPI, Uvicorn, Pydantic
* **Database:** JSON (File-based storage for prototype demonstration)
* **Blockchain:** Python `hashlib` (SHA-256)
* **Frontend:** HTML5, CSS3, Vanilla JavaScript, Fetch API
* **Mapping:** Leaflet.js, OpenStreetMap
* **Traceability:** Python `qrcode`

## 📁 Folder Structure
```text
TimberTrust/
├── backend/
│   ├── blockchain/      # Custom blockchain & block logic
│   ├── database/        # JSON files acting as our database
│   ├── models/          # Pydantic data validation schemas
│   ├── routes/          # FastAPI endpoints (URLs)
│   ├── services/        # Business logic (math, IDs, geofencing)
│   ├── utils/           # Helper scripts (JSON read/write)
│   └── main.py          # FastAPI application entry point
├── frontend/
│   ├── css/             # Stylesheets
│   ├── js/              # Client-side API fetching and UI logic
│   ├── dashboard.html   # Admin stats view
│   ├── monitoring.html  # Live Leaflet Map
│   ├── timber.html      # Registration UI
│   ├── shipment.html    # Transport UI
│   └── blockchain.html  # Ledger validation UI
├── qr_codes/            # Generated product QR images
└── requirements.txt     # Python dependencies