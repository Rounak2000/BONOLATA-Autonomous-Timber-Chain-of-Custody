<img width="728" height="158" alt="image" src="https://github.com/user-attachments/assets/7a3b07df-da94-49a1-9266-670fa83ef474" />


### Autonomous Timber Chain of Custody, AI Verification & Intelligent Logistics Platform

<p align="center">

**AI-Powered • Tamper-Evident • Safety-Aware • Location-Aware • Digitally Auditable**

</p>

<p align="center">

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-Computer%20Vision-EE4C2C?logo=pytorch)](https://pytorch.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Face%20Landmarks-4285F4?logo=google)](https://ai.google.dev/edge/mediapipe/solutions/guide)
[![Leaflet](https://img.shields.io/badge/Leaflet-Interactive%20Maps-199900?logo=leaflet)](https://leafletjs.com/)
[![SHA-256](https://img.shields.io/badge/Security-SHA--256-purple)](https://docs.python.org/3/library/hashlib.html)
[![License](https://img.shields.io/badge/License-Academic%20Project-lightgrey)](#-license)

</p>

---

## 🌲 Overview


**Bonolota** is an intelligent digital platform designed to improve the **traceability, authenticity, security, and safety of timber transportation** from its point of origin to its final destination.




The platform combines:

* 🌿 **AI-based tree species identification**
* ⛓️ **Cryptographic chain-of-custody verification**
* 🚛 **Intelligent shipment and transportation monitoring**
* 🗺️ **Location and route visualization**
* 👁️ **AI-based driver drowsiness detection**
* 🤖 **Natural-language AI assistance**
* 🔐 **Tamper-evident event verification**
* 📊 **Centralized operational dashboard**


The core idea is simple:

> **Every timber movement should be traceable, every important event should be verifiable, and every transportation stage should be safer.**

Bonolota transforms traditional timber logistics into a **digitally auditable and AI-assisted supply-chain ecosystem**.

---

# 📑 Table of Contents

1. [Project Vision](#-project-vision)
2. [Problem Statement](#-problem-statement)
3. [Our Solution](#-our-solution)
4. [Key Features](#-key-features)
5. [System Architecture](#️-system-architecture)
6. [End-to-End Data Flow](#-end-to-end-data-flow)
7. [Core Modules](#-core-modules)
8. [AI Tree Species Detection](#-ai-tree-species-detection)
9. [AI Driver Safety Monitor](#-ai-driver-safety-monitor)
10. [Cryptographic Chain of Custody](#-cryptographic-chain-of-custody)
11. [Smart Logistics & Route Monitoring](#-smart-logistics--route-monitoring)
12. [Charulata AI Assistant](#-Charulata-ai-assistant)
13. [Dashboard & User Experience](#-dashboard--user-experience)
14. [Technology Stack](#️-technology-stack)
15. [Project Architecture](#-project-architecture)
16. [Directory Structure](#-directory-structure)
17. [API Overview](#-api-overview)
18. [AI Models & Data](#-ai-models--data)
19. [Security & Data Integrity](#-security--data-integrity)
20. [Getting Started](#-getting-started)
21. [Running the Application](#-running-the-application)
22. [Example Workflow](#-example-workflow)
23. [Project Team & Mentorship](#-project-team--mentorship)
24. [Research & Academic Value](#-research--academic-value)
25. [Future Roadmap](#-future-roadmap)
26. [Limitations](#-current-limitations)
27. [Acknowledgements](#-acknowledgements)
28. [License](#-license)

---

# 🎯 Project Vision

The timber industry depends on long and complex transportation networks involving forests, collection points, warehouses, transport vehicles, processing facilities, and final destinations.

During this journey, several problems can occur:

* Unauthorized timber substitution
* Incorrect species declaration
* Loss of shipment traceability
* Unusual transportation delays
* Unauthorized route deviations
* Potential cargo diversion
* Manual record manipulation
* Driver fatigue and drowsiness
* Lack of centralized monitoring
* Difficulty auditing historical events

**Bonolota** addresses these challenges by creating a unified digital platform where timber identity, transportation events, security information, and driver safety can be monitored from a single interface.

---

# 🚨 Problem Statement

Traditional timber transportation systems often rely heavily on:

```text
Paper Documents
      ↓
Manual Verification
      ↓
Manual Transportation Logs
      ↓
Independent Tracking Systems
      ↓
Final Delivery
```

This approach makes it difficult to answer critical questions such as:

> Where did this timber originate?

> Was the declared timber species actually verified?

> Has the shipment followed its expected route?

> Was there an unusual stop during transportation?

> Has any recorded event been modified?

> Was the driver showing signs of fatigue?

> Can the complete journey be reconstructed later?

Bonolota introduces a digitally connected workflow:

```text
TIMBER ORIGIN
      │
      ▼
AI SPECIES VERIFICATION
      │
      ▼
DIGITAL SHIPMENT CREATION
      │
      ▼
CRYPTOGRAPHIC EVENT RECORD
      │
      ▼
TRANSPORTATION MONITORING
      │
      ├──────────────► Route Monitoring
      │
      ├──────────────► Stop/Delay Monitoring
      │
      └──────────────► Driver Safety Monitoring
      │
      ▼
DESTINATION VERIFICATION
      │
      ▼
COMPLETE DIGITAL CHAIN OF CUSTODY
```

---

# 💡 Our Solution

Bonolota combines **Computer Vision, Web Technologies, Cryptography, GIS, and AI-assisted interfaces** into one integrated platform.


The system is divided into several logical layers:

| Layer                        | Responsibility                        |
| ---------------------------- | ------------------------------------- |
| 🌿 **AI Verification Layer** | Identifies timber/tree species        |
| 🚛 **Logistics Layer**       | Tracks shipment movement and events   |
| 🗺️ **GIS Layer**            | Visualizes routes and locations       |
| 👁️ **Safety Layer**         | Monitors driver drowsiness            |
| ⛓️ **Integrity Layer**       | Creates tamper-evident records        |
| 🤖 **Assistant Layer**       | Provides natural-language interaction |
| 📊 **Dashboard Layer**       | Presents operational information      |

---

# ✨ Key Features

### 🌿 AI Tree Species Detection

Identify the probable tree species from an uploaded image using a trained **ResNet18** deep-learning model.
<img width="1472" height="534" alt="image" src="https://github.com/user-attachments/assets/1026f86f-45c6-48bb-92dc-bb37d001fddf" />


### 🔐 Cryptographic Chain of Custody

Every important shipment event can be connected using **SHA-256 hashing** and a previous-hash relationship.
<img width="1851" height="784" alt="image" src="https://github.com/user-attachments/assets/eef39aa3-4ddb-442f-9f1a-5abbabdaa0c3" />

### 🚛 Shipment Monitoring

Track timber shipments and their associated transportation events.
<img width="1848" height="627" alt="image" src="https://github.com/user-attachments/assets/7efa83b0-aa40-4262-88a8-70bff818cf4f" />

### 🗺️ Route Visualization

Display transportation routes and shipment locations using interactive maps.
<img width="1849" height="892" alt="image" src="https://github.com/user-attachments/assets/171debc1-7e1b-468c-9cf3-0d807dfeb972" />

### 🚨 Anomaly Awareness

Identify suspicious transportation patterns such as unusual stops, excessive waiting, or route deviation.
<img width="1930" height="893" alt="image" src="https://github.com/user-attachments/assets/e54892e6-ab5c-47a3-ab72-af4fa4963fc2" />


### 👁️ Driver Drowsiness Detection

Use computer vision and facial landmarks to identify prolonged eye closure patterns associated with possible drowsiness.
<img width="1831" height="798" alt="image" src="https://github.com/user-attachments/assets/395ff6e2-6da0-445d-9889-2810f91f87e4" />

### 🤖 Charulata AI Assistant

Interact with the Bonolota dashboard through a natural-language assistant.
<img width="331" height="547" alt="image" src="https://github.com/user-attachments/assets/df2974f2-a046-4226-8337-80d1a893afd9" />

### 📊 Centralized Dashboard

Bring shipment status, AI results, ledger information, alerts, maps, and safety information into one interface.

---
<img width="1865" height="902" alt="image" src="https://github.com/user-attachments/assets/d2c7fef1-6f71-4c8c-a078-94cf5a4fc8a0" />

# 🏗️ System Architecture

Bonolota follows a modular architecture designed around **AI inference, backend APIs, data integrity, and frontend visualization**.

```text
                         ┌──────────────────────────┐
                         │      TIMBER ORIGIN       │
                         │ Forest / Collection Point│
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │   AI SPECIES DETECTOR    │
                         │        ResNet18           │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │    TIMBER REGISTRATION   │
                         │   Shipment Initialization│
                         └────────────┬─────────────┘
                                      │
                                      ▼
              ┌──────────────────────────────────────────────┐
              │                FASTAPI BACKEND               │
              │                                              │
              │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
              │  │ Timber   │  │Shipment  │  │ Ledger   │  │
              │  │ Routes   │  │ Routes   │  │ Service  │  │
              │  └──────────┘  └──────────┘  └──────────┘  │
              │                                              │
              │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
              │  │ AI       │  │ Chatbot  │  │ Safety   │  │
              │  │ Services │  │ Service  │  │ Events   │  │
              │  └──────────┘  └──────────┘  └──────────┘  │
              └──────────────────────┬───────────────────────┘
                                     │
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
                 ▼                   ▼                   ▼
        ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
        │ Cryptographic  │  │ Shipment/Data  │  │ AI & Safety    │
        │ Ledger         │  │ Storage        │  │ Results        │
        └────────────────┘  └────────────────┘  └────────────────┘
                 │                   │                   │
                 └───────────────────┼───────────────────┘
                                     │
                                     ▼
                         ┌──────────────────────────┐
                         │     Bonolota UI       │
                         │                          │
                         │ Dashboard • Maps         │
                         │ Ledger • Alerts          │
                         │ AI Detection • Safety    │
                         │ Charulata Assistant            │
                         └──────────────────────────┘
```

---

# 🔄 End-to-End Data Flow

A typical Bonolota workflow can be represented as:

```text
1. Timber Identified
        ↓
2. Species Image Captured
        ↓
3. ResNet18 Performs Classification
        ↓
4. Timber Record Created
        ↓
5. Shipment Registered
        ↓
6. Transportation Begins
        ↓
7. Location / Event Information Recorded
        ↓
8. Event Hash Generated
        ↓
9. Previous Hash Linked
        ↓
10. Dashboard Updated
        ↓
11. Route / Stop Monitoring
        ↓
12. Driver Safety Monitoring
        ↓
13. Destination Reached
        ↓
14. Chain of Custody Audited
```

This produces a complete digital history of the shipment journey.

---

# 🌿 AI Tree Species Detection
<img width="1634" height="306" alt="image" src="https://github.com/user-attachments/assets/2bb94bca-ae0d-4c20-b19e-4cb2d2e7bea9" />


## ResNet18 Computer Vision Module

Bonolota incorporates a custom-trained **ResNet18 convolutional neural network** to identify tree species from images.

The model is designed to provide an additional layer of verification at the point of timber identification.

### Model Pipeline

```text
Input Image
     │
     ▼
Image Preprocessing
     │
     ├── Resize
     ├── Tensor Conversion
     └── Normalization
     │
     ▼
ResNet18
     │
     ▼
Feature Extraction
     │
     ▼
Classification Layer
     │
     ▼
Predicted Species
     │
     ▼
Confidence / Metadata
```

### Dataset

The training workflow was based on the **BarkVisionAI dataset**.

Current project dataset configuration includes:

* **13 tree species classes**
* **36,400 total images**
* **25,480 training images**
* **5,460 validation images**
* **5,460 test images**

### Model

```text
Architecture: ResNet18
Framework: PyTorch
Input Resolution: 224 × 224
Model Weights: tree_model.pth
Inference: Local Python Backend
```

The final classification layer is adapted for the project's specific number of tree species.

### Why ResNet18?

ResNet18 provides a practical balance between:

* Classification capability
* Model size
* Inference speed
* Deployment simplicity
* Computational requirements

This makes it suitable for an application where lightweight local inference is desirable.

---

# 👁️ AI Driver Safety Monitor

Transportation safety is another major component of Bonolota.

Long-distance transportation can expose drivers to fatigue and reduced attention. Bonolota therefore includes a browser-based computer-vision module that monitors facial landmarks and eye-related movement patterns.

## MediaPipe Face Landmark Pipeline

```text
Webcam
  │
  ▼
Video Frame
  │
  ▼
MediaPipe Face Landmarker
  │
  ▼
Facial Landmarks
  │
  ▼
Eye Landmark Extraction
  │
  ▼
Eye Aspect Ratio (EAR)
  │
  ▼
Temporal Analysis
  │
  ▼
Drowsiness Warning
```

### Core Technologies

* MediaPipe Face Landmarker
* Browser webcam API
* JavaScript
* Canvas-based visualization
* Eye Aspect Ratio calculation
* Temporal threshold logic

### EAR Concept
<img width="677" height="231" alt="image" src="https://github.com/user-attachments/assets/c34e0e6d-21b0-4da7-a2f9-4ab43baf61be" />

The **Eye Aspect Ratio (EAR)** is calculated using selected eye landmarks.

A simplified representation is:

```text
             Vertical Eye Distances
EAR = ─────────────────────────────────
             Horizontal Eye Distance
```

Instead of relying on a single frame, Bonolota uses temporal logic so that a short blink does not automatically become a drowsiness alert.

### Safety Workflow

```text
Eyes Normal
     │
     ▼
Continuous Monitoring
     │
     ▼
Eye Closure Detected
     │
     ▼
Temporal Threshold Check
     │
     ├── Normal Blink ───────► Continue Monitoring
     │
     └── Prolonged Closure ──► Warning
                                  │
                                  ▼
                            Safety Alert
```

---

# ⛓️ Cryptographic Chain of Custody
<img width="738" height="396" alt="image" src="https://github.com/user-attachments/assets/93c9c4ec-b4d3-43d7-a4cd-43369b0ea34f" />

## Tamper-Evident Event Ledger

Bonolota uses cryptographic hashing to create a linked sequence of shipment events.

Rather than treating each event as an isolated record, the system can associate each event with the hash of the previous event.

```text
Block 1
┌───────────────────────┐
│ Shipment Information  │
│ Event Data            │
│ Previous Hash         │
│ Current Hash          │
└───────────┬───────────┘
            │
            ▼
Block 2
┌───────────────────────┐
│ Checkpoint Event      │
│ Event Data            │
│ Previous Hash         │◄──── Block 1 Hash
│ Current Hash          │
└───────────┬───────────┘
            │
            ▼
Block 3
┌───────────────────────┐
│ Transportation Event  │
│ Event Data             │
│ Previous Hash         │◄──── Block 2 Hash
│ Current Hash           │
└───────────┬───────────┘
            │
            ▼
        Destination
```

### SHA-256

Each record can be processed using SHA-256:

```text
Event Data
    +
Previous Hash
    ↓
SHA-256
    ↓
Current Hash
```

If historical event data is changed, the resulting hash can change as well, providing a mechanism to detect unauthorized modification.
<img width="298" height="242" alt="image" src="https://github.com/user-attachments/assets/f70fe0d9-ddfc-4b9b-b91a-10752cb5d035" />


### Important Design Principle

Bonolota's ledger is best described as a:

> **Cryptographically linked, tamper-evident event ledger**

rather than a public decentralized blockchain network.

This architecture provides the integrity benefits needed for the project while keeping the implementation lightweight and suitable for an academic prototype.

---

# 🛰️ Smart Logistics & Route Monitoring

Bonolota provides a centralized logistics view for monitoring timber transportation.
<img width="389" height="399" alt="image" src="https://github.com/user-attachments/assets/63947399-462b-419d-82f6-b2d6167ffeee" />
<img width="1631" height="435" alt="image" src="https://github.com/user-attachments/assets/1350e200-21aa-46b3-91ca-a246fedde928" />

The dashboard can visualize:

* 🚛 Active shipments
* 📍 Current/recorded locations
* 🗺️ Expected routes
* ⏱️ Waiting periods
* 🚨 Alerts
* 📦 Shipment status
* 🔐 Chain-of-custody events

## Route Monitoring Concept
<img width="490" height="204" alt="image" src="https://github.com/user-attachments/assets/1093f593-9a00-4af6-a607-5b99913ec3ce" />
<img width="1669" height="860" alt="image" src="https://github.com/user-attachments/assets/5157efc9-5cc2-4aaa-b5ee-ec614810bb45" />
<img width="1851" height="888" alt="image" src="https://github.com/user-attachments/assets/a25783c2-daac-4c1d-be31-c71806403892" />

Our logistics module does not rely on continuous real-time GPS tracking.
Instead, Bonolota uses a custom stop and route-deviation detection system to monitor shipment movement.
The system records defined checkpoints, detects unusual stops, excessive waiting, and unauthorized deviations from the expected journey.
These events are visualized on the dashboard and can trigger alerts for potential security or logistics issues.
```text
Expected Route
      │
      ▼
Truck Movement
      │
      ▼
Compare Position
      │
      ├── Within Expected Path
      │          │
      │          ▼
      │       Continue
      │
      └── Unexpected Deviation
                 │
                 ▼
              Warning
                 │
                 ▼
          Dashboard Alert
```

The system can also be extended to detect unusual waiting times and other transportation anomalies.

---

# 🤖 Charulata AI Assistant

## Intelligent Dashboard Assistant

**Charulata** is the conversational assistant integrated into Bonolota.

Instead of forcing an operator to manually navigate through every dashboard section, Charulata can act as a natural-language interface to the system.

### Example Interaction

```text
Operator:
"Show me the current shipment status."

             ↓

          Charulata AI

             ↓

Dashboard Data Retrieval

             ↓

"Shipment TT-001 is currently
in transit."
```

Potential capabilities include:

* Shipment-related queries
* Dashboard navigation
* Alert interpretation
* Logistics diagnostics
* System information
* Natural-language commands

The assistant is designed to make the platform more accessible to non-technical operators.

---

# 📊 Dashboard & User Experience

Bonolota is not designed merely as a backend API.

A major goal of the project is to create a **visual command center** where complex supply-chain information can be understood quickly.

The dashboard can combine:

### 🗺️ Interactive Map

Displays shipment locations and transportation routes.

### ⛓️ Winding Road Ledger

A visual representation of the cryptographically linked shipment journey.

### 🌿 AI Detection Panel

Displays tree species identification results.

### 👁️ Driver Safety Panel

Displays webcam-based safety monitoring.

### 🚨 Alert Center

Highlights important system events.

### 🤖 Charulata Assistant

Provides conversational access to platform functionality.

---

# 🎨 UI Design Philosophy

The Bonolota interface follows a modern operational-dashboard approach.

The design focuses on:

```text
Information
     ↓
Visualization
     ↓
Interpretation
     ↓
Action
```

Instead of presenting raw JSON responses, the system converts backend information into:

* Cards
* Status indicators
* Maps
* Timelines
* Alerts
* Animated journey elements
* AI panels
* Interactive controls

This makes the system suitable for demonstrations, presentations, and practical operational scenarios.

---

# 🛠️ Technology Stack

| Category                 | Technology         | Purpose                               |
| ------------------------ | ------------------ | ------------------------------------- |
| **Programming Language** | Python             | Backend and AI services               |
| **Backend Framework**    | FastAPI            | REST API and application backend      |
| **Server**               | Uvicorn            | ASGI application server               |
| **Validation**           | Pydantic           | Request/response validation           |
| **Deep Learning**        | PyTorch            | Tree species classification           |
| **Computer Vision**      | Torchvision        | Image preprocessing and model support |
| **Tree Model**           | ResNet18           | Tree species identification           |
| **Driver Safety**        | MediaPipe          | Facial landmark detection             |
| **Frontend**             | HTML5              | Application structure                 |
| **Styling**              | CSS3               | UI/UX and animations                  |
| **Frontend Logic**       | JavaScript         | API integration and interaction       |
| **Maps**                 | Leaflet.js         | Interactive GIS visualization         |
| **Map Data**             | OpenStreetMap      | Geographic map tiles/data             |
| **Cryptography**         | SHA-256 / hashlib  | Event integrity                       |
| **External Knowledge**   | Wikipedia REST API | Species information                   |
| **Data Storage**         | JSON-based storage | Lightweight project persistence       |

---

# 🧩 Project Architecture

Bonolota follows a modular software architecture:

```text
┌───────────────────────────────────────────────┐
│                  FRONTEND                     │
│                                               │
│ Dashboard │ Maps │ Ledger │ Safety │ Chatbot │
└───────────────────────┬───────────────────────┘
                        │
                        │ HTTP / REST
                        ▼
┌───────────────────────────────────────────────┐
│                  FASTAPI                      │
│                                               │
│ Authentication / CORS / Routing / Validation  │
└───────────────────────┬───────────────────────┘
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ AI Services │ │ Ledger      │ │ Logistics   │
│             │ │ Service     │ │ Services    │
└─────────────┘ └─────────────┘ └─────────────┘
        │               │                │
        ▼               ▼                ▼
   ResNet18          SHA-256         Shipment Data
   MediaPipe         Hash Chain      Location Data
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                 JSON / Application
                    Data Storage
```

---

# 📂 Directory Structure

```text
Bonolota/
│
├── backend/
│   │
│   ├── main.py
│   │   └── FastAPI application entry point
│   │
│   ├── services/
│   │   ├── tree_detector.py
│   │   │   └── ResNet18 model loading and inference
│   │   │
│   │   └── ledger.py
│   │       └── SHA-256 hashing and chain validation
│   │
│   ├── routes/
│   │   ├── timber.py
│   │   ├── shipments.py
│   │   ├── ledger.py
│   │   └── other API routers
│   │
│   ├── chatbot/
│   │   └── Charulata AI assistant logic
│   │
│   └── tree_model.pth
│       └── Trained PyTorch model weights
│
├── frontend/
│   │
│   ├── dashboard.html
│   │   └── Main Bonolota command center
│   │
│   ├── driver-safety.html
│   │   └── AI driver safety interface
│   │
│   ├── css/
│   │   └── style.css
│   │       └── Global styling and animations
│   │
│   ├── js/
│   │   ├── dashboard.js
│   │   │   └── Dashboard API and UI logic
│   │   │
│   │   ├── chatbot.js
│   │   │   └── Charulata assistant integration
│   │   │
│   │   └── driver-safety.js
│   │       └── MediaPipe and webcam processing
│   │
│   └── images/
│       └── Static UI assets
│
├── data/
│   └── JSON-based application data
│
├── .env.example
│   └── Example configuration
│
├── requirements.txt
│   └── Python dependencies
│
└── README.md
    └── Project documentation
```

> **Note:** The exact directory names may vary depending on the current implementation. The structure above represents the recommended modular organization.

---

# 🔌 API Overview

Bonolota exposes backend functionality through REST APIs.

A conceptual API structure is:

```text
/api
│
├── /timber
│   ├── Create timber record
│   ├── Retrieve timber information
│   └── Species-related operations
│
├── /transport
│   ├── Create shipment
│   ├── Retrieve shipments
│   └── Update shipment status
│
├── /ledger
│   ├── Retrieve chain
│   ├── Add event
│   └── Verify chain
│
└── /ai
    ├── Tree detection
    └── AI-related operations
```

### Example API Flow

```text
Frontend
   │
   │ GET /api/transport/shipments
   ▼
FastAPI
   │
   ▼
Shipment Service
   │
   ▼
JSON / Application Data
   │
   ▼
JSON Response
   │
   ▼
Dashboard
```

---

# 🧠 AI Models & Data

## Tree Species Classification

| Parameter    | Value            |
| ------------ | ---------------- |
| Model        | ResNet18         |
| Framework    | PyTorch          |
| Dataset      | BarkVisionAI     |
| Classes      | 13               |
| Total Images | 36,400           |
| Input Size   | 224 × 224        |
| Model File   | `tree_model.pth` |

### Reported Model Performance

The project's model evaluation has achieved approximately:

```text
Accuracy   : 88.87%
Precision  : 0.8904
Recall     : 0.8887
F1 Score   : 0.8889
```

> Model performance depends on dataset composition, image quality, class distribution, preprocessing, and evaluation methodology.

---

# 🔐 Security & Data Integrity

Bonolota incorporates several mechanisms to improve system integrity.

## 1. SHA-256 Hashing

Important events can be hashed using SHA-256.
<img width="945" height="660" alt="image" src="https://github.com/user-attachments/assets/15161467-a382-4ba0-949c-0fe2a2192fe8" />

## 2. Previous Hash Linking

Each subsequent event can reference the previous event's hash.

## 3. Chain Verification

The system can recalculate hashes and compare them with stored values.

## 4. Tamper Detection

Unexpected changes can cause hash mismatches.

### Verification Concept

```text
Stored Event
     │
     ▼
Recalculate Hash
     │
     ▼
Compare
     │
 ┌───┴────┐
 │        │
 ▼        ▼
MATCH   MISMATCH
 │        │
 ▼        ▼
VALID   POSSIBLE
CHAIN   TAMPERING
```

This makes the ledger **tamper-evident** rather than claiming that modification is mathematically impossible.

---

# 🚀 Getting Started

## Prerequisites

Make sure the system has:

* Python 3.9 or newer
* pip
* Git
* A modern web browser
* Webcam access for the driver-safety module

For AI inference, PyTorch and the required model dependencies must be installed.

---

## 1️⃣ Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Bonolota
```

---

## 2️⃣ Create a Virtual Environment

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

---

## 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file based on:

```text
.env.example
```

Add the required configuration values used by your current deployment.

---

# ▶️ Running the Application

Start the FastAPI backend using:

```bash
uvicorn backend.main:app --reload
```

Depending on the project entry point, the command may instead be:

```bash
uvicorn main:app --reload
```

The backend will typically become available at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive documentation is available at:

```text
http://127.0.0.1:8000/docs
```

The Bonolota frontend can then be opened through the project's configured frontend serving mechanism.

---

# 🧪 Example Workflow

Consider a shipment called:

```text
Shipment ID: TT-2026-001
```

### Step 1 — Timber Registration

A timber record is created.

```text
Timber ID
Species
Origin
Quantity
Timestamp
```

### Step 2 — AI Verification

An image is provided to the tree classifier.

```text
Image
  ↓
ResNet18
  ↓
Predicted Species
  ↓
Result Stored
```

### Step 3 — Shipment Creation

The timber is assigned to a transportation shipment.

```text
Shipment
   │
   ├── Timber ID
   ├── Origin
   ├── Destination
   ├── Vehicle
   └── Route
```

### Step 4 — Journey Begins

Transportation events are recorded.

```text
Origin
  ↓
Checkpoint 1
  ↓
Checkpoint 2
  ↓
Checkpoint 3
  ↓
Destination
```

### Step 5 — Cryptographic Linking

Each event is linked to the previous event.

```text
Event 1 → Hash A

Event 2
Previous Hash = Hash A
             → Hash B

Event 3
Previous Hash = Hash B
             → Hash C
```

### Step 6 — Monitoring

The dashboard monitors:

```text
✓ Shipment
✓ Location
✓ Route
✓ Events
✓ Ledger
✓ Alerts
✓ Driver Safety
```

### Step 7 — Destination

At the final checkpoint, the complete journey can be reviewed.

```text
ORIGIN
  ↓
AI VERIFIED
  ↓
SHIPMENT CREATED
  ↓
TRANSPORT MONITORED
  ↓
EVENTS HASHED
  ↓
DESTINATION
  ↓
CHAIN VERIFIED
```

---

# 🖥️ Major Dashboard Components
<img width="1866" height="905" alt="image" src="https://github.com/user-attachments/assets/d858424d-812b-478e-a1cc-493db7647a81" />
The Bonolota dashboard is organized around several operational panels.

### 🌲 Timber Intelligence

Displays:

* Detected species
* AI prediction
* Timber information
* Species metadata

### 🚛 Shipment Control

Displays:

* Shipment ID
* Vehicle
* Origin
* Destination
* Current status
* Transportation events

### 🗺️ Journey Map

Displays:

* Route
* Checkpoints
* Current/recorded positions
* Route deviations

### ⛓️ Digital Ledger

Displays:

* Event sequence
* Hash information
* Verification status
* Chain integrity

### 👁️ Driver Safety

Displays:

* Webcam feed
* Facial landmarks
* Eye state
* Safety status
* Alerts

### 🤖 Charulata

Provides:

* Natural-language queries
* Dashboard assistance
* Logistics information
* Navigation support

---

# 🧑‍💻 Project Team & Mentorship

Bonolota was developed as an academic/internship-oriented project focusing on the intersection of:

* Artificial Intelligence
* Computer Vision
* Intelligent Logistics
* Cryptographic Data Integrity
* Supply Chain Traceability
* Human Safety Monitoring

## 👨‍🏫 Academic & Technical Mentor

**Dr. Ramen Pal**
Academic & Technical Mentor — IEEE

## 👨‍💻 Development Team

**Rounak Singha**
Lead Developer & Researcher
IEEE Project Intern

**Shobhandeb Adak**
Lead Developer & Researcher
IEEE Project Intern

---

# 🎓 Research & Academic Value

Bonolota demonstrates how multiple technologies can be integrated into a single real-world system.

### Artificial Intelligence

Used for automated tree species identification and computer-vision-based driver safety monitoring.

### Computer Vision

Used to process biological images and real-time facial landmarks.

### Cryptography

Used to provide a tamper-evident event history.

### GIS

Used to visualize transportation routes and geographic events.

### Backend Engineering

FastAPI provides a modular API layer connecting AI services, logistics data, and the frontend.

### Human-Centered Design

The dashboard transforms complex backend information into a visual interface designed for operational understanding.

---

# 📈 Project Impact

Bonolota aims to contribute to a more transparent timber transportation ecosystem by connecting **physical goods with verifiable digital events**.

The system can help demonstrate:

```text
                    TRANSPARENCY
                         ▲
                         │
                         │
SAFETY ◄────────── Bonolota ──────────► TRACEABILITY
                         │
                         │
                         ▼
                    DATA INTEGRITY
```

The platform therefore treats timber transportation not simply as a logistics problem, but as a combination of:

> **Identity + Movement + Integrity + Safety**

---

# 🛣️ Future Roadmap

Bonolota is designed with future expansion in mind.

## Phase 1 — Current Prototype

* [x] Timber registration
* [x] Shipment management
* [x] Tree species AI
* [x] SHA-256 event integrity
* [x] Interactive dashboard
* [x] Route visualization
* [x] Driver safety monitoring
* [x] Charulata AI assistant

---

## Phase 2 — Advanced Intelligence

* [ ] Improved species classification
* [ ] Confidence-based AI decisions
* [ ] Advanced route anomaly detection
* [ ] Automated waiting-time analysis
* [ ] Predictive shipment risk scoring
* [ ] Historical analytics dashboard

---

## Phase 3 — Distributed Infrastructure

Potential future integration with:

* IoT telemetry
* GPS hardware
* Smart sensors
* Secure edge devices
* Distributed ledger networks
* Role-based authentication
* Cloud synchronization

---

## Phase 4 — Large-Scale Deployment

Potential capabilities:

```text
Multiple Forests
      ↓
Multiple Transporters
      ↓
Multiple Warehouses
      ↓
Multiple Processing Facilities
      ↓
Centralized Monitoring
      ↓
Complete Supply-Chain Visibility
```

---

# ⚠️ Current Limitations

As an academic prototype, Bonolota has several practical limitations.

### AI Accuracy

Tree species classification depends heavily on:

* Image quality
* Lighting
* Camera angle
* Bark appearance
* Dataset diversity

### Driver Safety

Computer-vision-based drowsiness detection should be treated as an **assistive safety mechanism**, not as a replacement for professional safety systems.

### GPS / Telemetry

The accuracy of transportation monitoring depends on the quality and availability of location data.

### Cryptographic Ledger

The current architecture provides **tamper evidence and integrity verification**, but does not provide the decentralized consensus properties of a public blockchain.

### External Information

Species information retrieved from external knowledge services may depend on network availability and third-party API responses.

---

# 🔮 Long-Term Vision

The long-term vision of Bonolota is to evolve from a project prototype into a comprehensive **AI-assisted timber traceability platform**.

A future version could connect:

```text
🌲 Forest
   │
   ▼
🌿 AI Verification
   │
   ▼
📦 Timber Registration
   │
   ▼
🚛 Smart Transportation
   │
   ├──── GPS
   ├──── Driver Safety
   ├──── Route Monitoring
   └──── Event Logging
   │
   ▼
🏭 Processing Facility
   │
   ▼
🔐 Verified Digital History
   │
   ▼
📊 Supply Chain Analytics
```

The ultimate goal is to make every major stage of timber movement **observable, traceable, and auditable**.

---

# 🏆 Why Bonolota?

Bonolota is not just a timber tracking application.

It combines several domains into a single intelligent ecosystem:

| Challenge               | Bonolota Approach      |
| ----------------------- | ------------------------- |
| 🌿 Species verification | ResNet18 AI               |
| 📦 Shipment tracking    | Digital logistics records |
| 🗺️ Route monitoring    | Leaflet + OpenStreetMap   |
| 🔐 Data integrity       | SHA-256 hash chaining     |
| 🚨 Anomaly awareness    | Rule-based monitoring     |
| 👁️ Driver safety       | MediaPipe computer vision |
| 🤖 Operator interaction | Charulata AI Assistant         |
| 📊 Data visibility      | Centralized dashboard     |

This integration is what makes Bonolota a **multi-domain intelligent logistics platform** rather than a conventional CRUD-based shipment application.

---

# 🙏 Acknowledgements

We acknowledge the open-source communities and technologies that made this project possible, including:

* PyTorch
* Torchvision
* FastAPI
* Uvicorn
* Google MediaPipe
* Leaflet.js
* OpenStreetMap
* Python
* Wikipedia REST API

We also acknowledge the academic mentorship and guidance received during the development of the project.

---

# 📜 License

This project was developed as an **academic/internship project**.

The repository and its components are intended primarily for:

* Educational demonstration
* Research experimentation
* Academic presentation
* Prototype development

Before using the project commercially, verify the licensing requirements of the individual datasets, models, libraries, APIs, and external services used by the implementation.

---

# 🌿 BONOLATA

### **From Forest to Destination — Every Journey Should Be Verifiable.**

<p align="center">

**AI • Cryptography • Logistics • Safety • Traceability**

</p>

<p align="center">

🌲 **Protect the Timber.**
🚛 **Monitor the Journey.**
🔐 **Preserve the Record.**
👁️ **Protect the Driver.**

</p>

---

## ⭐ Project Concept in One Line

> **Bonolota is an AI-powered, cryptographically verifiable timber supply-chain platform that connects species identification, shipment tracking, transportation monitoring, driver safety, and digital chain-of-custody into one intelligent system.**

---
