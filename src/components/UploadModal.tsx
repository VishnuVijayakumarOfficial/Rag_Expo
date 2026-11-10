import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  FileUp,
  AlertCircle,
  Trash2,
} from 'lucide-react';

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
      setErrorMessage('Unsupported format. Please upload a PDF, DOCX, TXT, Markdown, or CSV file.');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    setStatus('idle');
    setProgress(0);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartIndexing = () => {
    if (!selectedFile) return;

    setStatus('processing');
    setProgress(15);
    setProgressStage('Parsing document text & extracting content...');

    const timer1 = setTimeout(() => {
      setProgress(50);
      setProgressStage('Extracting content and semantic chunking...');
    }, 350);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setProgressStage('Generating vector embeddings...');
    }, 750);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatus('done');
      setProgressStage('Indexing complete! Stored in vector database.');
      onDocumentIndexed?.(selectedFile.name);
    }, 1100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleCloseModal = () => {
    setStatus('idle');
    setProgress(0);
    setErrorMessage(null);
    onClose();
  };

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
              <p className="modal-sub">Chunk, embed and index documents into your RAG vector database.</p>
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

        {/* Dropzone Area (Clickable & Draggable) */}
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
            Supports PDF, DOCX, Markdown, TXT, or CSV (up to 50MB)
          </p>
        </div>

        {/* Error notification if invalid file */}
        {errorMessage && (
          <div className="upload-error-box">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Selected Real File Card */}
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

        {/* Indexing Success Box */}
        {status === 'done' && (
          <div className="indexing-success-box">
            <CheckCircle2 size={22} color="#10b981" />
            <div>
              <strong>Indexing Complete!</strong>
              <p>
                <strong>{selectedFile?.name}</strong> has been vectorized and indexed successfully.
              </p>
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
              {status === 'processing' ? 'Indexing...' : selectedFile ? 'Index Document Now' : 'Select a File to Index'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
