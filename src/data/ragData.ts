import type { RagTypeData, RagTypeKey } from '../types';

export const RAG_TYPES_LIST: { id: RagTypeKey; name: string; iconName: string }[] = [
  { id: 'native', name: 'Native RAG', iconName: 'Home' },
  { id: 'advanced', name: 'Advanced RAG', iconName: 'Sparkles' },
  { id: 'modular', name: 'Modular RAG', iconName: 'Boxes' },
  { id: 'graph', name: 'Graph RAG', iconName: 'Network' },
  { id: 'hybrid', name: 'Hybrid RAG', iconName: 'Shuffle' },
  { id: 'agentic', name: 'Agentic RAG', iconName: 'Bot' },
  { id: 'corrective', name: 'Corrective RAG', iconName: 'ShieldCheck' },
  { id: 'self', name: 'Self-RAG', iconName: 'RefreshCw' },
  { id: 'adaptive', name: 'Adaptive RAG', iconName: 'Sliders' },
  { id: 'multimodal', name: 'Multimodal RAG', iconName: 'Image' },
];

export const RAG_DATA_MAP: Record<RagTypeKey, RagTypeData> = {
  native: {
    id: 'native',
    name: 'Native RAG',
    iconName: 'Home',
    shortDesc: 'Standard embedding retrieval + prompt generation',
    fullDesc:
      'Native RAG is the standard approach where your query retrieves relevant information from a vector database and uses it to generate accurate, grounded responses.',
    bannerTitle: 'Explore RAG',
    bannerSubtitle:
      'Upload a document or choose a RAG type to learn how it works, with step-by-step explanation, architecture and real-world use cases.',
    steps: [
      { step: 1, title: 'Upload Document', iconName: 'FileUp' },
      { step: 2, title: 'Search Similar Info', iconName: 'Search' },
      { step: 3, title: 'Retrieve Relevant Docs', iconName: 'FileText' },
      { step: 4, title: 'Generate Answer', iconName: 'Check', isCompleted: true },
    ],
    benefits: [
      { title: 'More Relevant Answers', iconName: 'Target' },
      { title: 'Handles Complex Queries', iconName: 'Zap' },
      { title: 'Higher Accuracy', iconName: 'CheckCircle2' },
      { title: 'Real-World Use Cases', iconName: 'BarChart3' },
    ],
    sampleQuestions: [
      'What are the core limitations of Native RAG with large documents?',
      'How does chunking size impact retrieval accuracy in Native RAG?',
      'Which embedding models perform best for semantic search?',
      'How to measure cosine similarity between query and vector store chunks?',
    ],
    architectureDetails: {
      overview:
        'Native RAG (Naive RAG) indexes documents into vector embeddings. When a user sends a query, it computes cosine similarity, retrieves top-k chunks, and injects them into the prompt for the LLM.',
      keyFeatures: [
        'Single-turn dense vector similarity search',
        'Direct prompt augmentation with retrieved snippets',
        'Minimal latency overhead and straightforward deployment',
      ],
      bestFor: 'Internal FAQs, static documentation lookup, and basic Q&A assistants.',
      tradeoffs: 'Prone to low precision when queries are ambiguous or require multi-hop reasoning.',
    },
  },
  advanced: {
    id: 'advanced',
    name: 'Advanced RAG',
    iconName: 'Sparkles',
    shortDesc: 'Pre-retrieval query rewriting + post-retrieval reranking',
    fullDesc:
      'Advanced RAG optimizes retrieval quality using pre-retrieval query rewriting and post-retrieval cross-encoder reranking to ensure only the most precise context reaches the LLM.',
    bannerTitle: 'Explore Advanced RAG',
    bannerSubtitle:
      'Discover query transformations, HyDE (Hypothetical Document Embeddings), and semantic reranking techniques.',
    steps: [
      { step: 1, title: 'Query Rewriting & HyDE', iconName: 'Sparkles' },
      { step: 2, title: 'Dense + Sparse Search', iconName: 'Search' },
      { step: 3, title: 'Cross-Encoder Rerank', iconName: 'Sliders' },
      { step: 4, title: 'Synthesize Response', iconName: 'Check', isCompleted: true },
    ],
    benefits: [
      { title: 'Substantially Higher Precision', iconName: 'Target' },
      { title: 'Resolves Ambiguous Queries', iconName: 'Zap' },
      { title: 'Reduces Hallucinations', iconName: 'CheckCircle2' },
      { title: 'Context Window Compression', iconName: 'BarChart3' },
    ],
    sampleQuestions: [
      'How does cross-encoder reranking improve relevance over bi-encoders?',
      'What is HyDE (Hypothetical Document Embeddings)?',
      'How can query decomposition help with multi-part questions?',
    ],
    architectureDetails: {
      overview:
        'Introduces sophisticated pre-retrieval (query routing, sub-queries, expansion) and post-retrieval (reranking, context compression, contextual sentence windowing) layers.',
      keyFeatures: [
        'Query Expansion & Rewriting',
        'Cross-Encoder Reranking (Cohere Rerank, BGE-Reranker)',
        'Contextual Compression to reduce token waste',
      ],
      bestFor: 'Complex enterprise search, technical documentation, legal contracts.',
      tradeoffs: 'Slightly higher latency due to reranking and multi-step inference.',
    },
  },
  modular: {
    id: 'modular',
    name: 'Modular RAG',
    iconName: 'Boxes',
    shortDesc: 'Decoupled, interchangeable modules for retrieval, routing & generation',
    fullDesc:
      'Modular RAG breaks the pipeline into independent plug-and-play modules (retrieval, routing, memory, fusion, and validation) allowing customized enterprise workflows.',
    bannerTitle: 'Explore Modular RAG',
    bannerSubtitle:
      'Configure specialized micro-modules for indexing, search routing, memory orchestration, and output alignment.',
    steps: [
      { step: 1, title: 'Dynamic Intent Router', iconName: 'Boxes' },
      { step: 2, title: 'Multi-Source Retrieval', iconName: 'Search' },
      { step: 3, title: 'Memory & Context Fusion', iconName: 'FileText' },
      { step: 4, title: 'Modular Generation', iconName: 'Check', isCompleted: true },
    ],
    benefits: [
      { title: 'Flexible Architecture', iconName: 'Target' },
      { title: 'Multi-Source Integration', iconName: 'Zap' },
      { title: 'Independent Scaling', iconName: 'CheckCircle2' },
      { title: 'Customizable Pipelines', iconName: 'BarChart3' },
    ],
    sampleQuestions: [
      'How does Modular RAG differ from classical monolithic RAG pipelines?',
      'Can modules be swapped dynamically at runtime based on query intent?',
    ],
    architectureDetails: {
      overview:
        'Breaks monolithic RAG into reconfigurable modules such as Search Module, Memory Module, Fusion Module, and Routing Module.',
      keyFeatures: ['Plug-and-play components', 'Orchestration graphs', 'Hybrid source integration'],
      bestFor: 'Large enterprise platforms with diverse knowledge sources and APIs.',
      tradeoffs: 'Requires more architectural coordination and pipeline monitoring.',
    },
  },
  graph: {
    id: 'graph',
    name: 'Graph RAG',
    iconName: 'Network',
    shortDesc: 'Knowledge graphs + vector search for interconnected reasoning',
    fullDesc:
      'Graph RAG marries vector retrieval with structured knowledge graphs, connecting entities, communities, and relationships for deep multi-hop reasoning.',
    bannerTitle: 'Explore Graph RAG',
    bannerSubtitle:
      'Extract entities, build relationship graphs, and navigate multi-hop queries across extensive document collections.',
    steps: [
      { step: 1, title: 'Entity & Triple Extraction', iconName: 'Network' },
      { step: 2, title: 'Community Clustering', iconName: 'Search' },
      { step: 3, title: 'Graph Traversal Retrieval', iconName: 'FileText' },
      { step: 4, title: 'Holistic Synthesis', iconName: 'Check', isCompleted: true },
    ],
    benefits: [
      { title: 'Multi-Hop Reasoning', iconName: 'Target' },
      { title: 'Global Dataset Insights', iconName: 'Zap' },
      { title: 'Explicit Entity Tracking', iconName: 'CheckCircle2' },
      { title: 'Eliminates Lost-in-Middle', iconName: 'BarChart3' },
    ],
    sampleQuestions: [
      'How does Microsoft GraphRAG extract community summaries?',
      'When should I choose Graph RAG over standard vector similarity search?',
      'How are entity relationships extracted from unstructured text?',
    ],
    architectureDetails: {
      overview:
        'Builds a knowledge graph from text documents, identifies communities of related concepts, and answers global, high-level dataset synthesis questions.',
      keyFeatures: ['Entity-relationship extraction', 'Hierarchical community summarization', 'Multi-hop graph traversal'],
      bestFor: 'Investigative intelligence, research synthesis, complex corporate knowledgebases.',
      tradeoffs: 'High indexing cost and token requirements during the graph extraction stage.',
    },
  },
  hybrid: {
    id: 'hybrid',
    name: 'Hybrid RAG',
    iconName: 'Shuffle',
    shortDesc: 'Combines dense semantic vectors with sparse keyword BM25',
    fullDesc:
      'Hybrid RAG blends dense vector embeddings with sparse keyword search (BM25) via Reciprocal Rank Fusion (RRF) for the best of both worlds.',
    bannerTitle: 'Explore Hybrid RAG',
    bannerSubtitle:
      'Never miss exact serial numbers, product codes, or semantic synonyms with fused dense-sparse retrieval.',
    steps: [
      { step: 1, title: 'Dense & Sparse Indexing', iconName: 'Shuffle' },
      { step: 2, title: 'Parallel Dual Search', iconName: 'Search' },
      { step: 3, title: 'Reciprocal Rank Fusion (RRF)', iconName: 'FileText' },
      { step: 4, title: 'Fused Generation', iconName: 'Check', isCompleted: true },
    ],
    benefits: [
      { title: 'Catches Exact Keyword Matches', iconName: 'Target' },
      { title: 'Retains Deep Semantic Meaning', iconName: 'Zap' },
      { title: 'Robust Across Query Styles', iconName: 'CheckCircle2' },
      { title: 'Production-Proven Reliability', iconName: 'BarChart3' },
    ],
    sampleQuestions: [
      'How does Reciprocal Rank Fusion (RRF) calculate final chunk weights?',
      'Why does dense vector search often fail on product SKUs and error codes?',
    ],
    architectureDetails: {
      overview:
        'Runs two retrieval engines simultaneously: a BM25 sparse keyword engine and an embedding-based dense vector engine, merging results with RRF.',
      keyFeatures: ['BM25 keyword search', 'Dense neural embeddings', 'Score fusion algorithms (RRF/convex)'],
      bestFor: 'E-commerce catalogs, codebases, error logs, and medical registries.',
      tradeoffs: 'Dual storage index footprint and dual query execution.',
    },
  },
  agentic: {
    id: 'agentic',
    name: 'Agentic RAG',
    iconName: 'Bot',
    shortDesc: 'Autonomous multi-step reasoning, tool execution & self-direction',
    fullDesc:
      'Agentic RAG uses autonomous AI agents to plan search strategies, call specialized tools, evaluate retrieved documents, and iteratively resolve complex questions.',
    bannerTitle: 'Explore Agentic RAG',
    bannerSubtitle:
      'Equip LLMs with planning loops, tool calling, multi-step sub-query decomposition, and dynamic decision-making.',
    steps: [
      { step: 1, title: 'Query Plan & Tool Selection', iconName: 'Bot' },
      { step: 2, title: 'Iterative Retrieval Loops', iconName: 'Search' },
      { step: 3, title: 'Evidence Reflection & Validation', iconName: 'FileText' },
      { step: 4, title: 'Final Agent Synthesis', iconName: 'Check', isCompleted: true },
    ],
    benefits: [
      { title: 'Multi-Step Problem Solving', iconName: 'Target' },
      { title: 'External Tool Integration', iconName: 'Zap' },
      { title: 'Self-Correction & Reflection', iconName: 'CheckCircle2' },
      { title: 'Autonomous Workflows', iconName: 'BarChart3' },
    ],
    sampleQuestions: [
      'How do ReAct agents formulate tool-calling strategies during retrieval?',
      'How does Agentic RAG handle missing or conflicting retrieved documents?',
    ],
    architectureDetails: {
      overview:
        'The LLM acts as an autonomous agent with tools: vector search, web search, calculator, SQL query engine. It breaks queries down and iterates until satisfied.',
      keyFeatures: ['Planning and reflection loops', 'Dynamic tool routing', 'Self-evaluation of sufficiency'],
      bestFor: 'Complex research tasks, financial audits, multi-hop investigation.',
      tradeoffs: 'Variable latency and higher cost due to multiple LLM reasoning cycles.',
    },
  },
  corrective: {
    id: 'corrective',
    name: 'Corrective RAG',
    iconName: 'ShieldCheck',
    shortDesc: 'Evaluates retrieval quality with automatic fallback web search',
    fullDesc:
      'Corrective RAG (CRAG) evaluates retrieved documents with a lightweight retrieval evaluator, refining snippets and triggering fallback web search when internal context is inadequate.',
    bannerTitle: 'Explore Corrective RAG (CRAG)',
    bannerSubtitle:
      'Ensure zero hallucinations by actively scoring document relevance and pulling live internet web search if confidence is low.',
    steps: [
      { step: 1, title: 'Vector Retrieval', iconName: 'FileUp' },
      { step: 2, title: 'Relevance Grading & Filter', iconName: 'ShieldCheck' },
      { step: 3, title: 'Web Fallback (If Ambiguous)', iconName: 'Search' },
      { step: 4, title: 'Corrected Generation', iconName: 'Check', isCompleted: true },
    ],
    benefits: [
      { title: 'Guaranteed Grounded Answers', iconName: 'Target' },
      { title: 'Automated Web Search Fallback', iconName: 'Zap' },
      { title: 'Noise & Distractor Removal', iconName: 'CheckCircle2' },
      { title: 'High Confidence Output', iconName: 'BarChart3' },
    ],
    sampleQuestions: [
      'What are the 3 evaluation outcomes in CRAG (Correct, Ambiguous, Incorrect)?',
      'How does knowledge striping extract relevant key-points from noisy chunks?',
    ],
    architectureDetails: {
      overview:
        'Employs a retrieval evaluator that categorizes retrieval confidence into Correct, Incorrect, or Ambiguous. If incorrect, it queries web search engines.',
      keyFeatures: ['Confidence score thresholds', 'Automatic web fallback', 'Knowledge striping & distillation'],
      bestFor: 'Public-facing customer support, news and current events, mission-critical Q&A.',
      tradeoffs: 'Web search dependency and API costs when internal data lacks coverage.',
    },
  },
  self: {
    id: 'self',
    name: 'Self-RAG',
    iconName: 'RefreshCw',
    shortDesc: 'Self-reflective tokens for retrieval necessity, critique & grounding',
    fullDesc:
      'Self-RAG trains models to output special reflection tokens determining on-demand retrieval necessity, critique relevance, and verify whether generation is grounded in facts.',
    bannerTitle: 'Explore Self-RAG',
    bannerSubtitle:
      'Learn how special reflection tokens [Retrieve], [IsRel], [IsSup], and [IsUse] guide selective retrieval.',
    steps: [
      { step: 1, title: 'Evaluate Retrieval Necessity', iconName: 'RefreshCw' },
      { step: 2, title: 'Parallel Segment Retrieval', iconName: 'Search' },
      { step: 3, title: 'Critique & Grounding Tokens', iconName: 'FileText' },
      { step: 4, title: 'Beam Search Best Path', iconName: 'Check', isCompleted: true },
    ],
    benefits: [
      { title: 'Selective On-Demand Retrieval', iconName: 'Target' },
      { title: 'Self-Critique Verification', iconName: 'Zap' },
      { title: 'Factual Citation Grounding', iconName: 'CheckCircle2' },
      { title: 'Zero Unnecessary Latency', iconName: 'BarChart3' },
    ],
    sampleQuestions: [
      'What are reflection tokens in Self-RAG and how are they supervised?',
      'How does Self-RAG decide NOT to retrieve for generic questions?',
    ],
    architectureDetails: {
      overview:
        'A single model trained to generate critique tokens alongside text: [Retrieve=yes/no], [IsRel=relevant], [IsSup=supported], [IsUse=utility score].',
      keyFeatures: ['On-demand selective retrieval', 'Self-critique scoring', 'Beam search path selection'],
      bestFor: 'Fine-tuned specialized models needing autonomous grounding verification.',
      tradeoffs: 'Requires fine-tuning with reflection token vocabulary or prompt overhead.',
    },
  },
  adaptive: {
    id: 'adaptive',
    name: 'Adaptive RAG',
    iconName: 'Sliders',
    shortDesc: 'Dynamically routes query complexity to optimal RAG strategies',
    fullDesc:
      'Adaptive RAG classifies user queries by complexity, dynamically choosing between direct LLM response, single-step Native RAG, or multi-step iterative RAG.',
    bannerTitle: 'Explore Adaptive RAG',
    bannerSubtitle:
      'Optimize cost and latency by routing simple queries to instant response and complex queries to multi-hop pipelines.',
    steps: [
      { step: 1, title: 'Query Complexity Classifier', iconName: 'Sliders' },
      { step: 2, title: 'Dynamic Strategy Routing', iconName: 'Boxes' },
      { step: 3, title: 'Targeted Retrieval Pipeline', iconName: 'Search' },
      { step: 4, title: 'Optimized Synthesis', iconName: 'Check', isCompleted: true },
    ],
    benefits: [
      { title: 'Optimal Cost-to-Performance', iconName: 'Target' },
      { title: 'Lowest Latency on Easy Tasks', iconName: 'Zap' },
      { title: 'Deep Power for Hard Queries', iconName: 'CheckCircle2' },
      { title: 'Smart Resource Allocation', iconName: 'BarChart3' },
    ],
    sampleQuestions: [
      'How is query complexity classified in Adaptive RAG (inductive vs factoid)?',
      'What is the token cost savings of routing simple queries without retrieval?',
    ],
    architectureDetails: {
      overview:
        'Uses an agile classifier (small LLM or classifier) to estimate question hardness: simple factual queries get Native RAG; complex queries get multi-step RAG.',
      keyFeatures: ['Tiered routing hierarchy', 'Dynamic strategy selection', 'Cost & latency optimization'],
      bestFor: 'High-throughput enterprise AI apps with wide variance in query complexity.',
      tradeoffs: 'Requires maintaining classifier accuracy to avoid misrouting.',
    },
  },
  multimodal: {
    id: 'multimodal',
    name: 'Multimodal RAG',
    iconName: 'Image',
    shortDesc: 'Processes diagrams, screenshots, tables and audio alongside text',
    fullDesc:
      'Multimodal RAG ingests diagrams, charts, infographics, tables, and documents, retrieving both visual and text modalities to answer visual questions.',
    bannerTitle: 'Explore Multimodal RAG',
    bannerSubtitle:
      'Extract text from complex layout PDFs, embed images with vision models like CLIP/ColPali, and answer rich visual queries.',
    steps: [
      { step: 1, title: 'Vision & Layout Parsing', iconName: 'Image' },
      { step: 2, title: 'Multimodal Embedding Search', iconName: 'Search' },
      { step: 3, title: 'Cross-Modal Context Fusion', iconName: 'FileText' },
      { step: 4, title: 'Visual Grounded Answer', iconName: 'Check', isCompleted: true },
    ],
    benefits: [
      { title: 'Understands Charts & Diagrams', iconName: 'Target' },
      { title: 'Multi-Modal Evidence Synthesis', iconName: 'Zap' },
      { title: 'Preserves Visual Layout Data', iconName: 'CheckCircle2' },
      { title: 'Rich Document Comprehension', iconName: 'BarChart3' },
    ],
    sampleQuestions: [
      'How does ColPali use visual patch embeddings for PDF page retrieval?',
      'How are tabular layouts and architectural diagrams embedded for search?',
    ],
    architectureDetails: {
      overview:
        'Indexes both text chunks and images/diagrams using vision-language embeddings (e.g. CLIP, ColPali, Gemini Vision). The multimodal LLM reasons over both images and text.',
      keyFeatures: ['Visual document parsing', 'Vision embedding indices', 'Cross-modal prompt reasoning'],
      bestFor: 'Financial reports with charts, engineering blueprints, medical imaging.',
      tradeoffs: 'Higher storage and embedding compute requirements for high-res images.',
    },
  },
};
