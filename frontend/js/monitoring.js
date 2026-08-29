/* =========================================================
   TIMBERTRUST - LIVE MONITORING & IoT SIMULATION
   ========================================================= */

let map;
let marker;
let routeLine; 
let pathCoords = []; 
let simulationInterval;
let activeShipmentsMap = {};
let currentShipment = null;

let currentLat = 22.8800; 
let currentLng = 88.0100;
let dynamicRoute = [];
let routeIndex = 0;

// NEW: Layer to hold the planned dashed line and arrows
let plannedRouteLayer; 

// 1. Initialize OpenStreetMap (Leaflet)
function initMap() {
    map = L.map('map').setView([currentLat, currentLng], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    plannedRouteLayer = L.layerGroup().addTo(map); // Initialize the planned route layer

    marker = L.marker([currentLat, currentLng]).addTo(map);
    
    routeLine = L.polyline(pathCoords, {
        color: '#10b981', // Bright Emerald Green for ACTUAL path driven
        weight: 6,
        opacity: 0.9,
        smoothFactor: 1
    }).addTo(map);
}

// 2. Add log entry to terminal
function addLog(message, type = "normal") {
    const terminal = document.getElementById('telemetry-log');
    if (!terminal) return;
    const time = new Date().toLocaleTimeString();
    
    let colorClass = "";
    if (type === "error") colorClass = "log-error";
    if (type === "info") colorClass = "log-info";
    if (type === "warn") colorClass = "log-warn";

    terminal.innerHTML += `<p class="${colorClass}">[${time}] ${message}</p>`;
    terminal.scrollTop = terminal.scrollHeight;
}

// 3. Generate Interpolated Route between Source and Destination
function generateRoutePoints(srcLat, srcLng, dstLat, dstLng, steps = 15) {
    const points = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        let lat = srcLat + (dstLat - srcLat) * t;
        let lng = srcLng + (dstLng - srcLng) * t;

        if (i > 0 && i < steps) {
            const jitterLat = (Math.sin(t * Math.PI) * 0.005) * (i % 2 === 0 ? 1 : -1);
            const jitterLng = (Math.sin(t * Math.PI) * 0.005) * (i % 2 === 0 ? -1 : 1);
            lat += jitterLat;
            lng += jitterLng;
        }

        points.push([lat, lng]);
    }
    return points;
}

// NEW: Helper function to visually draw the PREDEFINED route with arrows
function drawPlannedRouteVisuals() {
    plannedRouteLayer.clearLayers(); // Clear old planned route

    // Draw the dashed line
    const dashedLine = L.polyline(dynamicRoute, {
        color: '#64748b', // Slate grey
        weight: 4,
        dashArray: '10, 10', // Makes it dashed
        opacity: 0.7
    }).addTo(plannedRouteLayer);

    // Calculate angles and place arrows along the route
    for (let i = 1; i < dynamicRoute.length - 1; i += 3) { // Place an arrow every few steps
        let p1 = dynamicRoute[i];
        let p2 = dynamicRoute[i+1];
        
        // Calculate bearing (angle) for the arrow
        let dy = p2[0] - p1[0]; // Latitude diff
        let dx = p2[1] - p1[1]; // Longitude diff
        let angle = Math.atan2(dx, dy) * (180 / Math.PI); // Convert to degrees

        // Create a custom CSS-rotated arrow marker
        let arrowIcon = L.divIcon({
            className: 'route-direction-arrow',
            html: `<div style="transform: rotate(${angle}deg); color: #3b82f6; font-size: 20px; font-weight: 900; line-height: 1; text-shadow: 0px 0px 3px white;">▲</div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        L.marker(p1, { icon: arrowIcon, interactive: false }).addTo(plannedRouteLayer);
    }

    // Auto-zoom the map so the user can see the entire planned journey!
    map.fitBounds(dashedLine.getBounds(), { padding: [40, 40] });
}

// 4. Load Active Shipments into Dropdown
async function loadActiveShipments() {
    const select = document.getElementById('active_shipment');
    if (!select) return;

    try {
        const response = await api.getShipments(); 
        const result = await response.json();
        const shipments = result.data || result || [];
        
        const active = shipments.filter(s => s.status !== "DELIVERED" && s.status !== "COMPLETED");
        
        if (active.length === 0) {
            select.innerHTML = '<option value="">No active shipments to monitor.</option>';
            return;
        }

        select.innerHTML = '<option value="" disabled selected>-- Select Active Shipment --</option>';
        activeShipmentsMap = {};

        active.forEach(s => {
            activeShipmentsMap[s.shipment_id] = s;
            select.innerHTML += `<option value="${s.shipment_id}">Shipment: ${s.shipment_id} (${s.source || s.origin || 'Src'} ➔ ${s.destination || 'Dest'})</option>`;
        });
        
    } catch (error) {
        select.innerHTML = '<option value="">Failed to load shipments API.</option>';
        addLog("ERROR: Could not fetch active shipments.", "error");
    }
}

// 5. Setup Map & Route for Selected Shipment
function initializeMonitoring() {
    const shipmentId = document.getElementById('active_shipment').value;
    if (!shipmentId) {
        if (typeof showToast === 'function') showToast("Please select a shipment first.", "warning");
        return;
    }
    
    currentShipment = activeShipmentsMap[shipmentId];
    
    const srcLat = parseFloat(currentShipment?.source_latitude || 26.5405);
    const srcLng = parseFloat(currentShipment?.source_longitude || 88.7194);
    const dstLat = parseFloat(currentShipment?.destination_latitude || 22.8800);
    const dstLng = parseFloat(currentShipment?.destination_longitude || 88.0100);

    dynamicRoute = generateRoutePoints(srcLat, srcLng, dstLat, dstLng, 12);
    routeIndex = 0;

    currentLat = dynamicRoute[0][0];
    currentLng = dynamicRoute[0][1];

    addLog(`> CONNECTED TO IoT TELEMETRY FOR: ${shipmentId}`, "info");
    addLog(`> ROUTE: ${currentShipment?.source || currentShipment?.origin || 'Origin'} ➔ ${currentShipment?.destination || 'Destination'}`, "info");
    
    pathCoords = [[currentLat, currentLng]]; 
    routeLine.setLatLngs(pathCoords);
    routeLine.setStyle({ color: '#10b981' }); 
    
    marker.setLatLng([currentLat, currentLng]);
    
    // Draw the predefined visual route and zoom out to show it!
    drawPlannedRouteVisuals();
}

// 6. IoT Telemetry Post Handler
async function sendTelemetryPulse(lat, lng, isDeviation = false) {
    const shipmentId = document.getElementById('active_shipment').value;
    if (!shipmentId) return;

    const payload = { latitude: lat, longitude: lng };

    try {
        let response = await fetch(`/api/transport/shipments/${shipmentId}/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.status === 404) {
            response = await fetch(`/api/transport/${shipmentId}/location`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }
        
        if (response.ok) {
            const data = await response.json();
            let warningText = data.message && data.message.includes("WARNINGS") 
                ? ` [${data.message.split('WARNINGS:')[1].trim()}]` 
                : "";
            
            addLog(`PACKET SENT >> Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}${warningText}`, isDeviation ? "warn" : "normal");

            if (data.message && data.message.includes("DELIVERED")) {
                stopSimulation();
                addLog(`> DESTINATION REACHED: Shipment ${shipmentId} automatically marked DELIVERED!`, "info");
                if (typeof showToast === 'function') showToast("Shipment delivered successfully!", "success");
            }

        } else {
            const err = await response.json();
            const errMsg = err.detail ? JSON.stringify(err.detail) : "Unknown Error";
            addLog(`FASTAPI REJECTED PACKET: ${errMsg}`, "error");
        }
    } catch (error) {
        console.error("Telemetry Error:", error);
        addLog(`CONNECTION FAILED: Backend Unreachable.`, "error");
    }
}

// 7. Simulation Control Loop
function startSimulation() {
    const shipmentId = document.getElementById('active_shipment').value;
    if (!shipmentId) {
        if (typeof showToast === 'function') showToast("Select a shipment first!", "warning");
        return;
    }
    
    if (pathCoords.length === 0 || dynamicRoute.length === 0) {
        initializeMonitoring();
    }
    
    if (simulationInterval) clearInterval(simulationInterval);
    
    addLog(`> INITIATING LIVE GPS STREAM...`, "info");
    
    simulationInterval = setInterval(() => {
        if (routeIndex < dynamicRoute.length - 1) {
            routeIndex++;
            currentLat = dynamicRoute[routeIndex][0];
            currentLng = dynamicRoute[routeIndex][1];

            pathCoords.push([currentLat, currentLng]);
            routeLine.setLatLngs(pathCoords);
            marker.setLatLng([currentLat, currentLng]);
            map.panTo([currentLat, currentLng]);

            sendTelemetryPulse(currentLat, currentLng);
        } else {
            stopSimulation();
            addLog(`> ARRIVED AT DESTINATION. GPS stream ended.`, "info");
        }
    }, 3500); 
}

function stopSimulation() {
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
        addLog(`> GPS STREAM PAUSED.`, "info");
    }
}

// 8. Manual Route Deviation Override
function triggerDeviation() {
    const shipmentId = document.getElementById('active_shipment').value;
    if (!shipmentId) return;
    
    stopSimulation(); 
    addLog(`> MANUAL OVERRIDE: TRIGGERING DEVIATION...`, "warn");
    
    currentLat += 0.35; 
    currentLng += 0.35;
    
    pathCoords.push([currentLat, currentLng]);
    routeLine.setLatLngs(pathCoords);
    routeLine.setStyle({ color: '#ef4444' }); 
    
    marker.setLatLng([currentLat, currentLng]);
    map.panTo([currentLat, currentLng]);
    
    sendTelemetryPulse(currentLat, currentLng, true);
    
    if (typeof showToast === 'function') showToast("Route Deviation Triggered!", "danger");

    fireSimulatedAlert("ROUTE_DEVIATION", "🚨 OFF ROUTE!");

    // RECALCULATE ROUTE & UPDATE PREDEFINED VISUALS
    if (currentShipment) {
        const dstLat = parseFloat(currentShipment?.destination_latitude || 22.8800);
        const dstLng = parseFloat(currentShipment?.destination_longitude || 88.0100);
        
        dynamicRoute = generateRoutePoints(currentLat, currentLng, dstLat, dstLng, 12);
        routeIndex = 0; 
        
        addLog(`> GPS SYSTEM REROUTING: Calculated new path to destination...`, "info");
        
        // Redraw the dashed line and arrows from the new compromised location!
        drawPlannedRouteVisuals();
    }
}

// 9. Unusual Stop Override
function triggerUnusualStop() {
    const shipmentId = document.getElementById('active_shipment').value;
    if (!shipmentId) return;

    stopSimulation();
    
    addLog(`> MANUAL OVERRIDE: TRUCK STATIONARY FOR > 45 MINS...`, "warn");
    addLog(`🚨 CRITICAL: UNUSUAL STOPPAGE DETECTED! Possible timber tampering.`, "error");

    L.circle([currentLat, currentLng], { color: '#f59e0b', fillColor: '#fcd34d', fillOpacity: 0.5, radius: 15000 }).addTo(map);

    if (typeof showToast === 'function') showToast("Unusual Stoppage Triggered!", "warning");
    fireSimulatedAlert("SUSPICIOUS_STOP", "⏳ UNUSUAL STOP!");
}

// 10. Bridge Function for the Cartoon UI (`journey.js`)
async function fireSimulatedAlert(alertType, uiText) {
    const shipmentId = document.getElementById('active_shipment').value;
    
    try {
        await fetch('/api/driver-safety/alert', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                driver_id: "DRV-SIM",
                vehicle_id: "TRK-SIM",
                shipment_id: shipmentId,
                severity: "CRITICAL",
                confidence: 0.99,
                coordinates: {lat: currentLat, lng: currentLng}
            })
        });
        addLog(`> Alert broadcasted to Blockchain Ledger.`, "info");
    } catch(e) {
        console.error("Alert network error", e);
    }

    if (typeof processJourneyState === "function") {
        const severityObj = { type: alertType, severity: "CRITICAL", related_id: shipmentId };
        let progress = 10;
        if (dynamicRoute.length > 0) progress = 10 + (85 * (routeIndex / dynamicRoute.length));
        processJourneyState(progress, "IN_TRANSIT", [severityObj]);
    }
}

// Run on load
document.addEventListener("DOMContentLoaded", () => {
    initMap();
    loadActiveShipments();
});