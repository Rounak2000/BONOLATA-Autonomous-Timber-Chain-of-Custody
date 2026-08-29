/* =========================================================
   TIMBERTRUST - DRIVER MANAGEMENT LOGIC
   ========================================================= */

// 1. Load the Drivers Table
async function loadDrivers() {
    const tbody = document.getElementById('drivers-table-body');
    
    try {
        const response = await api.getDrivers();
        const result = await response.json();
        const driverList = result.data || result || [];
        
        tbody.innerHTML = ""; 
        
        if (driverList.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px;">
                        <i data-lucide="users" style="width: 48px; height: 48px; margin-bottom: 10px; opacity: 0.5;"></i><br>
                        No drivers registered yet.
                    </td>
                </tr>`;
            lucide.createIcons();
            return;
        }

        driverList.reverse().forEach(d => {
            // Default status badge
            let statusBadge = `<span class="badge success">ACTIVE</span>`;
            
            // If your backend tracks driver status, you could update this dynamically:
            if (d.status === "INACTIVE") {
                statusBadge = `<span class="badge neutral">INACTIVE</span>`;
            }

            tbody.innerHTML += `
                <tr>
                    <td class="mono" style="color: var(--primary); font-weight: 600;">${d.driver_id || 'N/A'}</td>
                    <td style="font-weight: 500;">${d.name || d.driver_name || 'N/A'}</td>
                    <td class="mono">${d.license_number || 'N/A'}</td>
                    <td>${d.phone || d.contact_number || 'N/A'}</td>
                    <td>${statusBadge}</td>
                </tr>
            `;
        });
        
        lucide.createIcons();
        
    } catch (error) {
        console.error("Load Drivers Error:", error);
        tbody.innerHTML = `<tr><td colspan="5" style="color:var(--danger); text-align:center; padding: 20px;">Failed to load data from API.</td></tr>`;
        showToast("Error loading drivers.", "danger");
    }
}

// 2. Modal Controls
function openDriverModal() {
    document.getElementById('driver-modal').classList.add('active');
}

function closeDriverModal() {
    document.getElementById('driver-modal').classList.remove('active');
    document.getElementById('driver-form').reset();
}

// 3. Handle Form Submission
document.getElementById('driver-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Build payload. (Adjust field names if your FastAPI model expects different keys like 'contact_number')
    const payload = {
        name: document.getElementById('name').value,
        license_number: document.getElementById('license_number').value,
        phone: document.getElementById('phone').value
    };
    
    // If the user typed an ID, send it. Otherwise, assume backend auto-generates it.
    const driverIdInput = document.getElementById('driver_id').value;
    if (driverIdInput.trim() !== "") {
        payload.driver_id = driverIdInput.trim();
    }

    try {
        const response = await api.createDriver(payload);
        
        if (response.ok) {
            showToast("Driver registered successfully!", "success");
            closeDriverModal();
            loadDrivers(); 
        } else {
            const err = await response.json();
            // Fallback error parsing
            let errorMsg = "Failed to register driver.";
            if (err.detail && Array.isArray(err.detail)) {
                errorMsg = err.detail.map(e => e.msg).join(", ");
            } else if (err.detail) {
                errorMsg = err.detail;
            }
            showToast(`Error: ${errorMsg}`, "danger");
        }
    } catch (error) {
        showToast("Connection failed.", "danger");
    }
});

// Run on load
document.addEventListener("DOMContentLoaded", loadDrivers);