import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>
      
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <div className="nav-icon">🏠</div>
          <span className="nav-label">Home</span>
        </button>
        
        <button 
          className={`nav-item ${isActive('/kit') ? 'active' : ''}`}
          onClick={() => navigate('/kit')}
        >
          <div className="nav-icon">💄</div>
          <span className="nav-label">My Kit</span>
        </button>
        
        <button 
          className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
          onClick={() => navigate('/profile')}
        >
          <div className="nav-icon">👤</div>
          <span className="nav-label">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;