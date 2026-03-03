import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getTutorial, 
  updateTutorial,
  deleteTutorial,
  getFolders,
  createFolder
} from '../services/api';
import { ArrowLeft, MoreVertical, FolderOpen, Trash2, ExternalLink, Play } from 'lucide-react';
import '../styles/TutorialDetail.css';

const TutorialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFolderSelect, setShowFolderSelect] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);

  useEffect(() => {
    loadTutorialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTutorialData = async () => {
    try {
      const [tutorialData, foldersData] = await Promise.all([
        getTutorial(id),
        getFolders()
      ]);
      
      setTutorial(tutorialData.tutorial);
      setFolders(foldersData.folders || []);
    } catch (error) {
      console.error('Error loading tutorial:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const foldersData = await getFolders();
      setFolders(foldersData.folders || []);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      alert('Please enter a folder name');
      return;
    }

    setCreatingFolder(true);
    try {
      const result = await createFolder(newFolderName.trim());
      await loadFolders();
      await handleMoveToFolder(result.folder.id);
      setShowNewFolder(false);
      setNewFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleMoveToFolder = async (folderId) => {
    try {
      await updateTutorial(id, { folderId: folderId || null });
      await loadTutorialData();
      setShowFolderSelect(false);
      alert('Tutorial moved successfully!');
    } catch (error) {
      console.error('Error moving tutorial:', error);
      alert('Failed to move tutorial');
    }
  };

  const handleDeleteTutorial = async () => {
    if (!window.confirm('Are you sure you want to delete this tutorial? This cannot be undone.')) {
      return;
    }

    try {
      await deleteTutorial(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      alert('Failed to delete tutorial');
    }
  };

  const handleOpenOriginal = () => {
    if (tutorial.originalUrl) {
      window.open(tutorial.originalUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="tutorial-detail">
        <div className="skeleton" style={{ height: '40px', width: '100px', marginBottom: '1rem', borderRadius: 'var(--radius-md)' }} />
        <div className="skeleton" style={{ aspectRatio: '9/16', borderRadius: 'var(--radius-lg)', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ height: '32px', width: '70%', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ height: '56px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  if (!tutorial) {
    return <div className="loading">Tutorial not found</div>;
  }

  return (
    <div className="tutorial-detail fade-in">
      <div className="detail-header">
        <button className="back-button btn-ripple" onClick={() => navigate('/')}>
          <ArrowLeft size={18} strokeWidth={2} />
          Back
        </button>
        
        <button 
          className="menu-button btn-ripple"
          onClick={() => setShowMenu(!showMenu)}
        >
          <MoreVertical size={20} strokeWidth={2} />
        </button>

        {showMenu && (
          <div className="menu-dropdown slide-up">
            <button onClick={() => { setShowFolderSelect(true); setShowMenu(false); }} className="btn-ripple">
              <FolderOpen className="menu-icon" size={18} strokeWidth={2} />
              Move to Folder
            </button>
            <button onClick={handleDeleteTutorial} className="danger btn-ripple">
              <Trash2 className="menu-icon" size={18} strokeWidth={2} />
              Delete Tutorial
            </button>
          </div>
        )}
      </div>

      {showFolderSelect && (
        <div className="modal-overlay fade-in" onClick={() => setShowFolderSelect(false)}>
          <div className="modal-content slide-up" onClick={(e) => e.stopPropagation()}>
            <h2>Move to Folder</h2>
            
            {!showNewFolder ? (
              <>
                <div className="folder-list">
                  <button 
                    className="folder-option btn-ripple"
                    onClick={() => handleMoveToFolder(null)}
                  >
                    <FolderOpen className="folder-icon" size={18} strokeWidth={2} />
                    No Folder
                  </button>
                  {folders.map(folder => (
                    <button
                      key={folder.id}
                      className="folder-option btn-ripple"
                      onClick={() => handleMoveToFolder(folder.id)}
                    >
                      <FolderOpen className="folder-icon" size={18} strokeWidth={2} />
                      {folder.name}
                    </button>
                  ))}
                </div>
                <button 
                  className="btn-link"
                  onClick={() => setShowNewFolder(true)}
                >
                  + Create New Folder
                </button>
              </>
            ) : (
              <div className="new-folder-section">
                <input
                  type="text"
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  disabled={creatingFolder}
                  className="folder-input"
                />
                <div className="folder-actions">
                  <button
                    className="btn-small btn-ripple"
                    onClick={handleCreateFolder}
                    disabled={creatingFolder}
                  >
                    {creatingFolder ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    className="btn-small btn-secondary btn-ripple"
                    onClick={() => {
                      setShowNewFolder(false);
                      setNewFolderName('');
                    }}
                    disabled={creatingFolder}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {!showNewFolder && (
              <button 
                className="btn-secondary btn-ripple"
                onClick={() => setShowFolderSelect(false)}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      <div className="tutorial-header">
        {tutorial.steps && tutorial.steps[0] && (
          <div className="hero-image-container">
            <img 
              src={tutorial.steps[0].gifUrl} 
              alt={tutorial.name}
              className="tutorial-hero"
            />
            <div className="hero-gradient"></div>
          </div>
        )}
        
        <h1>{tutorial.name}</h1>
        
        {tutorial.folder && (
          <span className="current-folder">
            <FolderOpen className="folder-icon" size={16} strokeWidth={2} />
            {tutorial.folder.name}
          </span>
        )}

        {/* Link to original video */}
        <button 
          className="original-video-link btn-ripple"
          onClick={handleOpenOriginal}
        >
          <ExternalLink className="link-icon" size={18} strokeWidth={2} />
          View Original Video
        </button>

        <button 
          className="start-button btn-ripple"
          onClick={() => navigate(`/tutorial/${id}/view`)}
        >
          <Play className="button-icon" size={20} strokeWidth={2} fill="currentColor" />
          Start Tutorial
        </button>
        
        {tutorial.resultPhotoUrl && (
          <div className="result-photo-section slide-up">
            <h3>How this looked on me:</h3>
            <div className="result-photo-container">
              <img 
                src={tutorial.resultPhotoUrl} 
                alt="My result"
                className="result-photo"
              />
            </div>
          </div>
        )}
      </div>

      <div className="products-section">
        <h2>Products Used</h2>
        <div className="coming-soon-box">
          <p className="coming-soon-text">Product detection coming soon!</p>
          <p className="coming-soon-subtext">We're working on AI-powered product recognition</p>
        </div>
      </div>
    </div>
  );
};

export default TutorialDetail;