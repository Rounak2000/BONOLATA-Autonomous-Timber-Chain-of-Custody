// ==========================================
// TIMBERTRUST - LIVE JOURNEY ANIMATION LOGIC
// ==========================================

const truckEl = document.getElementById('animated-truck');
const alertBubble = document.getElementById('truck-alert-msg');
const progressFill = document.getElementById('ui-progress-bar');
const progressText = document.getElementById('ui-progress-text');

// Define checkpoints for the UI visualization (10% to 90% across the screen)
const routeCheckpoints = [
    { id: 1, name: "🏭 Source", position: 10 },        // Name will update dynamically
    { id: 2, name: "📍 Checkpoint Alpha", position: 35 },
    { id: 3, name: "📍 Transit Hub", position: 60 },
    { id: 4, name: "🏁 Destination", position: 95 }    // Name will update dynamically
];

let targetShipmentId = null; 

document.addEventListener("DOMContentLoaded", () => {
    renderCheckpoints();
    fetchLiveJourneyData();
    setInterval(fetchLiveJourneyData, 3000); // Poll backend every 3 seconds
});

function renderCheckpoints() {
    const container = document.getElementById('checkpoints-container');
    container.innerHTML = ""; // Clear just in case
    routeCheckpoints.forEach(cp => {
        const div = document.createElement('div');
        div.className = 'checkpoint';
        div.id = `cp-${cp.id}`;
        div.style.left = `${cp.position}%`;
        div.innerHTML = `
            <div class="checkpoint-label" id="label-cp-${cp.id}">${cp.name}</div>
            <div class="checkpoint-marker"></div>
        `;
        container.appendChild(div);
    });
}

// Connect to existing TimberTrust APIs
async function fetchLiveJourneyData() {
    try {
        // 1. Fetch all shipments
        const shipRes = await fetch('/api/shipments');
        let shipData = await shipRes.json();
        const shipList = shipData.data || shipData;
        
        if (!shipList || shipList.length === 0) return;

        // 2. See if the user selected a specific shipment in the GPS Simulator dropdown
        const dropdown = document.getElementById('active_shipment');
        const selectedId = dropdown ? dropdown.value : null;

        let activeShipment;
        if (selectedId) {
            activeShipment = shipList.find(s => s.shipment_id === selectedId);
        } else {
            activeShipment = shipList.find(s => s.status !== "COMPLETED" && s.status !== "DELIVERED") || shipList[0];
        }

        if (!activeShipment) return;

        targetShipmentId = activeShipment.shipment_id;
        
        // 3. DYNAMICALLY UPDATE THE SOURCE AND DESTINATION PORT
        const sourceLabel = document.getElementById('label-cp-1');
        if (sourceLabel) {
            // Checks for 'origin' or 'source' based on your JSON structure
            const sourceName = activeShipment.origin || activeShipment.source || 'Source Facility';
            sourceLabel.innerText = `🏭 ${sourceName}`;
        }

        const destLabel = document.getElementById('label-cp-4');
        if (destLabel) {
            destLabel.innerText = `🏁 ${activeShipment.destination || 'Final Destination'}`;
        }

        // 4. MAP EXACT PROGRESS
        let progress = 10; // CREATED or PENDING (At source)
        const status = activeShipment.status ? activeShipment.status.toUpperCase() : "";
        
        if (status === "IN_TRANSIT") progress = 50; 
        if (status === "ARRIVED") progress = 85; 
        if (status === "DELIVERED" || status === "COMPLETED") progress = 100; // Drive off screen / to the very end

        // Update UI Text
        document.getElementById('ui-shipment-id').innerText = `${activeShipment.shipment_id}`;
        document.getElementById('ui-transport-status').innerText = status.replace('_', ' ');

        // 5. Fetch Alerts for this specific shipment
        const alertRes = await fetch('/api/alerts');
        const alertData = await alertRes.json();
        const activeAlerts = (alertData.data || alertData).filter(a => a.status === "OPEN" && a.related_id === targetShipmentId);

        processJourneyState(progress, status, activeAlerts);

    } catch (error) {
        console.error("Journey Sync Error:", error);
    }
}

function processJourneyState(progress, status, activeAlerts) {
    let hasCriticalIssue = false;
    let alertText = "";

    // Check for specific alerts
    const fatigueAlert = activeAlerts.find(a => a.type === "DRIVER_FATIGUE");
    const deviationAlert = activeAlerts.find(a => a.type === "ROUTE_DEVIATION");
    const theftAlert = activeAlerts.find(a => a.type === "SUSPICIOUS_STOP");

    if (fatigueAlert) {
        hasCriticalIssue = true;
        alertText = fatigueAlert.severity === "CRITICAL" ? "🚨 ASLEEP!" : "⚠️ DROWSY";
        document.getElementById('ui-safety-status').innerHTML = `<span style="color:red; font-weight:bold;">🚨 ${alertText}</span>`;
    } else {
        document.getElementById('ui-safety-status').innerHTML = `<span style="color:#10b981">🟢 Driver Attentive</span>`;
    }

    if (deviationAlert) {
        hasCriticalIssue = true;
        alertText = "🚨 OFF ROUTE!";
    } else if (theftAlert) {
        hasCriticalIssue = true;
        alertText = "⏳ UNUSUAL STOP!";
    }

    moveTruck(progress, hasCriticalIssue, alertText, status);
}

function moveTruck(progressPercent, hasCriticalIssue, alertText, status) {
    // Prevent truck from going past 100% visually
    const visualProgress = Math.min(progressPercent, 100);
    
    // Update Progress Bar
    progressFill.style.width = `${visualProgress}%`;
    progressText.innerText = `${visualProgress}%`;

    // Move Truck CSS
    truckEl.style.left = `${visualProgress}%`;

    // Highlight Passed Checkpoints
    routeCheckpoints.forEach(cp => {
        const el = document.getElementById(`cp-${cp.id}`);
        if (el) {
            if (visualProgress >= cp.position) el.classList.add('passed');
            else el.classList.remove('passed');
        }
    });

    // Handle Animations based on State
    if (hasCriticalIssue) {
        truckEl.classList.add('stopped', 'has-alert');
        alertBubble.innerText = alertText;
    } else if (progressPercent >= 95 || status === "DELIVERED" || status === "COMPLETED") { 
        truckEl.classList.add('stopped');
        truckEl.classList.remove('has-alert');
    } else { 
        truckEl.classList.remove('stopped', 'has-alert');
    }
}