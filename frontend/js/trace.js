/* =========================================================
   TIMBERTRUST - TRACEABILITY LOGIC
   ========================================================= */

function handleEnter(e) {
    if (e.key === 'Enter') {
        traceTimber();
    }
}

async function traceTimber() {
    const searchInput = document.getElementById('search-input').value.trim();
    const timeline = document.getElementById('trace-timeline');
    const loader = document.getElementById('loading-indicator');
    
    if (!searchInput) {
        showToast("Please enter a Timber ID to track.", "warning");
        return;
    }

    // Hide old results, show loader
    timeline.style.display = "none";
    loader.style.display = "block";
    timeline.innerHTML = "";

    try {
        // 1. Fetch all timber to find the specific one
        const tRes = await api.getTimber();
        const tData = (await tRes.json()).data || await tRes.json();
        
        let timber = null;
        if (Array.isArray(tData)) {
            timber = tData.find(t => t.timber_id === searchInput);
        }

        if (!timber) {
            loader.style.display = "none";
            showToast(`Asset ${searchInput} not found in the ledger.`, "danger");
            return;
        }

        // 2. Fetch all shipments to see if this timber was transported
        const sRes = await api.getShipments();
        const sData = (await sRes.json()).data || await sRes.json();
        
        let shipment = null;
        if (Array.isArray(sData)) {
            // Find the most recent shipment for this timber
            shipment = sData.find(s => s.timber_id === searchInput);
        }

        // 3. Build the UI Timeline Steps
        
        // STEP 1: Harvest & Registration (Always exists if timber is found)
        timeline.innerHTML += `
            <div class="timeline-step success">
                <div class="timeline-icon"><i data-lucide="leaf" style="width: 18px;"></i></div>
                <div class="timeline-content">
                    <span class="timeline-date">Phase 1 • Origin Registration</span>
                    <h3 class="timeline-title">Harvested & Registered</h3>
                    <div class="timeline-details">
                        <strong>Species:</strong> ${timber.species} <br>
                        <strong>Quantity:</strong> ${timber.quantity} ${timber.unit || 'units'} <br>
                        <strong>Origin Zone:</strong> ${timber.origin_location} <br>
                        <strong>Owner:</strong> ${timber.current_owner || 'Registered Authority'}
                    </div>
                </div>
            </div>
        `;

        // STEP 2: Blockchain Verification
        if (timber.verification_status === "VERIFIED") {
            timeline.innerHTML += `
                <div class="timeline-step success">
                    <div class="timeline-icon"><i data-lucide="shield-check" style="width: 18px;"></i></div>
                    <div class="timeline-content">
                        <span class="timeline-date">Phase 2 • Security Audit</span>
                        <h3 class="timeline-title">Blockchain Verified</h3>
                        <div class="timeline-details">
                            This asset has been mathematically verified and permanently locked into the blockchain ledger. It cannot be tampered with.
                        </div>
                    </div>
                </div>
            `;
        } else {
            timeline.innerHTML += `
                <div class="timeline-step warning">
                    <div class="timeline-icon"><i data-lucide="clock" style="width: 18px;"></i></div>
                    <div class="timeline-content">
                        <span class="timeline-date">Phase 2 • Security Audit</span>
                        <h3 class="timeline-title">Pending Verification</h3>
                        <div class="timeline-details">
                            This asset is currently awaiting official verification by forestry authorities.
                        </div>
                    </div>
                </div>
            `;
        }

        // STEP 3: Logistics & Transportation
        if (shipment) {
            let statusIcon = "truck";
            let stepClass = "success";
            
            if (shipment.status === "DELIVERED") {
                statusIcon = "check-circle";
            } else if (shipment.status === "CANCELLED" || shipment.status === "ALERT") {
                statusIcon = "alert-triangle";
                stepClass = "warning";
            }

            timeline.innerHTML += `
                <div class="timeline-step ${stepClass}">
                    <div class="timeline-icon"><i data-lucide="${statusIcon}" style="width: 18px;"></i></div>
                    <div class="timeline-content">
                        <span class="timeline-date">Phase 3 • Logistics</span>
                        <h3 class="timeline-title">Shipment: ${shipment.status.replace('_', ' ')}</h3>
                        <div class="timeline-details">
                            <strong>Shipment ID:</strong> ${shipment.shipment_id} <br>
                            <strong>Vehicle:</strong> ${shipment.vehicle_id} <br>
                            <strong>Destination:</strong> ${shipment.destination_address || 'Registered Coordinates'}
                        </div>
                    </div>
                </div>
            `;
        } else {
            timeline.innerHTML += `
                <div class="timeline-step">
                    <div class="timeline-icon" style="color: var(--text-muted); border-color: var(--text-muted);"><i data-lucide="warehouse" style="width: 18px;"></i></div>
                    <div class="timeline-content" style="opacity: 0.7;">
                        <span class="timeline-date">Phase 3 • Logistics</span>
                        <h3 class="timeline-title">Awaiting Dispatch</h3>
                        <div class="timeline-details">
                            This asset is currently secured at the origin location and has not yet been assigned to a transport vehicle.
                        </div>
                    </div>
                </div>
            `;
        }

        // Re-initialize icons for the new HTML
        lucide.createIcons();
        
        // Hide loader, show timeline
        loader.style.display = "none";
        timeline.style.display = "block";

    } catch (error) {
        console.error("Traceability Error:", error);
        loader.style.display = "none";
        showToast("Network error while connecting to ledger.", "danger");
    }
}