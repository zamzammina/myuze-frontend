import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTutorials, getKit, getFolders } from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    tutorialCount: 0,
    productsOwned: 0,
    foldersCount: 0,
    completedLooks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [tutorials, kit, folders] = await Promise.all([
        getTutorials(),
        getKit(),
        getFolders()
      ]);

      const completed = tutorials.tutorials?.filter(t => t.resultPhotoUrl).length || 0;

      setStats({
        tutorialCount: tutorials.tutorials?.length || 0,
        productsOwned: kit.kit?.haveCount || 0,
        foldersCount: folders.folders?.length || 0,
        completedLooks: completed
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLooksCompleted = () => {
    navigate('/?filter=completed');
  };

  if (loading) {
    return (
      <div className="profile-screen">
        <div className="profile-header-skeleton">
          <div className="skeleton" style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 1rem' }} />
          <div className="skeleton" style={{ width: '150px', height: '32px', margin: '0 auto 0.5rem' }} />
          <div className="skeleton" style={{ width: '200px', height: '20px', margin: '0 auto' }} />
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-screen fade-in">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="avatar-ring"></div>
        </div>
        <h1>My Profile</h1>
        <p className="profile-email">user@myuze.app</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card clickable" onClick={() => navigate('/')}>
          <div className="stat-icon">📚</div>
          <span className="stat-number">{stats.tutorialCount}</span>
          <span className="stat-label">Tutorials Saved</span>
        </div>
        <div className="stat-card clickable" onClick={() => navigate('/kit?tab=have')}>
          <div className="stat-icon">💄</div>
          <span className="stat-number">{stats.productsOwned}</span>
          <span className="stat-label">Products Owned</span>
        </div>
        <div className="stat-card clickable" onClick={() => navigate('/')}>
          <div className="stat-icon">📁</div>
          <span className="stat-number">{stats.foldersCount}</span>
          <span className="stat-label">Folders</span>
        </div>
        <div className="stat-card clickable" onClick={handleLooksCompleted}>
          <div className="stat-icon">✨</div>
          <span className="stat-number">{stats.completedLooks}</span>
          <span className="stat-label">Looks Completed</span>
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-section">
          <h3>Settings</h3>
          <button className="settings-button btn-ripple">
            <span className="settings-icon">✏️</span>
            Edit Profile
          </button>
          <button className="settings-button btn-ripple">
            <span className="settings-icon">📁</span>
            Manage Folders
          </button>
          <button className="settings-button btn-ripple">
            <span className="settings-icon">🔔</span>
            Notifications
          </button>
        </div>

        <div className="profile-section">
          <h3>About</h3>
          <div className="about-card">
            <p className="about-text">Myuzè MVP v0.1</p>
            <p className="about-text">Making makeup tutorials easy to follow</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;