import os
import json
from typing import List, Dict, Tuple
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

class DocumentProcessor:
    """Reads Markdown files and splits them into semantic chunks."""
    
    def __init__(self, docs_dir: str = "docs"):
        self.docs_dir = docs_dir

    def load_documents(self) -> List[Dict]:
        """Reads all .md files from the docs directory."""
        documents = []
        if not os.path.exists(self.docs_dir):
            print(f"Warning: Directory '{self.docs_dir}' not found.")
            return documents

        for filename in os.listdir(self.docs_dir):
            if filename.endswith(".md"):
                filepath = os.path.join(self.docs_dir, filename)
                with open(filepath, "r", encoding="utf-8") as f:
                    text = f.read()
                    documents.append({
                        "text": text,
                        "metadata": {
                            "source": filename,
                            "module": filename.replace(".md", "")
                        }
                    })
        return documents

    def chunk_documents(self, documents: List[Dict], chunk_size: int = 600) -> List[Dict]:
        """Splits documents into smaller chunks, preserving paragraph breaks."""
        chunks = []
        for doc in documents:
            text = doc["text"]
            metadata = doc["metadata"]
            
            paragraphs = text.split("\n\n")
            
            current_chunk = ""
            for para in paragraphs:
                para = para.strip()
                if not para:
                    continue
                    
                if len(current_chunk) + len(para) <= chunk_size:
                    current_chunk += para + "\n\n"
                else:
                    if current_chunk:
                        chunks.append({"text": current_chunk.strip(), "metadata": metadata.copy()})
                    current_chunk = para + "\n\n"
                    
            if current_chunk:
                chunks.append({"text": current_chunk.strip(), "metadata": metadata.copy()})
                
        return chunks


class EmbeddingEngine:
    """Converts text into numerical vector embeddings."""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def get_embedding(self, text: str):
        """Generates a single vector for a string of text."""
        return self.model.encode(text)

    def get_embeddings(self, texts: List[str]):
        """Generates vectors for a list of strings."""
        return self.model.encode(texts)


class VectorStore:
    """Manages the FAISS index and stores metadata/text mappings on disk."""
    
    def __init__(self, store_dir: str = "vector_store", dimension: int = 384):
        self.store_dir = store_dir
        self.dimension = dimension
        self.index_path = os.path.join(store_dir, "index.faiss")
        self.metadata_path = os.path.join(store_dir, "metadata.json")
        
        self.index = faiss.IndexFlatL2(dimension)
        self.chunks_data = []

    def build_and_save(self, chunks: List[Dict], embeddings: np.ndarray):
        """Builds the FAISS index and saves index and metadata to disk."""
        os.makedirs(self.store_dir, exist_ok=True)
        
        embeddings_np = np.array(embeddings).astype('float32')
        self.index = faiss.IndexFlatL2(self.dimension)
        self.index.add(embeddings_np)
        self.chunks_data = chunks

        faiss.write_index(self.index, self.index_path)
        with open(self.metadata_path, "w", encoding="utf-8") as f:
            json.dump(self.chunks_data, f, indent=2)

    def load(self) -> bool:
        """Loads index and metadata from disk if available."""
        if not os.path.exists(self.index_path) or not os.path.exists(self.metadata_path):
            return False

        try:
            self.index = faiss.read_index(self.index_path)
            with open(self.metadata_path, "r", encoding="utf-8") as f:
                self.chunks_data = json.load(f)
            return True
        except Exception as e:
            print(f"Error loading vector store: {e}")
            return False

    def search(self, query_vector: np.ndarray, top_k: int = 3) -> List[Tuple[Dict, float]]:
        """Searches the index for top_k nearest chunks and returns chunk data with distance scores."""
        if self.index.ntotal == 0:
            return []
            
        # Ensure correct shape and type for FAISS
        query_vector_np = np.array([query_vector]).astype('float32')
        
        # FAISS search returns distances and indices
        distances, indices = self.index.search(query_vector_np, top_k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(self.chunks_data):
                chunk = self.chunks_data[idx]
                dist = float(distances[0][i])
                results.append((chunk, dist))
                
        return results


# --- NEW IN PHASE 7 ---
class RAGRetriever:
    """High-level class for querying the TimberTrust knowledge base."""
    
    def __init__(self, store_dir: str = "vector_store"):
        self.embedder = EmbeddingEngine()
        self.vector_store = VectorStore(store_dir=store_dir, dimension=384)
        
        if not self.vector_store.load():
            print(f"[*] Vector store not found in '{store_dir}'. Please run 'python ingest.py' first.")

    def retrieve(self, query: str, top_k: int = 2, distance_threshold: float = 1.5) -> List[Dict]:
        """Retrieves context chunks relevant to the query. Returns empty list if confidence is low."""
        if self.vector_store.index.ntotal == 0:
            return []
            
        query_vector = self.embedder.get_embedding(query)
        search_results = self.vector_store.search(query_vector, top_k=top_k)
        
        relevant_chunks = []
        for chunk, dist in search_results:
            # Lower distance means higher semantic similarity
            if dist <= distance_threshold:
                chunk_copy = chunk.copy()
                chunk_copy["distance"] = round(dist, 4)
                relevant_chunks.append(chunk_copy)
                
        return relevant_chunks