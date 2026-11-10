# Rag Expo

**Explore • Learn • Experience Full-Stack RAG Architectures**

A full-stack AI Assistant application connecting a React + TypeScript frontend with a FastAPI backend supporting 10 distinct Retrieval-Augmented Generation (RAG) paradigms backed by PostgreSQL (`pgvector`) / local vector store and Groq LLMs.

---

## Supported RAG Architectures

1. **Native RAG**: Standard dense vector similarity search and prompt augmentation (`POST /api/query`).
2. **Advanced RAG**: Multi-query expansion, HyDE (Hypothetical Document Embeddings), deduplication, and semantic re-ranking (`POST /api/advanced/query`).
3. **Hybrid RAG**: Combines dense vector similarity with sparse keyword matching (`POST /api/advanced/query` with keyword search).
4. **Graph RAG**: Entity linking, relationship extraction, and multi-hop subgraph traversal (`POST /api/graph/query`).
5. **Modular RAG**: Decoupled routing, query rewriting, multiple retrievers, context compression, and faithfulness evaluator (`POST /api/modular/query`).
6. **Corrective RAG (CRAG)**: Retrieval grading (CORRECT / INCORRECT / AMBIGUOUS), context strip refinement, and fallback generation (`POST /api/corrective/query`).
7. **Self-RAG**: Dynamic retrieval triggers and self-reflective critique tokens `[Retrieve]`, `[IsRel]`, `[IsSup]`, `[IsUse]` (`POST /api/self-rag/query`).
8. **Adaptive RAG**: Query complexity classification (Tier 1: Direct, Tier 2: Single-step, Tier 3: Multi-step decomposition) (`POST /api/adaptive/query`).
9. **Agentic RAG**: Autonomous ReAct loop with document search, keyword lookup, and calculation tools (`POST /api/agentic/query`).
10. **Multimodal RAG**: Simultaneous textual retrieval and visual asset diagram/figure matching (`POST /api/multimodal/query`).

---

## Project Structure

```
Rag_Expo/
├── backend/                     # FastAPI RAG Backend
│   ├── adaptive_rag_engine.py
│   ├── advanced_rag_engine.py
│   ├── agentic_rag_engine.py
│   ├── corrective_rag_engine.py
│   ├── graph_rag_engine.py
│   ├── modular_rag_engine.py
│   ├── multimodal_rag_engine.py
│   ├── postgres_store.py        # PostgreSQL + pgvector store
│   ├── rag_engine.py            # Unified Vector Store & Native RAG
│   ├── self_rag_engine.py
│   ├── config.py
│   ├── main.py                  # FastAPI server endpoints
│   ├── requirements.txt
│   └── data/                    # Knowledge graph & document storage
├── src/                         # React + Vite Frontend
│   ├── components/              # ChatCard, UploadModal, RagTabs, Sidebar, Header
│   ├── services/
│   │   └── api.ts               # Full-stack API integration for all 10 RAG types
│   ├── data/                    # RAG architecture definitions & metadata
│   ├── types.ts                 # TypeScript interfaces
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── package.json
└── vite.config.ts               # Vite dev server with /api proxy to FastAPI (port 8000)
```

---

## Running the Application

### 1. Start the Backend API Server
```bash
# Using the npm backend shortcut:
npm run backend

# Or directly with Python:
uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Start the Frontend Development Server
```bash
npm run dev
```
- App UI: [http://localhost:5173](http://localhost:5173)

---

## Document Ingestion & Database Storage

- Click the paperclip or **Upload Document** button in the chat interface.
- Upload `.pdf`, `.docx`, `.txt`, `.md`, or `.csv` files.
- The document is automatically chunked, embedded via `SentenceTransformer`, indexed into PostgreSQL `pgvector` (or fallback file store), and parsed into the knowledge graph.
- Select any of the 10 RAG architectures from the top tabs to query your uploaded documents in real-time.
