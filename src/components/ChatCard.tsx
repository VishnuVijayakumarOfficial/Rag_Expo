import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Trash2,
  Paperclip,
  Send,
  Sparkles,
  Bot,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import robotImg from '../assets/robot.png';
import type { RagTypeData, ChatMessage, RagTypeKey } from '../types';

interface ChatCardProps {
  currentRag: RagTypeData;
  onOpenUpload: () => void;
  onSelectRagType: (ragId: RagTypeKey) => void;
}

export const ChatCard: React.FC<ChatCardProps> = ({
  currentRag,
  onOpenUpload,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const defaultPromptChips = [
    { label: `Explain ${currentRag.name}`, query: `Explain what ${currentRag.name} is and how it works step-by-step.` },
    { label: 'What is Graph RAG?', query: 'What is Graph RAG and when should I use knowledge graphs instead of vector search?' },
    { label: 'Compare RAG types', query: 'Compare Native RAG vs Advanced RAG vs Modular RAG in terms of performance, cost, and complexity.' },
    { label: 'Give real-world examples', query: `Give me 3 realistic enterprise production examples of ${currentRag.name}.` },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate smart AI response
    setTimeout(() => {
      let botResponse = '';
      let sources: string[] = [];

      if (text.toLowerCase().includes('native rag') || text.toLowerCase().includes('standard')) {
        botResponse = `**Native RAG (Naive RAG)** follows a direct retrieval-augmented generation loop:\n\n1. **Document Chunking & Ingestion**: Source documents are split into manageable token chunks (e.g., 512 tokens) and converted into vector embeddings.\n2. **Vector Similarity Query**: When a user queries, cosine similarity retrieves the top-k nearest chunks from vector stores like Pinecone, Milvus, or Chroma.\n3. **Augmented Prompt**: The retrieved context chunks are directly concatenated into the system prompt with the question.\n4. **LLM Generation**: The model synthesizes an answer strictly grounded in the provided snippets.`;
        sources = ['rag_handbook.pdf (Page 14)', 'vector_search_benchmarks.md'];
      } else if (text.toLowerCase().includes('graph rag')) {
        botResponse = `**Graph RAG** links documents into a structured knowledge graph:\n\n- **Entities & Relationships**: Nodes represent real-world entities (people, products, concepts) and edges denote extracted relationships.\n- **Community Summaries**: Hierarchical clustering summarizes global themes across thousands of documents simultaneously.\n- **Multi-Hop Traversal**: Connects fragmented evidence across distant documents that simple cosine similarity misses.`;
        sources = ['graph_rag_paper.pdf', 'microsoft_graphrag_docs.md'];
      } else if (text.toLowerCase().includes('compare') || text.toLowerCase().includes('types')) {
        botResponse = `**Comparison of Key RAG Frameworks**:\n\n- **Native RAG**: Fastest setup, low latency, best for simple FAQ lookups; limited on multi-part complex queries.\n- **Advanced RAG**: Adds query rewriting (HyDE) and cross-encoder reranking to drastically reduce false positives.\n- **Modular RAG**: Decouples routing, memory, and validation modules for custom enterprise pipelines.\n- **Agentic RAG**: Equips LLMs with planning loops and dynamic tool selection for multi-step reasoning.`;
        sources = ['rag_taxonomy_2025.pdf'];
      } else if (text.toLowerCase().includes('example') || text.toLowerCase().includes('use case')) {
        botResponse = `**Real-World Production Use Cases for ${currentRag.name}**:\n\n1. **Enterprise Customer Support**: Indexing product manuals, API reference docs, and release notes to give instant accurate answers.\n2. **Internal Knowledge Synthesis**: Querying HR policies, SOC2 compliance policies, and onboarding guides.\n3. **Financial & Legal Document Analysis**: Extracting contract stipulations, risk factors, and quarterly 10-K disclosures.`;
        sources = ['enterprise_casestudies.pdf'];
      } else {
        botResponse = `Great question about **${currentRag.name}**!\n\n${currentRag.fullDesc}\n\n**Key Strengths**:\n${currentRag.benefits.map((b) => `• ${b.title}`).join('\n')}\n\nYou can click the paperclip icon below to upload a document and test search indexing!`;
        sources = [`${currentRag.name.toLowerCase().replace(/\s+/g, '_')}_guide.md`];
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 750);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="chat-card">
      {/* Top Header Row */}
      <div className="chat-header-tabs">
        <div className="chat-tab-group">
          <div className="chat-tab-btn active">
            <MessageSquare size={16} strokeWidth={2.4} />
            <span>Chat</span>
          </div>
        </div>

        <button
          type="button"
          className="clear-chat-btn"
          onClick={handleClearChat}
          title="Clear Chat History"
        >
          <Trash2 size={15} strokeWidth={2} />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Main Chat Body */}
      <div className="chat-body-scroll">
        {messages.length === 0 ? (
          /* Welcome Screen with Mascot & Speech Bubble & Prompt Chips */
          <div className="chat-welcome-container">
            <div className="mascot-speech-row">
              {/* Robot Mascot */}
              <div className="mascot-avatar-wrap">
                <img
                  src={robotImg}
                  alt="RAG AI Assistant Mascot"
                  className="mascot-robot-img"
                />
              </div>

              {/* Speech Bubble */}
              <div className="mascot-speech-bubble">
                <p className="speech-bubble-text">
                  Hi! Ask me anything about RAG, or upload a document to explore different RAG types.
                </p>
              </div>
            </div>

            {/* Prompt Chips */}
            <div className="prompt-chips-grid">
              {defaultPromptChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="prompt-chip-btn"
                  onClick={() => handleSendMessage(chip.query)}
                >
                  <span className="prompt-chip-label">{chip.label}</span>
                  <ArrowRight size={15} className="chip-arrow" strokeWidth={2.4} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Conversation Messages Thread */
          <div className="messages-thread">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-bubble-row ${msg.sender === 'user' ? 'msg-user' : 'msg-bot'}`}
              >
                <div className="message-avatar">
                  {msg.sender === 'user' ? (
                    <div className="user-msg-avatar">VV</div>
                  ) : (
                    <div className="bot-msg-avatar">
                      <Bot size={18} color="#ffffff" />
                    </div>
                  )}
                </div>

                <div className="message-content-box">
                  <div className="message-header-info">
                    <span className="msg-sender-name">
                      {msg.sender === 'user' ? 'Vishnu Vijayakumar' : 'RAG Assistant'}
                    </span>
                    <span className="msg-timestamp">{msg.timestamp}</span>
                  </div>
                  <div className="message-text-body">
                    {msg.text.split('\n').map((line, lIdx) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={lIdx} className="bold-lead">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.startsWith('• ') || line.startsWith('- ')) {
                        return (
                          <li key={lIdx} className="bullet-line">
                            {line.replace(/^[•-]\s*/, '')}
                          </li>
                        );
                      }
                      return line ? <p key={lIdx}>{line}</p> : <div key={lIdx} className="line-break" />;
                    })}
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="message-sources-box">
                      <span className="sources-label">Grounded Sources:</span>
                      <div className="sources-tags">
                        {msg.sources.map((src, sIdx) => (
                          <span key={sIdx} className="source-tag">
                            <CheckCircle size={12} color="#10b981" />
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-bubble-row msg-bot">
                <div className="bot-msg-avatar">
                  <Sparkles size={16} color="#ffffff" />
                </div>
                <div className="typing-bubble">
                  <span className="dot dot-1" />
                  <span className="dot dot-2" />
                  <span className="dot dot-3" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <div className="chat-input-container">
        <div className="chat-input-pill">
          <button
            type="button"
            className="input-attach-btn"
            onClick={onOpenUpload}
            title="Upload Document for RAG indexing"
          >
            <Paperclip size={18} strokeWidth={2.2} />
          </button>

          <input
            type="text"
            className="chat-text-input"
            placeholder="Ask anything about RAG..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            className="input-send-btn"
            onClick={() => handleSendMessage()}
            title="Send message"
            aria-label="Send message"
          >
            <Send size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
};
