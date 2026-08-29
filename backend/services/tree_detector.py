import torch
import torch.nn.functional as F
from torchvision import transforms, models
from PIL import Image
import io
import os
import logging

MODEL_PATH = "tree_model.pth"

# =====================================================================
# Exact 13 botanical classes from your working Flask application
# =====================================================================
CLASSES = [
    "Aesculus indica",
    "Buchanania lanzan",
    "Cedrus deodara",
    "Eucalyptus globulus",
    "Madhuca longifolia",
    "Mangifera sylvatica",
    "Phyllanthus emblica",
    "Pinus roxburghii",
    "Quercus leucotrichophora",
    "Rhododendron arboreum",
    "Senegalia catechu",
    "Shorea robusta",
    "Taxus baccata"
]

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = None

def load_tree_model():
    global model
    if not os.path.exists(MODEL_PATH):
        logging.warning(f"Model file {MODEL_PATH} not found. AI Detection disabled.")
        return

    try:
        # 1. Instantiate the standard ResNet18 (matches the saved weights)
        model = models.resnet18(weights=None)
        
        # 2. Modify the final layer for 13 classes
        num_ftrs = model.fc.in_features
        model.fc = torch.nn.Linear(num_ftrs, len(CLASSES))
        
        # 3. Load the raw state_dict (just like your Flask app)
        state_dict = torch.load(MODEL_PATH, map_location=device)
        model.load_state_dict(state_dict)
        
        model.to(device)
        model.eval() # Set to evaluation mode
        
        logging.info("🌳 AI Tree Species Detection model loaded successfully.")
    except Exception as e:
        logging.error(f"Failed to load tree model: {e}")
        model = None

def predict_tree_species(image_bytes: bytes):
    if model is None:
        return {"success": False, "error": "AI Model is currently offline or missing."}

    try:
        # 4. Exact transforms from your Flask app (No Normalization!)
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor()
        ])

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(tensor)
            probabilities = F.softmax(outputs[0], dim=0)
            confidence, predicted_idx = torch.max(probabilities, 0)

        predicted_class = CLASSES[predicted_idx.item()]
        conf_percent = round(confidence.item() * 100, 2)

        return {
            "success": True,
            "predicted_tree": predicted_class,
            "confidence": conf_percent
        }
    except Exception as e:
        return {"success": False, "error": f"Image processing failed: {str(e)}"}