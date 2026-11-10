import type { RagTypeKey } from '../types';

export interface DocumentUploadResponse {
  message: string;
  details: Array<{
    filename: string;
    status: 'success' | 'error';
    chunks_created?: number;
    pages_parsed?: number;
    error?: string;
  }>;
  total_chunks: number;
  backend: string;
}

export interface DocumentInfo {
  id: string;
  filename: string;
  type: string;
  size: string;
  pages: number;
  chunks: number;
  status: string;
}

export interface DocumentsResponse {
  documents: DocumentInfo[];
  status: {
    total_chunks: number;
    backend: string;
  };
}

export interface FormattedSource {
  label: string;
  filename?: string;
  page?: string | number;
  score?: number;
  snippet?: string;
}

export interface RagResponse {
  answer: string;
  sources?: unknown[];
  mode?: string;
  advanced_metadata?: {
    expanded_queries?: string[];
    hyde_applied?: boolean;
    average_confidence?: number;
    keyword_matches_found?: number;
    candidates_evaluated?: number;
    reranked_selected?: number;
  };
  graph_metadata?: {
    seed_entities?: string[];
    nodes_traversed?: number;
    edges_traversed?: number;
    subgraph_triplets?: string[];
    depth?: number;
  };
  modular_metadata?: {
    route_decision?: { category?: string; target_retriever?: string };
    rewritten_query?: string;
    active_modules?: string[];
    pipeline_execution_log?: string[];
    faithfulness_evaluation?: { grounded: boolean; confidence: number };
  };
  corrective_metadata?: {
    action?: 'CORRECT' | 'INCORRECT' | 'AMBIGUOUS';
    decision?: string;
    correction_log?: string[];
    chunks_evaluated?: number;
    chunks_used?: number;
    fallback_triggered?: boolean;
  };
  self_rag_metadata?: {
    reflection_tokens?: string[];
    retrieve_decision?: { retrieve: boolean; reason: string };
    support_evaluation?: { token: string; supported: boolean; score: number };
    usefulness_score?: number;
    passages_retained?: number;
  };
  adaptive_metadata?: {
    complexity?: string;
    execution_strategy?: string;
    sub_queries_executed?: string[];
    execution_trace?: string[];
  };
  agentic_metadata?: {
    iterations?: number;
    scratchpad?: Array<{
      step: number;
      thought?: string;
      action?: string;
      observation?: string;
    }>;
    completed?: boolean;
  };
  multimodal_metadata?: {
    trace?: string[];
    matched_visual_assets?: Array<{ id: string; caption: string; filename: string; page: number }>;
  };
}

/**
 * Upload document to /api/upload
 */
export async function uploadDocument(file: File): Promise<DocumentUploadResponse> {
  const formData = new FormData();
  formData.append('files', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    let detail = `Upload failed (Status ${res.status})`;
    try {
      const parsed = JSON.parse(errorBody);
      detail = parsed.detail || parsed.message || detail;
    } catch {
      if (errorBody) detail = errorBody;
    }
    throw new Error(detail);
  }

  return await res.json();
}

/**
 * Fetch all indexed documents from /api/documents
 */
export async function getDocuments(): Promise<DocumentsResponse> {
  const res = await fetch('/api/documents');
  if (!res.ok) {
    throw new Error(`Failed to load documents (Status ${res.status})`);
  }
  return await res.json();
}

/**
 * Delete a document from vector index and disk
 */
export async function deleteDocument(filename: string): Promise<void> {
  const res = await fetch(`/api/documents/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete document (Status ${res.status})`);
  }
}

/**
 * Query the selected RAG pipeline endpoint
 */
export async function queryRag(ragType: RagTypeKey, query: string): Promise<RagResponse> {
  let endpoint = '/api/query';
  let body: Record<string, unknown> = { query };

  switch (ragType) {
    case 'native':
      endpoint = '/api/query';
      body = { query, mode: 'RAG: Document Search' };
      break;

    case 'advanced':
      endpoint = '/api/advanced/query';
      body = {
        query,
        use_hyde: true,
        use_multi_query: true,
        use_keyword_search: true,
        top_k: 4,
      };
      break;

    case 'hybrid':
      endpoint = '/api/advanced/query';
      body = {
        query,
        use_hyde: false,
        use_multi_query: false,
        use_keyword_search: true,
        top_k: 4,
      };
      break;

    case 'graph':
      endpoint = '/api/graph/query';
      body = { query, depth: 2, top_k: 4 };
      break;

    case 'modular':
      endpoint = '/api/modular/query';
      body = {
        query,
        enabled_modules: [
          'router',
          'rewriter',
          'vector_retriever',
          'keyword_retriever',
          'graph_retriever',
          'compressor',
          'evaluator',
        ],
        top_k: 4,
      };
      break;

    case 'corrective':
      endpoint = '/api/corrective/query';
      body = { query, correct_threshold: 0.65, incorrect_threshold: 0.35, top_k: 4 };
      break;

    case 'self':
      endpoint = '/api/self-rag/query';
      body = { query, top_k: 4 };
      break;

    case 'adaptive':
      endpoint = '/api/adaptive/query';
      body = { query, top_k: 4 };
      break;

    case 'agentic':
      endpoint = '/api/agentic/query';
      body = { query, max_iterations: 5 };
      break;

    case 'multimodal':
      endpoint = '/api/multimodal/query';
      body = { query, top_k_text: 4, top_k_visual: 3 };
      break;

    default:
      endpoint = '/api/query';
      body = { query, mode: 'RAG: Document Search' };
      break;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    let detail = `RAG query failed (${res.status} ${res.statusText})`;
    try {
      const parsed = JSON.parse(errorBody);
      detail = parsed.detail || parsed.message || detail;
    } catch {
      if (errorBody) detail = errorBody;
    }
    throw new Error(detail);
  }

  return await res.json();
}

/**
 * Format raw source objects from various RAG engines into unified displayable sources
 */
export function formatSources(rawSources?: unknown[]): FormattedSource[] {
  if (!rawSources || !Array.isArray(rawSources)) return [];

  return rawSources.map((item, idx) => {
    if (typeof item === 'string') {
      return { label: item };
    }

    if (item && typeof item === 'object') {
      const obj = item as Record<string, unknown>;

      // Native style
      if (obj.filename && obj.pages) {
        return {
          label: `${obj.filename} (${obj.pages})`,
          filename: String(obj.filename),
          page: String(obj.pages),
          snippet: Array.isArray(obj.snippets) ? String(obj.snippets[0]) : undefined,
        };
      }

      // Advanced/Self/Corrective style
      if (obj.filename && (obj.page !== undefined || obj.page !== null)) {
        const score = typeof obj.relevance_score === 'number'
          ? obj.relevance_score
          : typeof obj.eval_score === 'number'
          ? obj.eval_score
          : undefined;

        return {
          label: `${obj.filename} (Page ${obj.page})${score ? ` • ${(score * 100).toFixed(0)}% match` : ''}`,
          filename: String(obj.filename),
          page: Number(obj.page),
          score,
          snippet: typeof obj.snippet === 'string' ? obj.snippet : undefined,
        };
      }

      // Agentic style
      if (obj.tool) {
        return {
          label: `Tool: ${obj.tool} [${obj.query || ''}]`,
          snippet: typeof obj.preview === 'string' ? obj.preview : undefined,
        };
      }

      if (obj.label) {
        return { label: String(obj.label) };
      }
    }

    return { label: `Source ${idx + 1}` };
  });
}
