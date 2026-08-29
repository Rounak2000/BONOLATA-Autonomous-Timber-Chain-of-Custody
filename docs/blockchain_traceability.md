# Blockchain & Traceability
TimberTrust implements a custom, simulated blockchain ledger to ensure data integrity and traceability throughout the supply chain.

## Immutable Event Logging
Crucial supply chain events are permanently recorded as blocks. Common events include:
- `SHIPMENT_DISPATCHED`: Logged when a new shipment is created and a driver is assigned.
- `SECURITY_ALERT_TRIGGERED`: Logged when anomalies like route deviations occur.
- `SECURITY_ALERT_RESOLVED`: Logged when an admin resolves an alert in the system.
- `SHIPMENT_DELIVERED`: Logged when a vehicle reaches its destination.

## QR Traceability
Each verified timber batch can be associated with a QR code, allowing supply chain participants to verify the origin and status of the teakwood, ensuring it is legally sourced and verified.