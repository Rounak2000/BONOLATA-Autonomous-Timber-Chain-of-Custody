/* =========================================================
   TIMBERTRUST - DASHBOARD LOGIC
   ========================================================= */

async function loadDashboardStats() {
    try {
        // 1. Fetch Timber count
        const timberRes = await api.getTimber();
        const timberData = await timberRes.json();
        // Handle both standard lists and nested { data: [] }
        const timberList = timberData.data || timberData || [];
        document.getElementById('stat-timber').innerText = timberList.length;

        // 2. Fetch Active Shipments
        const shipmentRes = await api.getShipments();
        const shipmentData = await shipmentRes.json();
        const shipmentList = shipmentData.data || shipmentData || [];
        // Count only shipments that are NOT delivered or completed
        const activeShipments = shipmentList.filter(s => s.status !== "DELIVERED" && s.status !== "COMPLETED");
        document.getElementById('stat-shipments').innerText = activeShipments.length;

        // 3. Fetch Alerts
        const alertRes = await api.getAlerts();
        const alertData = await alertRes.json();
        const alertList = alertData.data || alertData || [];
        document.getElementById('stat-alerts').innerText = alertList.length;

        // 4. Validate Blockchain Integrity
        try {
            const chainRes = await api.validateBlockchain();
            const chainData = await chainRes.json();
            
            if (chainData.is_valid || (chainData.message && chainData.message.toLowerCase().includes("valid"))) {
                document.getElementById('stat-ledger').innerHTML = `<span style="color: var(--success);">SECURE</span>`;
            } else {
                document.getElementById('stat-ledger').innerHTML = `<span style="color: var(--danger);">COMPROMISED</span>`;
            }
        } catch (chainErr) {
            document.getElementById('stat-ledger').innerHTML = `<span style="color: var(--warning);">UNREACHABLE</span>`;
        }

    } catch (error) {
        console.error("Dashboard Loading Error:", error);
        if (typeof showToast === 'function') {
            showToast("Failed to connect to the backend API. Is the server running?", "danger");
        }
        
        // Show error state in cards
        document.getElementById('stat-timber').innerText = "--";
        document.getElementById('stat-shipments').innerText = "--";
        document.getElementById('stat-alerts').innerText = "--";
    }
}

// Run this automatically when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadDashboardStats();
    
    // --- Initialize AI Tree Detection Upload Listener ---
    const treeUploadInput = document.getElementById('tree-upload');
    const treePreview = document.getElementById('tree-preview');
    const uploadIconContainer = document.getElementById('upload-icon-container');
    const detectBtn = document.getElementById('detect-tree-btn');
    const resultSection = document.getElementById('detection-result');
    const uploadBox = document.getElementById('upload-box');

    if (treeUploadInput) {
        treeUploadInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (treePreview) {
                        treePreview.src = e.target.result;
                        treePreview.style.display = 'block';
                    }
                    if (uploadIconContainer) uploadIconContainer.style.display = 'none';
                    if (detectBtn) detectBtn.style.display = 'flex';
                    if (resultSection) resultSection.style.display = 'none';
                    if (uploadBox) {
                        const selectBtn = uploadBox.querySelector('button');
                        if (selectBtn) selectBtn.style.display = 'none';
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    }
});

/* =========================================================
   AI TREE SPECIES DETECTION LOGIC
   ========================================================= */
/* =========================================================
   AI TREE SPECIES DETECTION & LIVE WEB KNOWLEDGE API
   ========================================================= */

// Fallback dictionary just in case the computer goes offline during the presentation
const FALLBACK_ENCYCLOPEDIA = {
    "Shorea robusta": { common: "Sal Tree", desc: "A dominant hardwood tree in Indian forests. It yields highly durable, coarse-grained timber widely used in construction." },
    "Tectona grandis": { common: "Teak", desc: "A tropical hardwood tree species placed in the flowering plant family Lamiaceae. It is highly valued for its durability and water resistance." }
};

// 🌐 LIVE ONLINE SOURCE API
async function fetchTreeInfo(species) {
    try {
        // We use Wikipedia's free REST API which requires no API keys and is highly reliable for botanical names
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(species)}`);
        
        if (response.ok) {
            const data = await response.json();
            
            // Extract the first 2 sentences for a clean, two-line dashboard summary
            let sentences = data.extract.match(/[^.!?]+[.!?]+/g) || [data.extract];
            let twoLines = sentences.slice(0, 2).join(' ').trim();
            
            // Capitalize the common name / short description
            let commonName = data.description || "Botanical Tree Species";
            commonName = commonName.charAt(0).toUpperCase() + commonName.slice(1);
            
            return { common: commonName, desc: twoLines };
        }
    } catch (error) {
        console.warn("Could not fetch live data, using offline fallback.", error);
    }
    
    // Fallback if API fails
    return FALLBACK_ENCYCLOPEDIA[species] || { 
        common: "Verified Species", 
        desc: "Timber species verified by AI. Live details currently unavailable." 
    };
}

async function runTreeDetection() {
    const treeUploadInput = document.getElementById('tree-upload');
    const detectBtn = document.getElementById('detect-tree-btn');
    const resultSection = document.getElementById('detection-result');
    
    if (!treeUploadInput || !treeUploadInput.files || treeUploadInput.files.length === 0) {
        if (typeof showToast === 'function') showToast("Please select an image first.", "warning");
        return;
    }

    const file = treeUploadInput.files[0];

    // Update UI to loading state
    const originalBtnText = detectBtn.innerHTML;
    detectBtn.innerHTML = '<i data-lucide="loader" class="spin"></i> Processing AI...';
    detectBtn.disabled = true;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const formData = new FormData();
    formData.append("file", file);

    try {
        // 1. Send image to your FastAPI Backend (ResNet18)
        const response = await fetch('/api/tree/detect', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
            
            const predictedSpecies = data.predicted_tree;
            
            // 2. 🌐 FETCH LIVE DATA FROM ONLINE SOURCE
            detectBtn.innerHTML = '<i data-lucide="loader" class="spin"></i> Fetching Database...';
            const liveDetails = await fetchTreeInfo(predictedSpecies);

            // 3. Update Results UI
            document.getElementById('result-species').innerText = predictedSpecies;
            document.getElementById('result-common-name').innerText = liveDetails.common;
            document.getElementById('result-description').innerText = liveDetails.desc;
            document.getElementById('result-confidence').innerText = `${data.confidence}%`;
            
            detectBtn.style.display = 'none';
            resultSection.style.display = 'flex';
            
            if (typeof showToast === 'function') {
                showToast(`Match Found: ${liveDetails.common}`, "success");
            }
        } else {
            throw new Error(data.detail || data.error || "Detection failed.");
        }
    } catch (error) {
        console.error("Detection Error:", error);
        if (typeof showToast === 'function') {
            showToast(error.message, "danger");
        } else {
            alert(error.message);
        }
    } finally {
        detectBtn.innerHTML = originalBtnText;
        detectBtn.disabled = false;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

function resetTreeDetection() {
    const treeUploadInput = document.getElementById('tree-upload');
    const treePreview = document.getElementById('tree-preview');
    const uploadIconContainer = document.getElementById('upload-icon-container');
    const detectBtn = document.getElementById('detect-tree-btn');
    const resultSection = document.getElementById('detection-result');
    const uploadBox = document.getElementById('upload-box');

    if (treeUploadInput) treeUploadInput.value = "";
    if (treePreview) treePreview.style.display = 'none';
    if (uploadIconContainer) uploadIconContainer.style.display = 'block';
    if (resultSection) resultSection.style.display = 'none';
    if (detectBtn) detectBtn.style.display = 'none';
    
    if (uploadBox) {
        const selectBtn = uploadBox.querySelector('button');
        if (selectBtn) selectBtn.style.display = 'block';
    }
}