/* =========================================================
   TIMBERTRUST - TIMBER INVENTORY LOGIC
   ========================================================= */

// 1. Load the Timber Table
async function loadTimber() {
    const tbody = document.getElementById('timber-table-body');
    
    try {
        const response = await api.getTimber();
        const result = await response.json();
        const timberList = result.data || result || [];
        
        tbody.innerHTML = ""; // Clear loading state
        
        // Empty State
        if (timberList.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px;">
                        <i data-lucide="box" style="width: 48px; height: 48px; margin-bottom: 10px; opacity: 0.5;"></i><br>
                        No timber registered yet. Click "Register New Timber" to begin.
                    </td>
                </tr>`;
            lucide.createIcons();
            return;
        }

        // Populate Table (reversed so newest is on top)
        timberList.reverse().forEach(t => {
            
            // Format Status Badge
            let statusBadge = "";
            if (t.verification_status === "VERIFIED") {
                statusBadge = `<span class="badge success"><i data-lucide="shield-check" style="width:12px; height:12px;"></i> VERIFIED</span>`;
            } else {
                statusBadge = `<span class="badge warning">PENDING</span>`;
            }
            
            // Format Action Button
            let actionBtn = "";
            if (t.verification_status === "PENDING") {
                actionBtn = `<button class="btn" style="padding: 6px 12px; font-size: 0.8rem; background: var(--success);" onclick="verifyTimber('${t.timber_id}')">Verify</button>`;
            } else {
                actionBtn = `<span style="color:var(--text-muted); font-size: 0.85rem;"><i data-lucide="lock" style="width:14px; display:inline-block; vertical-align:middle;"></i> Locked</span>`;
            }

            // Create Row
            tbody.innerHTML += `
                <tr>
                    <td class="mono" style="color: var(--primary); font-weight: 600;">${t.timber_id}</td>
                    <td style="font-weight: 500;">${t.species}</td>
                    <td>${t.quantity} ${t.unit}</td>
                    <td>${t.origin_location}</td>
                    <td>${statusBadge}</td>
                    <td style="text-align: right;">${actionBtn}</td>
                </tr>
            `;
        });
        
        // Re-render icons for new rows
        lucide.createIcons();
        
    } catch (error) {
        console.error("Load Timber Error:", error);
        tbody.innerHTML = `<tr><td colspan="6" style="color:var(--danger); text-align:center; padding: 20px;">Failed to load data from API.</td></tr>`;
        showToast("Error loading timber inventory.", "danger");
    }
}

// 2. Handle Verification (Connects to Blockchain)
async function verifyTimber(id) {
    if(!confirm(`Authorize verification for ${id}? This will lock the record into the blockchain.`)) {
        return;
    }
    
    try {
        const payload = { 
            timber_id: id, 
            verified_by: "Forestry Admin",
            verifier_name: "Forestry Admin",   // NEW: Added missing field
            status: "VERIFIED",                // NEW: Added missing field
            verification_notes: "UI Verified" 
        };
        
        const response = await api.verifyTimber(payload);
        
        if (response.ok) {
            showToast(`Timber ${id} verified and secured on blockchain!`, "success");
            loadTimber(); // Refresh table
        } else {
            const err = await response.json();
            showToast(`Verification failed: ${JSON.stringify(err)}`, "danger");
        }
    } catch (error) {
        showToast("Network error during verification.", "danger");
    }
}

// 3. Modal Controls
function openTimberModal() {
    document.getElementById('timber-modal').classList.add('active');
}

function closeTimberModal() {
    document.getElementById('timber-modal').classList.remove('active');
    document.getElementById('timber-form').reset();
}

// 4. Handle Form Submission
document.getElementById('timber-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Build payload exactly as FastAPI expects
    // Build payload exactly as FastAPI expects
    const payload = {
        species: document.getElementById('species').value,
        quantity: parseFloat(document.getElementById('quantity').value),
        unit: document.getElementById('unit').value,
        origin_location: document.getElementById('origin_location').value,
        current_owner: document.getElementById('current_owner').value,
        harvest_date: document.getElementById('harvest_date').value,           // Added this
        certificate_number: document.getElementById('certificate_number').value, // Added this
        source_type: "FOREST", 
        source_name: "Local Zone"
    };

    try {
        const response = await api.createTimber(payload);
        
        if (response.ok) {
            showToast("Timber registered successfully!", "success");
            closeTimberModal();
            loadTimber(); // Refresh table
        } else {
            const err = await response.json();
            // Try to extract useful error message for UI
            let msg = err.detail ? JSON.stringify(err.detail) : "Server rejected request";
            showToast(`Error: ${msg}`, "danger");
        }
    } catch (error) {
        showToast("Connection failed.", "danger");
    }
});

// Run on load
document.addEventListener("DOMContentLoaded", loadTimber);