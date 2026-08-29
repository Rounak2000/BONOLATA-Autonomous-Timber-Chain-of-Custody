/* =========================================================
   TIMBERTRUST - HORIZONTAL BLOCKCHAIN LOGIC & BROKEN CHAIN ANIMATION
   ========================================================= */

// Truncate hashes cleanly (e.g., 163d56...5938b2)
function formatHash(hash) {
    if (!hash || hash === '0' || hash === 'Not Computed') return hash || '0';
    if (hash.length <= 14) return hash;
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 6)}`;
}

async function loadBlockchain() {
    const container = document.getElementById('blockchain-container') || document.getElementById('chain-container');
    if (!container) return;

    try {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 30px; width: 100%;">
                <i data-lucide="loader" class="spin" style="width: 32px; height: 32px; margin-bottom: 8px;"></i>
                <p style="font-size: 0.85rem;">Syncing with Ledger...</p>
            </div>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        const response = await fetch('/api/blockchain');
        const result = await response.json();
        const chain = result.chain || result.data || result || [];

        container.innerHTML = "";

        if (!Array.isArray(chain) || chain.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 30px; width: 100%;">
                    <i data-lucide="database" style="width: 36px; height: 36px; opacity: 0.5;"></i><br>
                    Genesis block not found. Ledger is empty.
                </div>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        let html = "";

        chain.forEach((block, index) => {
            // Timestamp formatting
            let timeStr = "N/A";
            if (block.timestamp) {
                const rawTime = block.timestamp;
                const parsedDate = new Date(!isNaN(rawTime) ? rawTime * 1000 : rawTime);
                if (!isNaN(parsedDate.getTime())) timeStr = parsedDate.toLocaleTimeString();
                else timeStr = rawTime;
            }

            // Transaction Data
            let dataDisplay = "No transaction payload";
            const blockData = block.data || block.transactions || block.data_payload;
            if (blockData) dataDisplay = JSON.stringify(blockData);

            const isGenesis = index === 0;

            // Render Small Block Card
            html += `
                <div class="block-card" id="block-card-${index}">
                    <div class="block-header ${isGenesis ? 'genesis' : ''}">
                        <div class="block-title">
                            <i data-lucide="${isGenesis ? 'box' : 'lock'}" style="color: ${isGenesis ? '#10b981' : '#3b82f6'}; width: 15px;"></i>
                            BLOCK #${block.index ?? index}
                        </div>
                        <div class="block-time">
                            <i data-lucide="clock" style="width: 12px; display: inline;"></i> ${timeStr}
                        </div>
                    </div>

                    <div class="block-body">
                        <div class="hash-row">
                            <span class="hash-row-label">Prev Hash</span>
                            <span class="hash-val">${formatHash(block.previous_hash)}</span>
                        </div>

                        <div class="hash-row current">
                            <span class="hash-row-label" style="color: #2563eb;">Current Hash</span>
                            <span class="hash-val">${formatHash(block.hash || block.current_hash)}</span>
                        </div>

                        <div class="tx-box-mini">
                            <code style="word-break: break-all;">${dataDisplay}</code>
                        </div>
                    </div>
                </div>
            `;

            // Interlocking Horizontal Chain Link Connector
            if (index < chain.length - 1) {
                html += `
                <div class="chain-connector" id="chain-connector-${index}">
                    <div class="chain-ring left"></div>
                    <div class="chain-ring right"></div>
                </div>
                `;
            }
        });

        container.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();

    } catch (error) {
        console.error("Load Blockchain Error:", error);
        container.innerHTML = `<div style="color:var(--danger); text-align:center; padding: 20px; width: 100%;">Failed to sync with ledger.</div>`;
    }
}

// Ledger Validation with Broken Chain Trigger
async function validateLedger() {
    const btn = document.getElementById('validate-btn');
    const originalText = btn ? btn.innerHTML : "Validate Ledger Integrity";

    if (btn) {
        btn.innerHTML = `<i data-lucide="loader" class="spin"></i> Validating...`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        btn.disabled = true;
    }

    try {
        const response = await fetch('/api/blockchain/validate');
        const result = await response.json();

        const isValid = result.is_valid || (result.message && result.message.toLowerCase().includes("valid"));

        if (isValid) {
            document.querySelectorAll('.chain-connector').forEach(el => el.classList.remove('broken'));
            document.querySelectorAll('.block-card').forEach(el => el.classList.remove('tampered'));

            if (typeof showToast === 'function') {
                showToast("Ledger verified: All chain links intact!", "success");
            }
        } else {
            triggerBrokenChainAnimation();

            if (typeof showToast === 'function') {
                showToast("CRITICAL: Blockchain integrity broken!", "danger");
            }
        }
    } catch (error) {
        console.error("Validation error:", error);
        triggerBrokenChainAnimation();
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            btn.disabled = false;
        }
    }
}

// Function to simulate chain breaking animation
function triggerBrokenChainAnimation() {
    const connectors = document.querySelectorAll('.chain-connector');
    const blocks = document.querySelectorAll('.block-card');

    if (connectors.length > 0) {
        const targetConnector = connectors[connectors.length - 1];
        targetConnector.classList.add('broken');

        if (blocks.length > 0) {
            blocks[blocks.length - 1].classList.add('tampered');
        }
    }
}

document.addEventListener("DOMContentLoaded", loadBlockchain);