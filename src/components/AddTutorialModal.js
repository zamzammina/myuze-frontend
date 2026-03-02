import React, { useState } from 'react';
import { createFolder } from '../services/api';
import '../styles/Modal.css';

const AddTutorialModal = ({ folders, onClose, onSubmit, onFolderCreated }) => {
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    platform: 'tiktok',
    numSteps: 10,
    folderId: null
  });
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.url || !formData.name) {
      alert('Please fill in URL and name');
      return;
    }
    onSubmit(formData);
  };

  const handleFolderChange = (e) => {
    const value = e.target.value;
    if (value === '__create_new__') {
      setShowNewFolderInput(true);
    } else {
      setFormData({...formData, folderId: value ? parseInt(value) : null});
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
      if (onFolderCreated) {
        await onFolderCreated();
      }
      setFormData({...formData, folderId: result.folder.id});
      setShowNewFolderInput(false);
      setNewFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    } finally {
      setCreatingFolder(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Tutorial</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>TikTok URL</label>
            <input
              type="url"
              placeholder="https://www.tiktok.com/@user/video/..."
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Tutorial Name</label>
            <input
              type="text"
              placeholder="Natural Makeup Look"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Number of Steps (more steps = shorter GIFs)</label>
            <select
              value={formData.numSteps}
              onChange={(e) => setFormData({...formData, numSteps: parseInt(e.target.value)})}
            >
              {[6, 8, 10, 12, 15].map(num => (
                <option key={num} value={num}>{num} steps</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Folder (Optional)</label>
            {!showNewFolderInput ? (
              <select
                value={formData.folderId || ''}
                onChange={handleFolderChange}
              >
                <option value="">No Folder</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
                <option value="__create_new__">+ Create New Folder</option>
              </select>
            ) : (
              <div className="new-folder-input">
                <input
                  type="text"
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  disabled={creatingFolder}
                />
                <button
                  type="button"
                  className="btn-small"
                  onClick={handleCreateFolder}
                  disabled={creatingFolder}
                >
                  {creatingFolder ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn-small btn-secondary"
                  onClick={() => {
                    setShowNewFolderInput(false);
                    setNewFolderName('');
                  }}
                  disabled={creatingFolder}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Tutorial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTutorialModal;