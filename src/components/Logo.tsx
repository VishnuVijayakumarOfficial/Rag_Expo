import React from 'react';
import ragExpoLogo from '../assets/rag_expo_logo.png';

interface LogoProps {
  collapsed?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ collapsed = false }) => {
  return (
    <div className={`logo-container ${collapsed ? 'collapsed' : ''}`} aria-label="Rag Expo">
      <img
        src={ragExpoLogo}
        alt="Rag Expo Logo"
        className="rag-expo-brand-img"
      />
    </div>
  );
};
