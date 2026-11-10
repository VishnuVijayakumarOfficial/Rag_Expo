import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  FileUp,
  AlertCircle,
  Trash2,
  Database,
  Layers,
} from 'lucide-react';
import { uploadDocument, type DocumentUploadResponse } from '../services/api';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState('Preparing document...');
  const [uploadResult, setUploadResult] = useState<DocumentUploadResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateAndSetFile = (file: File) => {
    // 50MB limit
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage('File size exceeds the 50MB limit. Please choose a smaller file.');
      return;
    }

    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md', '.markdown', '.csv', '.json'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!hasValidExt) {
      setErrorMessage('Unsupported format. Please upload a PDF, DOCX, TXT, Markdown, CSV, or JSON file.');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    setStatus('idle');
    setProgress(0);
    setUploadResult(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setStatus('idle');
    setProgress(0);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartIndexing = async () => {
    if (!selectedFile) return;

    try {
      setStatus('processing');
      setProgress(25);
      setProgressStage('Uploading document to RAG backend...');
      setErrorMessage(null);

      // Trigger actual upload & indexing on backend
      const progressTimer = setTimeout(() => {
        setProgress(65);
        setProgressStage('Extracting text, chunking & generating vector embeddings in database...');
      }, 600);

      const result = await uploadDocument(selectedFile);
      clearTimeout(progressTimer);

      const fileDetail = result.details?.[0];
      if (fileDetail && fileDetail.status === 'error') {
        throw new Error(fileDetail.error || 'Failed to process document');
      }

      setProgress(100);
      setStatus('done');
      setProgressStage('Indexing complete! Stored in vector database.');
      setUploadResult(result);
      onDocumentIndexed?.(selectedFile.name);
    } catch (err) {
      setStatus('idle');
      setProgress(0);
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setErrorMessage(`${msg}. Ensure the RAG backend server is running on port 8000.`);
    }
  };

  const handleCloseModal = () => {
    setStatus('idle');
    setProgress(0);
    setErrorMessage(null);
    setUploadResult(null);
    onClose();
  };

  const firstDetail = uploadResult?.details?.[0];

  return (
    <div className="modal-backdrop" onClick={handleCloseModal}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <UploadCloud size={20} color="#6325ec" />
            </div>
            <div>
              <h3 className="modal-title">Upload Knowledge Document</h3>
              <p className="modal-sub">Chunk, embed and store documents in your RAG vector database.</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={handleCloseModal} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt,.md,.markdown,.csv,.json"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />

        {/* Dropzone Area */}
        <div
          className={`upload-dropzone ${isDragOver ? 'is-drag-over' : ''} ${selectedFile ? 'has-file' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
        >
          <div className="dropzone-icon-circle">
            <FileUp size={32} className="dropzone-cloud-icon" />
          </div>
          <p className="dropzone-primary-text">
            {selectedFile ? 'Click or drop to replace document' : 'Click to browse or drag & drop your file'}
          </p>
          <p className="dropzone-secondary-text">
            Supports PDF, DOCX, Markdown, TXT, CSV, JSON (up to 50MB)
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="upload-error-box">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Selected File Card */}
        {selectedFile && (
          <div className="selected-file-container">
            <div className="selected-file-header">
              <span className="selected-file-label">Selected Document:</span>
            </div>
            <div className="selected-file-card">
              <div className="selected-file-icon-wrap">
                <FileText size={22} className="doc-icon" />
              </div>
              <div className="selected-file-info">
                <span className="selected-file-name" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <span className="selected-file-meta">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Document'}
                </span>
              </div>
              {status !== 'processing' && (
                <button
                  type="button"
                  className="selected-file-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  title="Remove document"
                  aria-label="Remove document"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Processing Details */}
        {status === 'processing' && (
          <div className="indexing-progress-box">
            <div className="progress-labels">
              <span>{progressStage}</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Indexing Success Box with Real Database & Chunk Info */}
        {status === 'done' && (
          <div className="indexing-success-box">
            <CheckCircle2 size={24} color="#10b981" />
            <div>
              <strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                Document Ingestion Complete!
              </strong>
              <p style={{ margin: '0 0 6px 0', fontSize: '12.5px', color: 'var(--color-text-body)' }}>
                <strong>{selectedFile?.name}</strong> has been vectorized and stored in the database.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px' }}>
                <span className="source-tag" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                  <Database size={13} style={{ marginRight: '4px' }} />
                  Backend: {uploadResult?.backend?.toUpperCase() || 'POSTGRES'}
                </span>
                {firstDetail && (
                  <>
                    <span className="source-tag">
                      <Layers size={13} style={{ marginRight: '4px' }} />
                      {firstDetail.chunks_created ?? 0} Chunks Indexed
                    </span>
                    <span className="source-tag">
                      {firstDetail.pages_parsed ?? 1} Page(s) Parsed
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="modal-footer-actions">
          <button type="button" className="btn-secondary" onClick={handleCloseModal}>
            Cancel
          </button>
          {status === 'done' ? (
            <button type="button" className="btn-primary" onClick={handleCloseModal}>
              Start Asking Questions
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              disabled={!selectedFile || status === 'processing'}
              onClick={handleStartIndexing}
            >
              {status === 'processing' ? 'Indexing into DB...' : selectedFile ? 'Index Document Now' : 'Select a File to Index'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
