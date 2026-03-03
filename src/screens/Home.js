import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTutorials, getFolders, createTutorial, checkProgress, createFolder } from '../services/api';
import AddTutorialModal from '../components/AddTutorialModal';
import { Plus, ChevronDown } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [tutorials, setTutorials] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [showFolders, setShowFolders] = useState(true);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);

  useEffect(() => {
    loadData();
    
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get('filter');
    if (filterParam === 'completed') {
      setFilter('completed');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const [tutorialsData, foldersData] = await Promise.all([
        getTutorials(),
        getFolders()
      ]);
      setTutorials(tutorialsData.tutorials || []);
      setFolders(foldersData.folders || []);
    } catch (error) {
      console.error('Error loading data:', error);
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

  const filteredTutorials = tutorials.filter(t => {
    const matchesFolder = selectedFolder === 'all' || t.folderId === parseInt(selectedFolder);
    const matchesFilter = filter === 'all' || (filter === 'completed' && t.resultPhotoUrl);
    return matchesFolder && matchesFilter;
  });

  const getFolderTutorials = (folderId) => {
    return tutorials.filter(t => t.folderId === folderId);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      alert('Please enter a folder name');
      return;
    }

    setCreatingFolder(true);
    try {
      await createFolder(newFolderName.trim());
      await loadFolders();
      setShowNewFolderInput(false);
      setNewFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleAddTutorial = async (tutorialData) => {
    let progressInterval = null;
    
    try {
      setProcessing(true);
      setProgress({ current: 0, total: tutorialData.numSteps });
      setProcessingStatus('Starting...');
      setShowAddModal(false);
      
      const response = await createTutorial(
        tutorialData.url,
        tutorialData.name,
        tutorialData.platform,
        tutorialData.numSteps,
        tutorialData.folderId
      );
      
      const jobId = response.jobId;
      
      if (!jobId) {
        await loadData();
        setProcessing(false);
        setProcessingStatus('');
        setProgress({ current: 0, total: 0 });
        return;
      }
      
      progressInterval = setInterval(async () => {
        try {
          const progressData = await checkProgress(jobId);
          
          if (progressData.success) {
            setProgress({
              current: progressData.progress.currentStep,
              total: progressData.progress.totalSteps,
            });
            setProcessingStatus(progressData.progress.status);
            
            if (progressData.progress.currentStep >= progressData.progress.totalSteps) {
              clearInterval(progressInterval);
              setProcessingStatus('Finishing up...');
              await loadData();
              setProcessing(false);
              setProcessingStatus('');
              setProgress({ current: 0, total: 0 });
            }
          }
        } catch (err) {
          console.log('Progress check failed, assuming complete');
          clearInterval(progressInterval);
          await loadData();
          setProcessing(false);
          setProcessingStatus('');
          setProgress({ current: 0, total: 0 });
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error creating tutorial:', error);
      if (progressInterval) clearInterval(progressInterval);
      setProcessing(false);
      setProcessingStatus('');
      setProgress({ current: 0, total: 0 });
      alert('Failed to create tutorial. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="home-screen">
        <div className="hero-section skeleton" style={{ height: '120px', marginBottom: '2rem' }} />
        <div className="folders-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '200px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="home-screen fade-in">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Myuzè</h1>
        <p className="hero-subtitle">Master every look, step by step</p>
      </div>

      {/* Folders Section */}
      {folders.length > 0 && (
        <div className="folders-section slide-up">
          <div className="section-header" onClick={() => setShowFolders(!showFolders)}>
            <h2>Folders</h2>
            <ChevronDown 
              className={`dropdown-arrow ${showFolders ? 'open' : ''}`} 
              size={18} 
              strokeWidth={2}
            />
          </div>

          {showFolders && (
            <div className="folders-grid">
              {/* New Folder Card */}
              {!showNewFolderInput ? (
                <div className="folder-card new-folder" onClick={() => setShowNewFolderInput(true)}>
                  <div className="folder-thumbnail-grid empty">
                    <Plus className="add-icon" size={48} strokeWidth={1.5} />
                  </div>
                  <p className="folder-name">New Folder</p>
                </div>
              ) : (
                <div className="folder-card new-folder-input">
                  <input
                    type="text"
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    disabled={creatingFolder}
                    autoFocus
                  />
                  <div className="folder-input-actions">
                    <button onClick={handleCreateFolder} disabled={creatingFolder} className="btn-ripple">
                      {creatingFolder ? '...' : '✓'}
                    </button>
                    <button onClick={() => { setShowNewFolderInput(false); setNewFolderName(''); }} className="btn-ripple">
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Existing Folders */}
              {folders.map(folder => {
                const folderTutorials = getFolderTutorials(folder.id);
                return (
                  <div 
                    key={folder.id} 
                    className="folder-card"
                    onClick={() => setSelectedFolder(folder.id.toString())}
                  >
                    <div className="folder-thumbnail-grid">
                      {folderTutorials.slice(0, 4).map((tutorial, idx) => (
                        <div key={idx} className="folder-thumbnail">
                          {tutorial.steps && tutorial.steps[0] && (
                            <img src={tutorial.steps[0].gifUrl} alt="" />
                          )}
                        </div>
                      ))}
                      {Array.from({ length: Math.max(0, 4 - folderTutorials.length) }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="folder-thumbnail empty" />
                      ))}
                    </div>
                    <p className="folder-name">{folder.name}</p>
                    <p className="folder-count">{folderTutorials.length} Tutorial{folderTutorials.length !== 1 ? 's' : ''}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tutorials Grid */}
      <div className="tutorials-section">
        {selectedFolder !== 'all' && (
          <button className="back-to-all" onClick={() => setSelectedFolder('all')}>
            ← Back to All Tutorials
          </button>
        )}
        
        <div className="tutorials-grid">
          {filteredTutorials.map((tutorial, index) => (
            <div 
              key={tutorial.id} 
              className="tutorial-card slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(`/tutorial/${tutorial.id}`)}
            >
              {tutorial.steps && tutorial.steps[0] && (
                <img 
                  src={tutorial.steps[0].gifUrl} 
                  alt={tutorial.name}
                  className="tutorial-thumbnail"
                />
              )}
              <div className="tutorial-info">
                <h3>{tutorial.name}</h3>
                {tutorial.folder && (
                  <span className="folder-tag">{tutorial.folder.name}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        className="add-button btn-ripple"
        onClick={() => setShowAddModal(true)}
        disabled={processing}
      >
        <Plus size={28} strokeWidth={2} />
      </button>

      {showAddModal && (
        <AddTutorialModal 
          folders={folders}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTutorial}
          onFolderCreated={loadFolders}
        />
      )}

      {processing && (
        <div className="processing-overlay fade-in">
          <div className="processing-modal slide-up">
            <div className="spinner"></div>
            <h2>Creating Tutorial...</h2>
            {progress.total > 0 && (
              <div className="progress-info">
                <p className="progress-text">Step {progress.current} of {progress.total}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
            <p className="status-text">{processingStatus}</p>
            <p className="processing-tip">Feel free to browse while we process your video!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;