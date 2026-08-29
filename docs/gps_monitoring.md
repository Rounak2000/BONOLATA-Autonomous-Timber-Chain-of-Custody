# GPS Monitoring & Geofencing
TimberTrust features a simulated IoT GPS telemetry system for live transportation monitoring.

## Route Simulation
The frontend `monitoring.js` script calculates a dynamic route using linear interpolation between the source and destination coordinates. It sends periodic location updates to the FastAPI backend. The truck's progress is visualized using Leaflet.js maps.

## Geofencing & Alerts
The backend `transport_service.py` evaluates every GPS ping for anomalies:
1. **Route Deviation:** If the distance between two consecutive GPS pings exceeds 10 kilometers (10,000 meters), the system flags it as a sudden jump or tampering, immediately generating a `HIGH` severity `ROUTE_DEVIATION` alert.
2. **Unexpected Stops:** If consecutive pings show exactly the same coordinates before reaching the destination, a `LOW` severity `UNEXPECTED_STOP` alert is generated.
3. **Arrival:** When the vehicle's coordinates fall within 200 meters of the destination, the shipment is automatically marked as `DELIVERED`.