import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-left">
        <span className="footer-status-dot" aria-hidden="true" />
        <span className="footer-brand">
          <span className="footer-brand-version">RAG Explorer v1.0</span>
        </span>
      </div>

      <div className="footer-right">
        <span className="footer-tagline">Smarter Knowledge. Better Answers.</span>
      </div>
    </footer>
  );
};
