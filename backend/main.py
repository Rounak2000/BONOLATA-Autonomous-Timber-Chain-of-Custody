import os
from contextlib import asynccontextmanager # <-- NEW IMPORT
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

# Your existing routers
from backend.routes import timber_routes
from backend.routes import verification_routes
from backend.routes import blockchain_routes
from backend.routes import transfer_routes
from backend.routes import processing_routes
from backend.routes import transport_routes
from backend.routes import shipment_routes
from backend.routes import checkpoint_routes
from backend.routes import trace_routes
from backend.routes import alert_routes
from backend.chatbot.router import router as chatbot_router
from backend.routes.driver_safety_routes import router as driver_safety_router

# --- AI TREE DETECTION SERVICE ---
from backend.services.tree_detector import load_tree_model, predict_tree_species

# --- NEW: MODERN LIFESPAN CONTEXT MANAGER ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic: Load the PyTorch model once
    load_tree_model()
    
    yield # The app runs while yielded
    
    # Optional: Shutdown logic (e.g., clearing memory/closing DBs) would go here

# Pass the lifespan to the FastAPI app initialization
app = FastAPI(title="TimberTrust API", lifespan=lifespan)


# Enable CORS (Existing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect all your existing routers
app.include_router(chatbot_router)
app.include_router(timber_routes.router)
app.include_router(verification_routes.router)
app.include_router(blockchain_routes.router)
app.include_router(transfer_routes.router)
app.include_router(processing_routes.router)
app.include_router(transport_routes.router)
app.include_router(shipment_routes.router)
app.include_router(checkpoint_routes.router)
app.include_router(trace_routes.router)
app.include_router(alert_routes.router)
app.include_router(driver_safety_router)

# --- AI TREE DETECTION ENDPOINT ---
@app.post("/api/tree/detect")
async def detect_tree(file: UploadFile = File(...)):
    # Basic validation to ensure an image was uploaded
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
    
    try:
        contents = await file.read()
        result = predict_tree_species(contents)
        
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error", "Unknown processing error"))
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


# --- HOST THE FRONTEND (Existing) ---
@app.get("/")
def read_root():
    return RedirectResponse(url="/dashboard.html")

frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")