/* =========================================================
   TIMBERTRUST - API COMMUNICATION LAYER
   ========================================================= */

const API_URL = "http://127.0.0.1:8000/api";

/**
 * GLOBAL UI NOTIFICATION (TOAST)
 * Creates a professional popup message at the bottom right.
 * Types available: "success", "danger", "warning", "info"
 */
function showToast(message, type = "info") {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    
    container.appendChild(toast);
    
    // Automatically remove the toast after 4 seconds
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

/**
 * FASTAPI ENDPOINT WRAPPERS
 * These functions return the raw 'fetch' Promise, allowing individual 
 * pages to easily handle FastAPI's 422 Validation Errors if a form is filled out incorrectly.
 */
const api = {
    // --- TIMBER INVENTORY ---
    getTimber: () => fetch(`${API_URL}/timber`),
    createTimber: (data) => fetch(`${API_URL}/timber`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    verifyTimber: (data) => fetch(`${API_URL}/verification/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),

    // --- DRIVERS ---
    getDrivers: () => fetch(`${API_URL}/drivers`),
    createDriver: (data) => fetch(`${API_URL}/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),

    // --- VEHICLES ---
    getVehicles: () => fetch(`${API_URL}/vehicles`),
    createVehicle: (data) => fetch(`${API_URL}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),

    // --- LOGISTICS & SHIPMENTS ---
    getShipments: () => fetch(`${API_URL}/transport/shipments`),
    createShipment: (data) => fetch(`${API_URL}/transport/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),

   // --- LOGISTICS & SHIPMENTS ---
    getShipments: () => fetch(`${API_URL}/shipments`),
    createShipment: (data) => fetch(`${API_URL}/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),

    // --- SECURITY & ALERTS ---
    getAlerts: () => fetch(`${API_URL}/alerts`),

    // --- BLOCKCHAIN LEDGER ---
    getBlockchain: () => fetch(`${API_URL}/blockchain/chain`),
    validateBlockchain: () => fetch(`${API_URL}/blockchain/validate`)
};