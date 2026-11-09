import React from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';

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
        {/* Sun / Moon Theme Toggle */}
        <button
          type="button"
          className="theme-toggle-pill"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
          aria-label="Toggle theme"
        >
          <div className={`theme-icon sun-icon ${theme === 'light' ? 'active-icon' : ''}`}>
            <Sun size={15} strokeWidth={2.5} />
          </div>
          <div className={`theme-thumb ${theme === 'dark' ? 'thumb-right' : 'thumb-left'}`} />
          <div className={`theme-icon moon-icon ${theme === 'dark' ? 'active-icon' : ''}`}>
            <Moon size={14} strokeWidth={2.5} />
          </div>
        </button>
      </div>
    </header>
  );
};
