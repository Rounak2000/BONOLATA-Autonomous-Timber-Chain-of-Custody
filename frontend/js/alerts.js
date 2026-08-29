/* =========================================================
   TIMBERTRUST - ALERT MANAGEMENT LOGIC
   ========================================================= */

async function loadAlerts() {
    const tbody = document.getElementById('alerts-table-body');
    
    // Add a quick visual refresh state
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding: 20px;"><i data-lucide="loader" class="spin"></i> Refreshing...</td></tr>`;
    
    // Safe check if lucide exists before calling
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    try {
        // Direct fetch to our newly created backend route
        const response = await fetch('/api/alerts');
        const result = await response.json();
        const alerts = result.data || result || [];
        
        tbody.innerHTML = "";
        
        if (alerts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px;">
                        <i data-lucide="shield-check" style="width: 48px; height: 48px; margin-bottom: 10px; color: var(--success); opacity: 0.8;"></i><br>
                        System Secure. No active alerts found.
                    </td>
                </tr>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        alerts.reverse().forEach(alert => {
            // Severity Formatting
            let badgeClass = "neutral";
            let severityText = alert.severity ? alert.severity.toUpperCase() : "INFO";
            
            if (severityText === "LOW") badgeClass = "info";
            else if (severityText === "MEDIUM") badgeClass = "warning";
            else if (severityText === "HIGH" || severityText === "CRITICAL") badgeClass = "danger";

            // Formatting Date 
            let timeStr = "Unknown Time";
            if (alert.timestamp) {
                const d = new Date(alert.timestamp);
                timeStr = d.toLocaleString(); 
            }

            // FIX: Map 'type' and 'related_id' exactly as they appear in alert_service.py
            let alertType = alert.type || alert.alert_type || "SYSTEM EVENT";
            let reference = alert.related_id || alert.shipment_id || alert.vehicle_id || "N/A";
            let details = alert.message || alert.details || alert.description || "No further details.";

            // NEW: Add a Resolve Action Button
            let actionHTML = "";
            if (alert.status === "OPEN") {
                actionHTML = `<br><button onclick="resolveAlert('${alert.alert_id}')" style="margin-top: 8px; background: var(--success); color: white; padding: 4px 8px; font-size: 0.75rem; border: none; border-radius: 4px; cursor: pointer; transition: 0.2s;">Mark Resolved</button>`;
            } else if (alert.status === "RESOLVED") {
                actionHTML = `<br><div style="margin-top: 8px; font-size: 0.75rem; color: var(--success); font-weight: bold;">✓ RESOLVED</div>`;
                // Dim the row slightly if resolved
                badgeClass += " opacity-50"; 
            }

            tbody.innerHTML += `
                <tr style="${alert.status === 'RESOLVED' ? 'opacity: 0.6;' : ''}">
                    <td style="white-space: nowrap; font-size: 0.85rem; color: var(--text-muted);">${timeStr}</td>
                    <td><span class="badge ${badgeClass}">${severityText}</span></td>
                    <td style="font-weight: 600;">${alertType.replace('_', ' ')}</td>
                    <td class="mono" style="color: var(--primary);">${reference}</td>
                    <td style="font-size: 0.9rem;">${details} ${actionHTML}</td>
                </tr>
            `;
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
    } catch (error) {
        console.error("Load Alerts Error:", error);
        tbody.innerHTML = `<tr><td colspan="5" style="color:var(--danger); text-align:center; padding: 20px;">Failed to fetch security logs.</td></tr>`;
        showToast("Error loading alerts.", "danger");
    }
}

// NEW: Function to hit the backend resolve route
async function resolveAlert(alertId) {
    try {
        const response = await fetch(`/api/alerts/${alertId}/resolve`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            showToast("Alert resolved successfully!", "success");
            loadAlerts(); // Instantly refresh the table
        } else {
            showToast("Failed to resolve alert.", "danger");
        }
    } catch (error) {
        console.error("Resolve Error:", error);
        showToast("Connection failed.", "danger");
    }
}
/* =========================================================
   SYNTHETIC ALERT AUDIO BEEP (NO EXTERNAL MP3 NEEDED)
   ========================================================= */
function playAlertSound() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        
        const ctx = new AudioCtx();
        
        // Osc 1: High warning tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // 880 Hz (A5 pitch)
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35); // Rapid drop tone

        gain.gain.setValueAtTime(0.2, ctx.currentTime); // Volume level
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
        console.warn("Audio Context blocked or not supported:", e);
    }
}
// Run on load
document.addEventListener("DOMContentLoaded", loadAlerts);