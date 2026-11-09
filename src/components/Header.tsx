import React from 'react';
import { Sparkles } from 'lucide-react';
import { LampToggle } from './LampToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-sparkle-icon" aria-hidden="true">
          <Sparkles size={24} className="sparkle-svg" strokeWidth={2.2} />
        </div>
        <div className="header-title-wrap">
          <h1 className="header-title">RAG Explorer</h1>
          <p className="header-subtitle">Your AI Assistant to Explore Different RAG Types</p>
        </div>
      </div>

      <div className="header-right">
        {/* Interactive Hanging Lamp Theme Switch */}
        <LampToggle theme={theme} onToggleTheme={onToggleTheme} />
      </div>
    </header>
  );
};
