import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTutorial, uploadResultPhoto, addToKit, deleteStep } from '../services/api';
import { X, Trash2, Camera, ChevronLeft, ChevronRight, Check, Plus } from 'lucide-react';
import '../styles/TutorialViewer.css';

const TutorialViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    loadTutorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTutorial = async () => {
    try {
      const data = await getTutorial(id);
      setTutorial(data.tutorial);
    } catch (error) {
      console.error('Error loading tutorial:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCamera(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePhotoCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      try {
        await uploadResultPhoto(id, base64);
        alert('Photo uploaded successfully!');
        navigate(`/tutorial/${id}`);
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo. Please try again.');
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.onerror = () => {
      alert('Failed to read image file');
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddProductToKit = async (product) => {
    try {
      await addToKit(product.id, false);
      alert(`${product.name} added to your kit!`);
    } catch (error) {
      console.error('Error adding to kit:', error);
      alert('Failed to add product to kit');
    }
  };

  const handleDeleteStep = async (stepId) => {
    if (!window.confirm('Are you sure you want to delete this step? This cannot be undone.')) {
      return;
    }

    try {
      await deleteStep(stepId);
      await loadTutorial();
      if (currentStep >= tutorial.steps.length - 1) {
        setCurrentStep(Math.max(0, currentStep - 1));
      }
      alert('Step deleted successfully!');
    } catch (error) {
      console.error('Error deleting step:', error);
      alert('Failed to delete step');
    }
  };

  if (loading || !tutorial) {
    return (
      <div className="tutorial-viewer">
        <div className="skeleton" style={{ height: '60px', marginBottom: '1rem', borderRadius: 'var(--radius-lg)' }} />
        <div className="skeleton" style={{ aspectRatio: '9/16', borderRadius: 'var(--radius-lg)', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  const step = tutorial.steps[currentStep];

  if (showCamera) {
    return (
      <div className="camera-screen fade-in">
        <div className="camera-content">
          <Camera className="camera-icon-large" size={72} strokeWidth={1.5} />
          <h2>Show off your look!</h2>
          <p className="camera-hint">Take a photo of your final result</p>
          
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            style={{ display: 'none' }}
            id="camera-input"
            disabled={uploadingPhoto}
          />
          <label 
            htmlFor="camera-input" 
            className={`camera-button btn-ripple ${uploadingPhoto ? 'disabled' : ''}`}
          >
            {uploadingPhoto ? (
              <>
                <div className="spinner-small"></div>
                Uploading...
              </>
            ) : (
              <>
                <Camera size={20} strokeWidth={2} />
                Open Camera
              </>
            )}
          </label>
          
          <button 
            className="skip-button btn-ripple"
            onClick={() => navigate(`/tutorial/${id}`)}
            disabled={uploadingPhoto}
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentStep + 1) / tutorial.steps.length) * 100;

  return (
    <div className="tutorial-viewer fade-in">
      <div className="viewer-header">
        <button className="close-button btn-ripple" onClick={() => navigate(`/tutorial/${id}`)}>
          <X size={20} strokeWidth={2} />
        </button>
        
        <button 
          className="delete-step-button btn-ripple"
          onClick={() => handleDeleteStep(step.id)}
          title="Delete this step"
        >
          <Trash2 size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="progress-container">
        <div className="step-counter">
          Step {currentStep + 1} of {tutorial.steps.length}
        </div>
        <div className="progress-track">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="step-content">
        <div className="gif-container">
          <img 
            src={step.gifUrl} 
            alt={`Step ${currentStep + 1}`}
            className="step-gif"
          />
        </div>

        {step.stepProducts && step.stepProducts.length > 0 && (
          <div className="step-products slide-up">
            <h3>Products for this step</h3>
            {step.stepProducts.map(sp => (
              <div key={sp.id} className="step-product">
                <div className="product-details">
                  <p className="product-name">{sp.product.name}</p>
                  {sp.product.brand && <span className="product-brand">{sp.product.brand}</span>}
                </div>
                <button 
                  className="add-to-kit-btn btn-ripple"
                  onClick={() => handleAddProductToKit(sp.product)}
                  title="Add to my kit"
                >
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="navigation-controls">
        <button 
          className="nav-button btn-ripple"
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="nav-arrow" size={20} strokeWidth={2} />
          Previous
        </button>
        <button 
          className="nav-button primary btn-ripple"
          onClick={handleNext}
        >
          {currentStep < tutorial.steps.length - 1 ? (
            <>
              Next
              <ChevronRight className="nav-arrow" size={20} strokeWidth={2} />
            </>
          ) : (
            <>
              <Check size={20} strokeWidth={2} />
              Finish
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TutorialViewer;