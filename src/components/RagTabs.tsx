import React, { useRef } from 'react';
import { RAG_TYPES_LIST } from '../data/ragData';
import type { RagTypeKey } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RagTabsProps {
  activeType: RagTypeKey;
  onSelectType: (type: RagTypeKey) => void;
}

export const RagTabs: React.FC<RagTabsProps> = ({ activeType, onSelectType }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="rag-tabs-wrapper">
      <button
        type="button"
        className="tabs-scroll-btn left"
        onClick={() => scroll('left')}
        aria-label="Scroll tabs left"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="rag-tabs-scroll-container" ref={scrollRef}>
        {RAG_TYPES_LIST.map((rag) => {
          const isActive = rag.id === activeType;
          return (
            <button
              key={rag.id}
              type="button"
              className={`rag-tab-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectType(rag.id)}
            >
              <span className="rag-tab-icon">
                <DynamicIcon
                  name={rag.iconName}
                  size={16}
                  strokeWidth={isActive ? 2.3 : 2}
                  color={isActive ? '#ffffff' : '#6829f0'}
                />
              </span>
              <span className="rag-tab-label">{rag.name}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="tabs-scroll-btn right"
        onClick={() => scroll('right')}
        aria-label="Scroll tabs right"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
