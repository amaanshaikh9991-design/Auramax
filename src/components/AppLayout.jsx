import React from 'react';

const NAV_ITEMS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'checkin', icon: '✦', label: 'Check-in' },
  { id: 'journey', icon: '', label: 'My Journey' },
  { id: 'explore', icon: '✧', label: 'Explore' },
  { id: 'support', icon: '♡', label: 'Support' }
];

export default function AppLayout({ children, activePage, onNavigate, user }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">A</div>
          <div>
            <div className="brand-name">CogniPlay</div>
            <div className="brand-tagline">a little space to grow</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">{(user?.id || 'S')[0].toUpperCase()}</div>
            <div>
              <div className="user-name">My Space</div>
              <div className="user-sub">Profile & settings</div>
            </div>
            <span className="user-arrow">→</span>
          </div>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}