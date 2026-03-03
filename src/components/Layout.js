import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Sparkles, User } from 'lucide-react';
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
          <Home className="nav-icon" size={22} strokeWidth={2} />
          <span className="nav-label">Home</span>
        </button>
        
        <button 
          className={`nav-item ${isActive('/kit') ? 'active' : ''}`}
          onClick={() => navigate('/kit')}
        >
          <Sparkles className="nav-icon" size={22} strokeWidth={2} />
          <span className="nav-label">My Kit</span>
        </button>
        
        <button 
          className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
          onClick={() => navigate('/profile')}
        >
          <User className="nav-icon" size={22} strokeWidth={2} />
          <span className="nav-label">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;