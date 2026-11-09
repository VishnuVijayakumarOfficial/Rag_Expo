import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, Cpu, HardDrive } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentIndexed?: (docName: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentIndexed,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<string>('Enterprise_AI_Security_Policy.pdf');
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const sampleDocs = [
    { name: 'Enterprise_AI_Security_Policy.pdf', size: '2.4 MB', pages: '18 pages' },
    { name: 'Vector_Search_Evaluation_Guide.md', size: '640 KB', pages: '8 pages' },
    { name: 'Product_Architecture_Spec_v3.pdf', size: '4.1 MB', pages: '32 pages' },
  ];

  const handleStartIndexing = () => {
    setStatus('processing');
    setProgress(15);

    const timer1 = setTimeout(() => setProgress(50), 300);
    const timer2 = setTimeout(() => setProgress(85), 600);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatus('done');
      onDocumentIndexed?.(selectedDoc);
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleReset = () => {
    setStatus('idle');
    setProgress(0);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <UploadCloud size={20} color="#6325ec" />
            </div>
            <div>
              <h3 className="modal-title">Upload Knowledge Document</h3>
              <p className="modal-sub">Chunk, embed and index documents into your RAG vector database.</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Dropzone Area */}
        <div className="upload-dropzone">
          <UploadCloud size={36} className="dropzone-cloud-icon" />
          <p className="dropzone-primary-text">Drag & drop your PDF, DOCX, or Markdown files</p>
          <p className="dropzone-secondary-text">Supports up to 50MB per file with automatic semantic chunking</p>
        </div>

        {/* Sample Docs Selection */}
        <div className="sample-docs-section">
          <p className="sample-docs-label">Or select a sample pre-loaded dataset:</p>
          <div className="sample-docs-list">
            {sampleDocs.map((doc) => (
              <div
                key={doc.name}
                className={`sample-doc-card ${selectedDoc === doc.name ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedDoc(doc.name);
                  handleReset();
                }}
              >
                <FileText size={18} className="doc-icon" />
                <div className="doc-info">
                  <span className="doc-name">{doc.name}</span>
                  <span className="doc-meta">{doc.size} • {doc.pages}</span>
                </div>
                {selectedDoc === doc.name && (
                  <CheckCircle2 size={16} className="doc-check-icon" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Processing Details */}
        {status === 'processing' && (
          <div className="indexing-progress-box">
            <div className="progress-labels">
              <span>Generating dense vector embeddings...</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="indexing-success-box">
            <CheckCircle2 size={20} color="#10b981" />
            <div>
              <strong>Indexing Complete!</strong>
              <p>Created 48 semantic chunks stored in Pinecone vector index.</p>
            </div>
          </div>
        )}

        {/* Tech Specs Summary */}
        <div className="indexing-meta-grid">
          <div className="meta-pill">
            <Cpu size={14} />
            <span>Model: text-embedding-3-small</span>
          </div>
          <div className="meta-pill">
            <HardDrive size={14} />
            <span>Chunk Size: 512 tokens (50 overlap)</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-footer-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          {status === 'done' ? (
            <button type="button" className="btn-primary" onClick={onClose}>
              Start Asking Questions
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              disabled={status === 'processing'}
              onClick={handleStartIndexing}
            >
              {status === 'processing' ? 'Indexing...' : 'Index Document Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
