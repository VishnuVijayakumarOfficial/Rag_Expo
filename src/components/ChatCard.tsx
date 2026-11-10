import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Trash2,
  Paperclip,
  Send,
  Brain,
  CheckCircle,
  User,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  GitBranch,
  ShieldCheck,
  Zap,
  Layers,
} from 'lucide-react';
import type { RagTypeData, ChatMessage, RagTypeKey, FormattedSourceItem } from '../types';
import { queryRag, formatSources, type RagResponse } from '../services/api';

interface ChatCardProps {
  currentRag: RagTypeData;
  activeDocument?: string | null;
  onOpenUpload: () => void;
  onSelectRagType: (ragId: RagTypeKey) => void;
}

export const ChatCard: React.FC<ChatCardProps> = ({
  currentRag,
  activeDocument,
  onOpenUpload,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [expandedSnippets, setExpandedSnippets] = useState<Record<string, boolean>>({});
  const [expandedTrace, setExpandedTrace] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const toggleSnippet = (key: string) => {
    setExpandedSnippets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTrace = (key: string) => {
    setExpandedTrace((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Connect to real backend endpoint based on currently selected RAG type
      const response: RagResponse = await queryRag(currentRag.id, text);
      const sources: FormattedSourceItem[] = formatSources(response.sources);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.answer || 'No response returned from the model.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: sources.length > 0 ? sources : undefined,
        ragType: currentRag.id,
        ragName: currentRag.name,
        metadata: response as unknown as Record<string, unknown>,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to query RAG model';
      const botErrorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: `**Connection Error**: ${errorMsg}\n\nPlease verify that the RAG backend server is running on port 8000 and accessible.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        ragType: currentRag.id,
        ragName: currentRag.name,
      };

      setMessages((prev) => [...prev, botErrorMsg]);
    } finally {
      setIsTyping(false);
    }
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

          <div className="current-rag-badge" title={`Active Architecture: ${currentRag.name}`}>
            <Zap size={13} color="#6325ec" />
            <span>{currentRag.name}</span>
          </div>

          {activeDocument && (
            <div className="active-doc-indicator" title={`Active document in database: ${activeDocument}`}>
              <FileText size={13} />
              <span className="active-doc-name">{activeDocument}</span>
            </div>
          )}
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
          /* Welcome Screen with Greeting Banner & Sample Questions */
          <div className="chat-welcome-container">
            {/* Welcome Greeting Banner */}
            <div className="chat-welcome-banner">
              <div className="welcome-banner-icon">
                <Brain size={22} className="welcome-brain-svg" strokeWidth={2.2} />
              </div>
              <div className="welcome-banner-content">
                <p className="welcome-banner-text">
                  {activeDocument ? (
                    <>
                      Ready to answer questions about <strong>{activeDocument}</strong> using{' '}
                      <strong>{currentRag.name}</strong>, or{' '}
                      <button
                        type="button"
                        className="inline-upload-link"
                        onClick={onOpenUpload}
                      >
                        upload another document
                      </button>{' '}
                      to index into the vector database.
                    </>
                  ) : (
                    <>
                      Ask anything about your documents using <strong>{currentRag.name}</strong>! Click the{' '}
                      <button
                        type="button"
                        className="inline-upload-link"
                        onClick={onOpenUpload}
                      >
                        paperclip or upload button
                      </button>{' '}
                      to index documents into the database first.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Sample Questions for current RAG architecture */}
            {currentRag.sampleQuestions && currentRag.sampleQuestions.length > 0 && (
              <div className="sample-questions-container">
                <span className="sample-questions-title">
                  <Sparkles size={14} color="#6325ec" /> Suggested prompts for {currentRag.name}:
                </span>
                <div className="sample-questions-grid">
                  {currentRag.sampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="sample-question-chip"
                      onClick={() => handleSendMessage(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Conversation Messages Thread */
          <div className="messages-thread">
            {messages.map((msg) => {
              const meta = msg.metadata as RagResponse | undefined;
              const selfRag = meta?.self_rag_metadata;
              const crag = meta?.corrective_metadata;
              const adaptive = meta?.adaptive_metadata;
              const agentic = meta?.agentic_metadata;
              const graph = meta?.graph_metadata;
              const modular = meta?.modular_metadata;
              const advanced = meta?.advanced_metadata;

              return (
                <div
                  key={msg.id}
                  className={`message-bubble-row ${msg.sender === 'user' ? 'msg-user' : 'msg-bot'} ${
                    msg.isError ? 'msg-error' : ''
                  }`}
                >
                  <div className="message-avatar">
                    {msg.sender === 'user' ? (
                      <div className="user-msg-avatar" title="You">
                        <User size={15} color="#ffffff" strokeWidth={2.2} />
                      </div>
                    ) : (
                      <div className="bot-msg-avatar" style={{ background: msg.isError ? '#ef4444' : undefined }}>
                        <Brain size={16} color="#ffffff" strokeWidth={2.2} />
                      </div>
                    )}
                  </div>

                  <div className="message-content-box">
                    <div className="message-header-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="msg-sender-name">
                          {msg.sender === 'user' ? 'You' : 'RAG Assistant'}
                        </span>
                        {msg.ragName && msg.sender === 'bot' && (
                          <span className="rag-arch-pill">{msg.ragName}</span>
                        )}
                      </div>
                      <span className="msg-timestamp">{msg.timestamp}</span>
                    </div>

                    {/* RAG Metadata Badges */}
                    {msg.sender === 'bot' && (
                      <div className="rag-meta-strip">
                        {/* Self-RAG Reflection Tokens */}
                        {selfRag?.reflection_tokens && selfRag.reflection_tokens.length > 0 && (
                          <div className="meta-badge-group">
                            <span className="meta-group-label">Reflection:</span>
                            {selfRag.reflection_tokens.map((tok, tIdx) => (
                              <span key={tIdx} className="reflection-token-pill">
                                <ShieldCheck size={11} /> {tok}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* CRAG Decision */}
                        {crag?.action && (
                          <span
                            className={`action-pill ${
                              crag.action === 'CORRECT'
                                ? 'action-correct'
                                : crag.action === 'AMBIGUOUS'
                                ? 'action-ambiguous'
                                : 'action-incorrect'
                            }`}
                          >
                            CRAG: {crag.action}
                          </span>
                        )}

                        {/* Adaptive RAG Complexity */}
                        {adaptive?.complexity && (
                          <span className="meta-badge-pill">
                            <Cpu size={12} /> Complexity: {adaptive.complexity} ({adaptive.execution_strategy})
                          </span>
                        )}

                        {/* Advanced RAG Confidence */}
                        {advanced?.average_confidence !== undefined && advanced.average_confidence > 0 && (
                          <span className="meta-badge-pill">
                            Match Confidence: {(advanced.average_confidence * 100).toFixed(0)}%
                          </span>
                        )}

                        {/* Graph RAG Entities */}
                        {graph?.nodes_traversed !== undefined && (
                          <span className="meta-badge-pill">
                            <GitBranch size={12} /> Graph: {graph.nodes_traversed} nodes (depth {graph.depth || 2})
                          </span>
                        )}

                        {/* Modular RAG Active Modules */}
                        {modular?.active_modules && modular.active_modules.length > 0 && (
                          <span className="meta-badge-pill">
                            <Layers size={12} /> Modules: {modular.active_modules.length} active
                          </span>
                        )}
                      </div>
                    )}

                    {/* Agentic RAG ReAct Steps Accordion */}
                    {agentic?.scratchpad && agentic.scratchpad.length > 0 && (
                      <div className="agent-trace-box">
                        <button
                          type="button"
                          className="agent-trace-header"
                          onClick={() => toggleTrace(msg.id)}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Cpu size={13} color="#6325ec" />
                            <strong>ReAct Agent Reasoning Trace</strong> ({agentic.scratchpad.length} steps)
                          </span>
                          {expandedTrace[msg.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        {expandedTrace[msg.id] && (
                          <div className="agent-trace-steps">
                            {agentic.scratchpad.map((s, stepIdx) => (
                              <div key={stepIdx} className="agent-step-item">
                                <span className="step-num-badge">Step {s.step}</span>
                                {s.thought && (
                                  <div className="step-subline">
                                    <strong>Thought:</strong> {s.thought}
                                  </div>
                                )}
                                {s.action && (
                                  <div className="step-subline step-action">
                                    <strong>Action:</strong> <code>{s.action}</code>
                                  </div>
                                )}
                                {s.observation && (
                                  <div className="step-subline step-observation">
                                    <strong>Observation:</strong> {s.observation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Body */}
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

                    {/* Sources Box */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="message-sources-box">
                        <span className="sources-label">Grounded Sources ({msg.sources.length}):</span>
                        <div className="sources-tags">
                          {msg.sources.map((src, sIdx) => {
                            const snippetKey = `${msg.id}-src-${sIdx}`;
                            const isExpanded = expandedSnippets[snippetKey];

                            return (
                              <div key={sIdx} className="source-tag-wrapper">
                                <button
                                  type="button"
                                  className="source-tag"
                                  onClick={() => src.snippet && toggleSnippet(snippetKey)}
                                  title={src.snippet ? 'Click to preview snippet' : undefined}
                                >
                                  <CheckCircle size={12} color="#10b981" />
                                  <span>{src.label}</span>
                                  {src.snippet && (
                                    isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                                  )}
                                </button>
                                {isExpanded && src.snippet && (
                                  <div className="source-snippet-preview">
                                    <p>"{src.snippet}"</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="message-bubble-row msg-bot">
                <div className="bot-msg-avatar">
                  <Brain size={16} color="#ffffff" strokeWidth={2.2} />
                </div>
                <div className="typing-bubble">
                  <span className="dot dot-1" />
                  <span className="dot dot-2" />
                  <span className="dot dot-3" />
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: '8px' }}>
                    Retrieving with {currentRag.name}...
                  </span>
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
            title="Upload Document into Database"
          >
            <Paperclip size={18} strokeWidth={2.2} />
          </button>

          <input
            type="text"
            className="chat-text-input"
            placeholder={
              activeDocument
                ? `Ask anything using ${currentRag.name} (Active: ${activeDocument})...`
                : `Ask anything using ${currentRag.name}...`
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />

          <button
            type="button"
            className="input-send-btn"
            onClick={() => handleSendMessage()}
            disabled={isTyping || !inputValue.trim()}
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
