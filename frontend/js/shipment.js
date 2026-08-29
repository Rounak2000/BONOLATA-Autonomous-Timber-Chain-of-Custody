/* =========================================================
   TIMBERTRUST - SHIPMENT MANAGEMENT LOGIC
   ========================================================= */

/* =========================================================
   1. FOOLPROOF GEOCODING (LOCAL DICTIONARY + API FALLBACK)
   ========================================================= */

const LOCAL_CITY_COORDS = {
    "kolkata": { lat: 22.5726, lng: 88.3639 },
    "siliguri": { lat: 26.7271, lng: 88.4173 },
    "jalpaiguri": { lat: 26.5405, lng: 88.7194 },
    "tarkeshwar": { lat: 22.8800, lng: 88.0100 },
    "tarakeswar": { lat: 22.8800, lng: 88.0100 },
    "durgapur": { lat: 23.5204, lng: 87.3119 },
    "asansol": { lat: 23.6889, lng: 86.9661 },
    "howrah": { lat: 22.5958, lng: 88.2636 },
    "darjeeling": { lat: 27.0410, lng: 88.2663 },
    "kharagpur": { lat: 22.3460, lng: 87.2320 },
    "malda": { lat: 25.0108, lng: 88.1411 }
};

async function geocodeLocation(locationName) {
    if (!locationName || locationName.trim() === "") return null;

    const cleanQuery = locationName.trim().toLowerCase();

    for (const [city, coords] of Object.entries(LOCAL_CITY_COORDS)) {
        if (cleanQuery.includes(city)) return coords;
    }

    const simplifiedName = locationName
        .replace(/(Forest|Depot|Hub|Yard|Warehouse|Gate|Station|Plant|Mill|Center|Centre|\d+)/gi, '')
        .trim();

    try {
        const queryStr = simplifiedName || locationName;
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryStr)}&limit=1`
        );
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
            }
        }
    } catch (err) {
        console.warn("External geocoding network error:", err);
    }
    return null;
}

/* =========================================================
   2. DATETIME HELPER
   ========================================================= */

function getIsoFormattedString(offsetHours = 0) {
    const d = new Date();
    d.setHours(d.getHours() + offsetHours);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/* =========================================================
   3. LOAD SHIPMENTS
   ========================================================= */

async function loadShipments() {
    const tbody = document.getElementById("shipments-table-body");
    if (!tbody) return;

    try {
        const response = await api.getShipments();
        if (!response.ok) throw new Error(`Shipment API returned ${response.status}`);

        const result = await response.json();
        const shipments = result.data || result || [];
        tbody.innerHTML = "";

        if (!Array.isArray(shipments) || shipments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; color:var(--text-muted); padding:40px;">
                        <i data-lucide="truck" style="width:48px; height:48px; margin-bottom:10px; opacity:0.5;"></i>
                        <br>No active shipments. Click "Start New Shipment" to dispatch.
                    </td>
                </tr>
            `;
            if (typeof lucide !== "undefined") lucide.createIcons();
            return;
        }

        shipments.slice().reverse().forEach(shipment => {
            const status = shipment.status || "IN_TRANSIT";
            let badgeClass = "neutral";
            if (status === "IN_TRANSIT") badgeClass = "info";
            else if (status === "DELIVERED") badgeClass = "success";
            else if (status === "CANCELLED" || status === "ALERT") badgeClass = "danger";

            tbody.innerHTML += `
                <tr>
                    <td class="mono" style="color:var(--primary); font-weight:600;">${shipment.shipment_id || "N/A"}</td>
                    <td class="mono">${shipment.timber_id || "N/A"}</td>
                    <td class="mono">${shipment.vehicle_id || "N/A"}</td>
                    <td>${shipment.destination || "N/A"}</td>
                    <td><span class="badge ${badgeClass}">${String(status).replace(/_/g, " ")}</span></td>
                </tr>
            `;
        });

        if (typeof lucide !== "undefined") lucide.createIcons();
    } catch (error) {
        console.error("Load Shipments Error:", error);
        tbody.innerHTML = `<tr><td colspan="5" style="color:var(--danger); text-align:center; padding:20px;">Failed to load shipments.</td></tr>`;
    }
}

/* =========================================================
   4. OPEN SHIPMENT MODAL (UPDATED WITH VEHICLE & TIMBER CHECKS)
   ========================================================= */

async function openShipmentModal() {
    const modal = document.getElementById("shipment-modal");
    const timberSelect = document.getElementById("timber_id");
    const vehicleSelect = document.getElementById("vehicle_id");

    if (!modal || !timberSelect || !vehicleSelect) return;
    modal.classList.add("active");

    const startInput = document.getElementById("expected_start");
    const arrivalInput = document.getElementById("expected_arrival");
    if (startInput) startInput.value = getIsoFormattedString(0);
    if (arrivalInput) arrivalInput.value = getIsoFormattedString(24);

    timberSelect.innerHTML = `<option value="" disabled selected>Loading verified timber...</option>`;
    vehicleSelect.innerHTML = `<option value="" disabled selected>Loading vehicles...</option>`;

    try {
        // --- 1. FIND ALREADY DISPATCHED TIMBER & BUSY VEHICLES ---
        let usedTimbers = [];
        let busyVehicles = [];
        try {
            const shipRes = await api.getShipments();
            if (shipRes.ok) {
                const shipResult = await shipRes.json();
                const shipmentsData = shipResult.data || shipResult || [];
                if (Array.isArray(shipmentsData)) {
                    // Timber is used if it's in ANY shipment (you can't dispatch the same log twice)
                    usedTimbers = shipmentsData.map(s => String(s.timber_id).trim());
                    
                    // Vehicle is busy ONLY if its current shipment is active/in-transit
                    busyVehicles = shipmentsData
                        .filter(s => s.status !== "DELIVERED" && s.status !== "COMPLETED" && s.status !== "CANCELLED")
                        .map(s => String(s.vehicle_id).trim());
                }
            }
        } catch (e) {
            console.warn("Could not fetch existing shipments for duplicate checking.", e);
        }

        // --- 2. LOAD VERIFIED TIMBER (FILTER OUT USED) ---
        const timberResponse = await api.getTimber();
        if (!timberResponse.ok) throw new Error(`Timber API returned ${timberResponse.status}`);
        const timberResult = await timberResponse.json();
        const timberData = timberResult.data || timberResult || [];

        timberSelect.innerHTML = `<option value="" disabled selected>-- Select Available Timber --</option>`;
        let validTimber = false;

        if (Array.isArray(timberData)) {
            timberData.forEach(timber => {
                const status = timber.verification_status || timber.status;
                const timberIdStr = String(timber.timber_id).trim();

                if (String(status).toUpperCase() === "VERIFIED" && !usedTimbers.includes(timberIdStr)) {
                    timberSelect.innerHTML += `<option value="${timber.timber_id}">${timber.timber_id} (${timber.species || "Teak"})</option>`;
                    validTimber = true;
                }
            });
        }
        if (!validTimber) timberSelect.innerHTML = `<option value="" disabled selected>⚠️ No available verified timber (All Dispatched!)</option>`;

        // --- 3. LOAD VEHICLES (FILTER OUT BUSY ONES) ---
        const vehicleResponse = await api.getVehicles();
        if (!vehicleResponse.ok) throw new Error(`Vehicle API returned ${vehicleResponse.status}`);
        const vehicleResult = await vehicleResponse.json();
        const vehicleData = vehicleResult.data || vehicleResult || [];

        vehicleSelect.innerHTML = `<option value="" disabled selected>-- Select Available Vehicle --</option>`;
        let availableVehicles = false;

        if (Array.isArray(vehicleData)) {
            vehicleData.forEach(vehicle => {
                const driver = vehicle.driver_id ?? vehicle.assigned_driver_id ?? vehicle.driver ?? vehicle.assigned_driver ?? null;
                const vehicleIdStr = String(vehicle.vehicle_id).trim();

                const hasDriver = driver !== null && String(driver).trim() !== "" && String(driver).toLowerCase() !== "null";
                const isNotBusy = !busyVehicles.includes(vehicleIdStr);

                if (hasDriver && isNotBusy) {
                    vehicleSelect.innerHTML += `<option value="${vehicle.vehicle_id}" data-driver-id="${driver}">${vehicle.vehicle_id} (Driver: ${driver})</option>`;
                    availableVehicles = true;
                }
            });
        }
        
        if (!availableVehicles) {
            vehicleSelect.innerHTML = `<option value="" disabled selected>⚠️ No idle vehicles available!</option>`;
            showToast("All vehicles with drivers are currently in transit.", "warning");
        }

    } catch (error) {
        console.error("Shipment dropdown error:", error);
        timberSelect.innerHTML = `<option value="" disabled selected>Failed to load timber</option>`;
        vehicleSelect.innerHTML = `<option value="" disabled selected>Failed to load vehicles</option>`;
        showToast("Could not load shipment data.", "danger");
    }
}

/* =========================================================
   5. CLOSE MODAL & OTHERS
   ========================================================= */

function closeShipmentModal() {
    const modal = document.getElementById("shipment-modal");
    const form = document.getElementById("shipment-form");
    if (modal) modal.classList.remove("active");
    if (form) form.reset();
}

function getSelectedDriverId() {
    const vehicleSelect = document.getElementById("vehicle_id");
    if (!vehicleSelect) return null;
    const selectedOption = vehicleSelect.options[vehicleSelect.selectedIndex];
    if (!selectedOption) return null;
    const driverId = selectedOption.getAttribute("data-driver-id");
    if (!driverId || String(driverId).trim() === "" || String(driverId).toLowerCase() === "null") return null;
    return driverId;
}

/* =========================================================
   7. CREATE SHIPMENT
   ========================================================= */

async function handleShipmentSubmit(event) {
    event.preventDefault();
    const submitButton = document.querySelector('#shipment-form button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.innerHTML : "";

    const timberId = document.getElementById("timber_id")?.value;
    const vehicleId = document.getElementById("vehicle_id")?.value;
    const sourceName = (document.getElementById("source_location")?.value || document.getElementById("source")?.value || "").trim();
    const destinationName = (document.getElementById("destination_location")?.value || document.getElementById("destination")?.value || "").trim();
    const expectedStart = document.getElementById("expected_start")?.value;
    const expectedArrival = document.getElementById("expected_arrival")?.value;

    if (!timberId || !vehicleId || !sourceName || !destinationName) {
        showToast("Please fill all required fields.", "warning");
        return;
    }

    const driverId = getSelectedDriverId();
    if (!driverId) {
        showToast("Shipment blocked: selected vehicle has no assigned driver.", "danger");
        return;
    }

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = `<i data-lucide="loader" class="spin"></i> Dispatching...`;
    }

    try {
        const [sourceCoords, destinationCoords] = await Promise.all([geocodeLocation(sourceName), geocodeLocation(destinationName)]);
        const finalSourceLat = sourceCoords ? sourceCoords.lat : 26.5405;
        const finalSourceLng = sourceCoords ? sourceCoords.lng : 88.7194;
        const finalDestLat = destinationCoords ? destinationCoords.lat : 22.8800;
        const finalDestLng = destinationCoords ? destinationCoords.lng : 88.0100;

        const payload = {
            timber_id: timberId,
            vehicle_id: vehicleId,
            driver_id: driverId,
            source: sourceName,
            source_latitude: finalSourceLat,
            source_longitude: finalSourceLng,
            destination: destinationName,
            destination_latitude: finalDestLat,
            destination_longitude: finalDestLng,
            expected_start: expectedStart,
            expected_arrival: expectedArrival,
            expected_checkpoints: []
        };

        const response = await fetch("/api/transport/shipments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showToast(`Shipment dispatched successfully!`, "success");
            closeShipmentModal();
            await loadShipments();
        } else {
            const errorData = await response.json();
            showToast(`Dispatch failed: ${errorData.detail || "Server error"}`, "danger");
        }
    } catch (error) {
        console.error("Shipment creation error:", error);
        showToast("Connection failed.", "danger");
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            if (typeof lucide !== "undefined") lucide.createIcons();
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const shipmentForm = document.getElementById("shipment-form");
    if (shipmentForm) shipmentForm.addEventListener("submit", handleShipmentSubmit);
    loadShipments();
});