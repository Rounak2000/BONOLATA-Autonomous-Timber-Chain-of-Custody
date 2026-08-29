// ==========================================
// AI DRIVER SAFETY MODULE - TIMBERTRUST
// ==========================================

import { FaceLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

let faceLandmarker;
let runningMode = "VIDEO";
let webcamRunning = false;
let lastVideoTime = -1;

// Temporal Logic Configuration
const EAR_THRESHOLD = 0.23; 
const FPS = 15; 
let closedFrames = 0;
const WARNING_FRAMES = FPS * 1.5; 
const CRITICAL_FRAMES = FPS * 3.5; 

let currentState = "NORMAL";
let lastAlertTime = 0;
const ALERT_COOLDOWN = 10000; 

// Alarm Loop Variable
let alarmInterval = null;

// DOM Elements
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const stateUI = document.getElementById("driver-state");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

// Hardcoded context (Replace with dynamic API calls in production)
const currentContext = {
    driver_id: "DRV-8821",
    driver_name: "Rahul Das",
    vehicle_id: "TRK-102",
    shipment_id: "SHP-2026-014",
    lat: 22.8833, 
    lng: 88.0167
};

// Initialize MediaPipe
async function initAI() {
    document.getElementById("ui-driver-name").innerText = currentContext.driver_name;
    try {
        const visionFileset = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        faceLandmarker = await FaceLandmarker.createFromOptions(visionFileset, {
            baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                delegate: "GPU"
            },
            outputFaceBlendshapes: true,
            runningMode: runningMode,
            numFaces: 1
        });
        document.getElementById("ai-status").innerText = "AI: READY";
        console.log("AI Model Loaded Successfully!");
    } catch (error) {
        console.error("Error loading AI model:", error);
        document.getElementById("ai-status").innerText = "AI: ERROR";
        document.getElementById("ai-status").classList.add("status-critical");
    }
}

// Calculate Eye Aspect Ratio
function calculateEAR(landmarks, leftIndices, rightIndices) {
    const dist = (p1, p2) => Math.hypot(landmarks[p1].x - landmarks[p2].x, landmarks[p1].y - landmarks[p2].y);
    
    const leftV1 = dist(leftIndices[1], leftIndices[5]);
    const leftV2 = dist(leftIndices[2], leftIndices[4]);
    const leftH = dist(leftIndices[0], leftIndices[3]);
    const earLeft = (leftV1 + leftV2) / (2.0 * leftH);

    const rightV1 = dist(rightIndices[1], rightIndices[5]);
    const rightV2 = dist(rightIndices[2], rightIndices[4]);
    const rightH = dist(rightIndices[0], rightIndices[3]);
    const earRight = (rightV1 + rightV2) / (2.0 * rightH);

    return (earLeft + earRight) / 2.0;
}

// Main webcam prediction loop
async function predictWebcam() {
    canvasElement.style.width = video.videoWidth;
    canvasElement.style.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;

    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        const results = faceLandmarker.detectForVideo(video, performance.now());
        
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        if (results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            
            const leftEye = [33, 160, 158, 133, 153, 144];
            const rightEye = [362, 385, 387, 263, 373, 380];
            
            const ear = calculateEAR(landmarks, leftEye, rightEye);

            if (ear < EAR_THRESHOLD) {
                closedFrames++;
            } else {
                closedFrames = Math.max(0, closedFrames - 2); 
            }

            processDrowsinessState(closedFrames);

            // Draw visual dots on face
            for (let pt of landmarks) {
                canvasCtx.beginPath();
                canvasCtx.arc(pt.x * canvasElement.width, pt.y * canvasElement.height, 1, 0, 2 * Math.PI);
                canvasCtx.fillStyle = ear < EAR_THRESHOLD ? "red" : "lime";
                canvasCtx.fill();
            }
        } else {
            updateUIState("NO FACE DETECTED", "warning");
        }
    }

    if (webcamRunning) {
        window.requestAnimationFrame(predictWebcam);
    }
}

function processDrowsinessState(frames) {
    if (frames > CRITICAL_FRAMES) {
        changeState("CRITICAL");
    } else if (frames > WARNING_FRAMES) {
        changeState("WARNING");
    } else if (frames === 0) {
        changeState("NORMAL");
    }
}

// ==========================================
// CONTINUOUS ALARM LOGIC
// ==========================================
function playAudioAlert() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3); // Short, sharp beep
    } catch (e) {
        console.log("Audio blocked by browser.");
    }
}

function startContinuousAlarm() {
    if (!alarmInterval) {
        playAudioAlert(); // Play first beep instantly
        alarmInterval = setInterval(playAudioAlert, 800); // Repeat every 800ms
    }
}

function stopContinuousAlarm() {
    if (alarmInterval) {
        clearInterval(alarmInterval);
        alarmInterval = null;
    }
}

// ==========================================
// STATE MANAGEMENT & API CALLS
// ==========================================
function changeState(newState) {
    if (currentState === newState) return;
    currentState = newState;

    if (newState === "NORMAL") {
        updateUIState("🟢 Good", "normal");
        stopContinuousAlarm(); // Driver woke up
    } else if (newState === "WARNING") {
        updateUIState("⚠ POSSIBLE DROWSINESS", "warning");
        stopContinuousAlarm(); // Stop continuous alarm, just a warning state
    } else if (newState === "CRITICAL") {
        updateUIState("🚨 CRITICAL DROWSINESS", "critical");
        startContinuousAlarm(); // Start continuous ringing!
        triggerAlertSystem("CRITICAL", 0.95);
    }
}

function updateUIState(text, style) {
    stateUI.innerText = text;
    stateUI.className = `status-badge status-${style}`;
}

async function triggerAlertSystem(severity, confidence) {
    const now = Date.now();
    if (now - lastAlertTime < ALERT_COOLDOWN) return; 
    lastAlertTime = now;

    // Log to frontend UI table
    const tbody = document.getElementById("alert-history-tbody");
    const timeStr = new Date().toLocaleTimeString();
    tbody.innerHTML = `<tr>
        <td>${timeStr}</td>
        <td>${currentContext.driver_name}</td>
        <td>${currentContext.vehicle_id}</td>
        <td><span class="status-badge status-${severity.toLowerCase()}">${severity}</span></td>
    </tr>` + tbody.innerHTML;

    // Hit the backend
    try {
        await fetch("/api/driver-safety/alert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                driver_id: currentContext.driver_id,
                vehicle_id: currentContext.vehicle_id,
                shipment_id: currentContext.shipment_id,
                severity: severity,
                confidence: confidence,
                coordinates: { lat: currentContext.lat, lng: currentContext.lng }
            })
        });
    } catch (e) {
        console.error("Backend alert failed", e);
    }
}

function triggerDemoEvent(severity) {
    changeState(severity);
    if (severity === "CRITICAL") triggerAlertSystem(severity, 0.99);
}

// Add Listeners to Demo Buttons
document.getElementById("btn-demo-warning").addEventListener("click", () => triggerDemoEvent('WARNING'));
document.getElementById("btn-demo-critical").addEventListener("click", () => triggerDemoEvent('CRITICAL'));

// Controls
startBtn.addEventListener("click", async () => {
    if (!faceLandmarker) {
        alert("Please wait for the AI Model to finish loading. It takes a few seconds.");
        return;
    }
    
    try {
        const constraints = { video: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.addEventListener("loadeddata", () => {
            webcamRunning = true;
            document.getElementById("ai-status").innerText = "AI: ACTIVE";
            predictWebcam();
        });
    } catch (e) {
        console.error("Camera access denied:", e);
        alert("Camera access denied. Please ensure you are running this on a local server (http://127.0.0.1:8000) and allow camera permissions in your browser.");
    }
});

stopBtn.addEventListener("click", () => {
    webcamRunning = false;
    stopContinuousAlarm(); // MUST turn off the alarm when we stop monitoring
    const stream = video.srcObject;
    if (stream) stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    document.getElementById("ai-status").innerText = "AI: OFFLINE";
});

// Start initialization
initAI();