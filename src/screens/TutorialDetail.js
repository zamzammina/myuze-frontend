import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getTutorial, 
  updateTutorial,
  deleteTutorial,
  getFolders,
  createFolder
} from '../services/api';
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
    return <div className="loading">Loading tutorial...</div>;
  }

  if (!tutorial) {
    return <div className="loading">Tutorial not found</div>;
  }

  return (
    <div className="tutorial-detail">
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        
        <button 
          className="menu-button"
          onClick={() => setShowMenu(!showMenu)}
        >
          ⋮
        </button>

        {showMenu && (
          <div className="menu-dropdown">
            <button onClick={() => { setShowFolderSelect(true); setShowMenu(false); }}>
              📁 Move to Folder
            </button>
            <button onClick={handleOpenOriginal}>
              🔗 View Original Video
            </button>
            <button onClick={handleDeleteTutorial} className="danger">
              🗑️ Delete Tutorial
            </button>
          </div>
        )}
      </div>

      {showFolderSelect && (
        <div className="modal-overlay" onClick={() => setShowFolderSelect(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Move to Folder</h2>
            
            {!showNewFolder ? (
              <>
                <div className="folder-list">
                  <button 
                    className="folder-option"
                    onClick={() => handleMoveToFolder(null)}
                  >
                    No Folder
                  </button>
                  {folders.map(folder => (
                    <button
                      key={folder.id}
                      className="folder-option"
                      onClick={() => handleMoveToFolder(folder.id)}
                    >
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
                    className="btn-small"
                    onClick={handleCreateFolder}
                    disabled={creatingFolder}
                  >
                    {creatingFolder ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    className="btn-small btn-secondary"
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
                className="btn-secondary"
                onClick={() => setShowFolderSelect(false)}
                style={{ marginTop: '1rem' }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      <div className="tutorial-header">
        {tutorial.steps && tutorial.steps[0] && (
          <img 
            src={tutorial.steps[0].gifUrl} 
            alt={tutorial.name}
            className="tutorial-hero"
          />
        )}
        
        <h1>{tutorial.name}</h1>
        
        {tutorial.folder && (
          <span className="current-folder">📁 {tutorial.folder.name}</span>
        )}
        
        {tutorial.resultPhotoUrl && (
          <div className="result-photo-section">
            <h3>How this looked on me:</h3>
            <img 
              src={tutorial.resultPhotoUrl} 
              alt="My result"
              className="result-photo"
            />
          </div>
        )}
      </div>

      <button 
        className="start-button"
        onClick={() => navigate(`/tutorial/${id}/view`)}
      >
        Start Tutorial
      </button>

      <div className="products-section">
        <h2>Products Used</h2>
        <div className="coming-soon-box">
          <p className="coming-soon-icon">🔮</p>
          <p className="coming-soon-text">Product detection coming soon!</p>
          <p className="coming-soon-subtext">We're working on AI-powered product recognition</p>
        </div>
      </div>
    </div>
  );
};

export default TutorialDetail;