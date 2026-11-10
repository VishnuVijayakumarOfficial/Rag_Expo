import { useState, useEffect } from 'react';
import { Sidebar, type NavTabId } from './components/Sidebar';
import { Header } from './components/Header';
import { RagTabs } from './components/RagTabs';
import { ChatCard } from './components/ChatCard';
import { Footer } from './components/Footer';
import { UploadModal } from './components/UploadModal';
import { RAG_DATA_MAP } from './data/ragData';
import type { RagTypeKey } from './types';
import './App.css';

export function App() {
  const [activeNav, setActiveNav] = useState<NavTabId>('rag-explorer');
  const [activeRagKey, setActiveRagKey] = useState<RagTypeKey>('native');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<string | null>(null);

  const currentRagData = RAG_DATA_MAP[activeRagKey];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`app-shell theme-${theme}`}>
      {/* Left Navigation Sidebar */}
      <Sidebar activeNav={activeNav} onSelectNav={setActiveNav} />

      {/* Main Content Area */}
      <div className="main-viewport">
        {/* Header Bar */}
        <Header theme={theme} onToggleTheme={toggleTheme} />

        {/* Content Wrapper */}
        <main className="content-container">
          {/* Top Horizontal RAG Types Pills */}
          <RagTabs activeType={activeRagKey} onSelectType={setActiveRagKey} />

          {/* Main Full-Width Chat Assistant Workspace */}
          <div className="chat-workspace-full">
            <ChatCard
              currentRag={currentRagData}
              activeDocument={activeDocument}
              onOpenUpload={() => setIsUploadOpen(true)}
              onSelectRagType={setActiveRagKey}
            />
          </div>
        </main>

        {/* Global Bottom Status Footer */}
        <Footer />
      </div>

      {/* Interactive Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocumentIndexed={(docName) => setActiveDocument(docName)}
      />
    </div>
  );
}

export default App;
