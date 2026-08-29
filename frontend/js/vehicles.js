/* =========================================================
   TIMBERTRUST - VEHICLE MANAGEMENT LOGIC
   ========================================================= */

// 1. Load the Vehicles Table
async function loadVehicles() {
    const tbody = document.getElementById('vehicles-table-body');
    
    try {
        const response = await api.getVehicles();
        const result = await response.json();
        const vehicleList = result.data || result || [];
        
        tbody.innerHTML = "";
        
        if (vehicleList.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px;">
                        <i data-lucide="tractor" style="width: 48px; height: 48px; margin-bottom: 10px; opacity: 0.5;"></i><br>
                        No vehicles registered yet.
                    </td>
                </tr>`;
            lucide.createIcons();
            return;
        }

        vehicleList.reverse().forEach(v => {
            // Status Badge
            let statusBadge = `<span class="badge info">${v.status || 'AVAILABLE'}</span>`;
            if (v.status === "IN_TRANSIT") statusBadge = `<span class="badge warning">IN TRANSIT</span>`;
            
            // Driver Badge
            let driverBadge = v.driver_id 
                ? `<span class="badge success" style="background: #ecfccb; color: #4d7c0f; border-color: #bef264;"><i data-lucide="user" style="width:12px; height:12px;"></i> ${v.driver_id}</span>`
                : `<span class="badge warning" style="opacity: 0.8;">UNASSIGNED</span>`;

            tbody.innerHTML += `
                <tr>
                    <td class="mono" style="color: var(--primary); font-weight: 600;">${v.vehicle_id}</td>
                    <td style="font-weight: 500;">${v.vehicle_type}</td>
                    <td class="mono">${v.registration_number}</td>
                    <td>${statusBadge}</td>
                    <td>${driverBadge}</td>
                </tr>
            `;
        });
        
        lucide.createIcons();
        
    } catch (error) {
        console.error("Load Vehicles Error:", error);
        tbody.innerHTML = `<tr><td colspan="5" style="color:var(--danger); text-align:center; padding: 20px;">Failed to load fleet data.</td></tr>`;
        showToast("Error loading vehicles.", "danger");
    }
}

// 2. Load Drivers for the Dropdown (When Modal Opens)
async function loadDriverDropdown() {
    const select = document.getElementById('driver_id');
    select.innerHTML = '<option value="">Loading...</option>';
    
    try {
        const response = await api.getDrivers();
        const result = await response.json();
        const driverList = result.data || result || [];
        
        select.innerHTML = '<option value="">-- Do not assign a driver yet --</option>';
        
        driverList.forEach(d => {
            // Use driver_id as the value to send to FastAPI
            let dId = d.driver_id || d.id; 
            let dName = d.name || d.driver_name || 'Unknown Driver';
            select.innerHTML += `<option value="${dId}">${dId} - ${dName}</option>`;
        });
        
    } catch (error) {
        console.error("Driver Dropdown Error:", error);
        select.innerHTML = '<option value="">Failed to load drivers</option>';
    }
}

// 3. Modal Controls
function openVehicleModal() {
    document.getElementById('vehicle-modal').classList.add('active');
    
    // Generate a random Vehicle ID like VEH-8492
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('vehicle_id').value = "VEH-" + randomNum;
    
    loadDriverDropdown(); // Fetch fresh drivers every time modal opens
}

function closeVehicleModal() {
    document.getElementById('vehicle-modal').classList.remove('active');
    document.getElementById('vehicle-form').reset();
}

// 4. Handle Form Submission
document.getElementById('vehicle-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const driverVal = document.getElementById('driver_id').value;
    
    const payload = {
        vehicle_id: document.getElementById('vehicle_id').value,
        vehicle_type: document.getElementById('vehicle_type').value,
        registration_number: document.getElementById('registration_number').value,
        // Only include driver_id if they selected one
        driver_id: driverVal ? driverVal : null
    };

    try {
        const response = await api.createVehicle(payload);
        
        if (response.ok) {
            showToast("Vehicle registered successfully!", "success");
            closeVehicleModal();
            loadVehicles(); // Refresh table
        } else {
            const err = await response.json();
            let msg = err.detail ? JSON.stringify(err.detail) : "Server rejected request";
            showToast(`Error: ${msg}`, "danger");
        }
    } catch (error) {
        showToast("Connection failed.", "danger");
    }
});

// Run on load
document.addEventListener("DOMContentLoaded", loadVehicles);