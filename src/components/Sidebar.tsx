import React from 'react';
import { Home } from 'lucide-react';
import { Logo } from './Logo';

export type NavTabId = 'rag-explorer';

interface SidebarProps {
  activeNav: NavTabId;
  onSelectNav: (id: NavTabId) => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  collapsed = false,
}) => {
  const navItems = [
    {
      id: 'rag-explorer' as NavTabId,
      label: 'RAG Explorer',
      icon: Home,
    },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo-area">
        <Logo collapsed={collapsed} />
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectNav(item.id)}
              title={item.label}
            >
              <span className="sidebar-icon-wrap">
                <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              </span>
              {!collapsed && <span className="sidebar-label">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
