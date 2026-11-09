import React from 'react';

export const Logo: React.FC<{ collapsed?: boolean }> = ({ collapsed = false }) => {
  return (
    <div className="logo-container">
      <div className="logo-icon-wrap" aria-label="Rag Expo Logo">
        <svg
          width="32"
          height="32"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background glow */}
          <circle cx="18" cy="18" r="14" fill="#6624eb" fillOpacity="0.08" />
          
          {/* 4 Connected Nodes (Rag Expo Symbol) */}
          {/* Top-Left node & stem */}
          <line x1="18" y1="18" x2="8" y2="8" stroke="#6827f3" strokeWidth="3" strokeLinecap="round" />
          <circle cx="8" cy="8" r="4" fill="#6827f3" />

          {/* Top-Right node & stem */}
          <line x1="18" y1="18" x2="28" y2="8" stroke="#6827f3" strokeWidth="3" strokeLinecap="round" />
          <circle cx="28" cy="8" r="4" fill="#6827f3" />

          {/* Bottom-Left node & stem */}
          <line x1="18" y1="18" x2="8" y2="28" stroke="#6827f3" strokeWidth="3" strokeLinecap="round" />
          <circle cx="8" cy="28" r="4" fill="#6827f3" />

          {/* Bottom-Right node & stem */}
          <line x1="18" y1="18" x2="28" y2="28" stroke="#6827f3" strokeWidth="3" strokeLinecap="round" />
          <circle cx="28" cy="28" r="4" fill="#6827f3" />

          {/* Center ring node */}
          <circle cx="18" cy="18" r="4.5" fill="#ffffff" stroke="#6827f3" strokeWidth="3" />
        </svg>
      </div>

      {!collapsed && (
        <div className="logo-text-wrap">
          <span className="logo-title">Rag Expo</span>
          <span className="logo-tagline">Explore • Learn • Experience</span>
        </div>
      )}
    </div>
  );
};
