const PAGE_MAP = {
    "dashboard": "dashboard.html",
    "timber": "timber.html",
    "shipment": "shipment.html",
    "shipments": "shipment.html",
    "monitoring": "monitoring.html",
    "tracking": "monitoring.html",
    "website tracking": "monitoring.html",
    "alerts": "alerts.html",
    "blockchain": "blockchain.html",
    "drivers": "drivers.html",
    "vehicles": "vehicles.html",
    "trace": "trace.html",
    "traceability": "trace.html",
    "safety": "driver-safety.html",
    "driver safety": "driver-safety.html",
    "driver-safety": "driver-safety.html"
};

document.addEventListener("DOMContentLoaded", () => {

    const toggleBtn = document.getElementById("tt-chat-toggle");
    const chatWindow = document.getElementById("tt-chat-window");
    const closeBtn = document.getElementById("tt-chat-close");
    const sendBtn = document.getElementById("tt-chat-send");
    const inputField = document.getElementById("tt-chat-input");
    const messagesContainer = document.getElementById("tt-chat-messages");
    const suggestionsContainer = document.getElementById("tt-chat-suggestions");
    const suggestionsToggle = document.getElementById("tt-chat-suggestions-toggle");

    let chatHistory = JSON.parse(sessionStorage.getItem("tt_chat_history")) || [];
    let suggestionsVisible = false;

    /* =========================================================
       DEFAULT SUGGESTIONS
       ========================================================= */
   const defaultPrompts = [
        "Open Dashboard",
        "Open Timber",
        "Open Shipments",
        "Open Monitoring",
        "Open Alerts",
        "Open Blockchain",
        "Open Drivers",
        "Open Vehicles",
        "Open Trace",
        "Open Safety"
    ];

    if (suggestionsContainer) {
        suggestionsContainer.style.display = "none";
    }

    /* =========================================================
       SUGGESTION ARROW TOGGLE
       ========================================================= */
    if (suggestionsToggle) {
        suggestionsToggle.addEventListener("click", () => {
            suggestionsVisible = !suggestionsVisible;
            if (suggestionsVisible) {
                renderSuggestions(defaultPrompts);
                suggestionsContainer.style.display = "flex";
                suggestionsToggle.innerHTML = "↓";
                suggestionsToggle.setAttribute("aria-label", "Hide suggestions");
                suggestionsToggle.setAttribute("title", "Hide suggestions");
                suggestionsToggle.style.background = "#ecfdf5";
                suggestionsToggle.style.borderColor = "#86efac";
                suggestionsToggle.style.color = "#166534";
            } else {
                suggestionsContainer.style.display = "none";
                suggestionsToggle.innerHTML = "↑";
                suggestionsToggle.setAttribute("aria-label", "Show suggestions");
                suggestionsToggle.setAttribute("title", "Show suggestions");
                suggestionsToggle.style.background = "#f8faf9";
                suggestionsToggle.style.borderColor = "#dbe4dc";
                suggestionsToggle.style.color = "#166534";
            }
        });
    }

    /* =========================================================
       RESTORE CHAT HISTORY
       ========================================================= */
    if (chatHistory.length === 0) {
        addMessage("Hello! I am Charulata 😊. How can I help you today?", "ai");
    } else {
        chatHistory.forEach(msg => {
            addMessage(msg.text, msg.sender, false);
        });
    }

    /* =========================================================
       CHAT TOGGLES
       ========================================================= */
    toggleBtn.addEventListener("click", () => {
        chatWindow.classList.toggle("hidden");
        if (!chatWindow.classList.contains("hidden")) {
            inputField.focus();
            scrollToBottom();
        }
    });

    closeBtn.addEventListener("click", () => {
        chatWindow.classList.add("hidden");
    });

    /* =========================================================
       SEND MESSAGE
       ========================================================= */
    async function handleSend(text = null) {
        const messageText = text || inputField.value.trim();
        if (!messageText) return;

        inputField.value = ""; // Clear input
        addMessage(messageText, "user"); // Show user message

        /* --- NEW: FRONTEND INTERCEPTOR FOR NAVIGATION --- */
        // If the user types or clicks "Open [Page]", catch it here!
        const lowerCmd = messageText.toLowerCase().trim();
        if (lowerCmd.startsWith("open ") || lowerCmd.startsWith("go to ") || lowerCmd.includes("tracking")) {
            let targetPageKey = lowerCmd.replace("open ", "").replace("go to ", "").trim();
            
            // Map common phrases directly
            if (targetPageKey.includes("safety")) targetPageKey = "safety";
            if (targetPageKey.includes("tracking")) targetPageKey = "monitoring";
            
            const targetHTML = PAGE_MAP[targetPageKey];

            if (targetHTML) {
                addMessage("Navigating right away... 🚀", "ai");
                setTimeout(() => {
                    window.location.href = targetHTML;
                }, 1000);
                return; // Stop here! Do not send to backend.
            }
        }
        /* ------------------------------------------------ */

        // If it's not a navigation command, ask the backend LLM
        const loadingId = addLoadingIndicator();

        try {
            const response = await fetch("http://127.0.0.1:8000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: messageText,
                    session_id: "default"
                })
            });

            removeElement(loadingId);

            if (!response.ok) throw new Error("API returned an error");

            const data = await response.json();
            let answerText = data.answer;

            if (data.sources && data.sources.length > 0) {
                const src = data.sources[0].source;
                answerText += `<br><br><small style="color:#64748b;"><em>Source: ${src}</em></small>`;
            }

            addMessage(answerText, "ai");

            // Backend fallback navigation
            if (data.intent === "navigation" && data.navigation && data.navigation.target) {
                const targetHTML = PAGE_MAP[data.navigation.target.toLowerCase()];
                if (targetHTML) {
                    setTimeout(() => { window.location.href = targetHTML; }, 1500);
                }
            }

        } catch (error) {
            console.error("Charulata AI Error:", error);
            removeElement(loadingId);
            addMessage("Sorry, the Charulata is temporarily unavailable.", "ai");
        }
    }

    sendBtn.addEventListener("click", () => handleSend());
    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSend();
    });

    /* =========================================================
       UTILITY FUNCTIONS
       ========================================================= */
    function addMessage(text, sender, save = true) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `tt-msg tt-msg-${sender}`;
        msgDiv.innerHTML = text;
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();

        if (save) {
            chatHistory.push({ text: text, sender: sender });
            sessionStorage.setItem("tt_chat_history", JSON.stringify(chatHistory));
        }
    }

    function renderSuggestions(prompts) {
        if (!suggestionsContainer) return;
        suggestionsContainer.innerHTML = "";
        prompts.forEach(prompt => {
            const btn = document.createElement("button");
            btn.className = "tt-suggestion-btn";
            btn.innerText = prompt;
            btn.onclick = () => handleSend(prompt);
            suggestionsContainer.appendChild(btn);
        });
    }

    function addLoadingIndicator() {
        const id = "tt-loading-" + Date.now();
        const msgDiv = document.createElement("div");
        msgDiv.id = id;
        msgDiv.className = "tt-msg tt-msg-ai";
        msgDiv.innerHTML = "Thinking...";
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
        return id;
    }

    function removeElement(id) {
        const element = document.getElementById(id);
        if (element) element.remove();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});