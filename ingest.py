import os
from backend.chatbot.rag import DocumentProcessor, EmbeddingEngine, VectorStore

def build_knowledge_index():
    print("=" * 60)
    print(" TIMBERTRUST - PHASE 6: VECTOR STORE INGESTION & INDEXING")
    print("=" * 60)
    
    # 1. Load and process Markdown docs
    processor = DocumentProcessor(docs_dir="docs")
    docs = processor.load_documents()
    print(f"[+] Loaded {len(docs)} Markdown documents from 'docs/'.")
    
    chunks = processor.chunk_documents(docs, chunk_size=500)
    print(f"[+] Processed documents into {len(chunks)} semantic chunks.")
    
    # 2. Extract texts and generate embeddings
    embedder = EmbeddingEngine()
    texts = [chunk['text'] for chunk in chunks]
    
    print(f"[*] Generating vector embeddings for {len(texts)} chunks...")
    embeddings = embedder.get_embeddings(texts)
    
    # 3. Save to FAISS Vector Store
    vector_store = VectorStore(store_dir="vector_store", dimension=384)
    vector_store.build_and_save(chunks, embeddings)
    
    # 4. Verify Index Load
    verification_store = VectorStore(store_dir="vector_store", dimension=384)
    if verification_store.load():
        print(f"\n[+] Index verification successful! Total vectors stored: {verification_store.index.ntotal}")
    else:
        print("\n[!] Index verification failed.")

    print("\n" + "=" * 60)
    print(" SUCCESS: Phase 6 Vector Store Created Successfully!")
    print("=" * 60)

if __name__ == "__main__":
    build_knowledge_index()