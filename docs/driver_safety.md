# TimberTrust Driver Safety & Drowsiness Monitor

The Driver Safety module is an AI-powered Edge Computer Vision system integrated into TimberTrust to monitor driver alertness in real-time.

## Features and Terminology
- **Technology**: Uses MediaPipe Face Landmarker to calculate the Eye Aspect Ratio (EAR) locally in the browser.
- **NORMAL State**: The driver's eyes are open and they appear alert.
- **WARNING State**: The system detects prolonged eye closure indicating possible reduced attention.
- **CRITICAL State**: The system detects sustained eye closure. This triggers a visual warning, an audible alarm in the cabin, and sends a "DRIVER_FATIGUE" alert to the backend.

## Integration
- Alerts are automatically associated with the currently assigned driver, vehicle (e.g., TRK-102), and shipment.
- The alert includes the current GPS coordinates, which are immediately reflected on the TimberTrust Map for dispatchers.
- Alert data is stored in the central `alerts.json` ledger.