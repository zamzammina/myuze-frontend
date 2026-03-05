import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTutorials } from '../services/api';
import { ArrowLeft, Camera } from 'lucide-react';
import '../styles/FinishedLooks.css';

const FinishedLooks = () => {
  const navigate = useNavigate();
  const [looks, setLooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinishedLooks();
  }, []);

  const loadFinishedLooks = async () => {
    try {
      const data = await getTutorials();
      // Filter only tutorials with result photos
      const completed = data.tutorials?.filter(t => t.resultPhotoUrl) || [];
      setLooks(completed);
    } catch (error) {
      console.error('Error loading finished looks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="finished-looks-screen">
        <div className="looks-header">
          <div className="skeleton" style={{ width: '100px', height: '40px', borderRadius: 'var(--radius-md)' }} />
          <div className="skeleton" style={{ width: '200px', height: '32px' }} />
        </div>
        <div className="looks-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="finished-looks-screen fade-in">
      <div className="looks-header">
        <button className="back-button btn-ripple" onClick={() => navigate('/profile')}>
          <ArrowLeft size={18} strokeWidth={2} />
          Back
        </button>
        <h1>My Finished Looks</h1>
      </div>

      {looks.length > 0 ? (
        <div className="looks-grid">
          {looks.map((look, index) => (
            <div
              key={look.id}
              className="look-card slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(`/tutorial/${look.id}`)}
            >
              <img 
                src={look.resultPhotoUrl} 
                alt={look.name}
                className="look-photo"
              />
              <div className="look-overlay">
                <p className="look-name">{look.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Camera className="empty-icon" size={72} strokeWidth={1.5} />
          <h2>No finished looks yet</h2>
          <p>Complete tutorials and take photos to see them here!</p>
        </div>
      )}
    </div>
  );
};

export default FinishedLooks;