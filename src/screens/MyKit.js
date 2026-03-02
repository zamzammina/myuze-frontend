import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getKit, toggleKitItem, addProductToStep, getTutorials, addToKit } from '../services/api';
import '../styles/MyKit.css';

const MyKit = () => {
  const location = useLocation();
  const [kit, setKit] = useState({ have: [], need: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('have');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', brand: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadKit();
    
    // Check URL for tab parameter using useLocation
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    console.log('Tab parameter:', tabParam, 'Full URL:', location.search);
    if (tabParam === 'have' || tabParam === 'need') {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const loadKit = async () => {
    try {
      const data = await getKit();
      setKit(data.kit);
    } catch (error) {
      console.error('Error loading kit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (kitItemId, currentStatus) => {
    try {
      await toggleKitItem(kitItemId, !currentStatus);
      await loadKit();
    } catch (error) {
      console.error('Error toggling product:', error);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name.trim()) {
      alert('Please enter a product name');
      return;
    }

    setAdding(true);
    try {
      const tutorials = await getTutorials();
      if (tutorials.tutorials && tutorials.tutorials.length > 0) {
        const firstTutorial = tutorials.tutorials[0];
        if (firstTutorial.steps && firstTutorial.steps.length > 0) {
          const productResult = await addProductToStep(
            firstTutorial.steps[0].id,
            newProduct.name.trim(),
            newProduct.brand.trim()
          );
          
          if (productResult.product && productResult.product.id) {
            await addToKit(productResult.product.id, true);
            await loadKit();
            setShowAddProduct(false);
            setNewProduct({ name: '', brand: '' });
            alert('Product added to your kit!');
          } else {
            alert('Failed to add product');
          }
        } else {
          alert('Please create a tutorial first before adding products manually.');
        }
      } else {
        alert('Please create a tutorial first before adding products manually.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Make sure you have at least one tutorial created.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your kit...</div>;
  }

  const displayProducts = activeTab === 'have' ? kit.have : kit.need;

  return (
    <div className="mykit-screen">
      <div className="kit-header">
        <h1>My Kit</h1>
        <button 
          className="add-product-btn"
          onClick={() => setShowAddProduct(true)}
        >
          + Add Product
        </button>
      </div>

      <div className="kit-stats">
        <div 
          className="stat clickable" 
          onClick={() => setActiveTab('have')}
          style={{ 
            borderColor: activeTab === 'have' ? 'var(--dark-brown)' : 'var(--beige)',
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
        >
          <span className="stat-number">{kit.haveCount || 0}</span>
          <span className="stat-label">Products I Have</span>
        </div>
        <div 
          className="stat clickable"
          onClick={() => setActiveTab('need')}
          style={{ 
            borderColor: activeTab === 'need' ? 'var(--dark-brown)' : 'var(--beige)',
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
        >
          <span className="stat-number">{kit.needCount || 0}</span>
          <span className="stat-label">Products I Need</span>
        </div>
      </div>

      <div className="kit-content">
        <h2>{activeTab === 'have' ? 'I Have' : 'I Need'} ({activeTab === 'have' ? kit.haveCount : kit.needCount || 0})</h2>
        {displayProducts && displayProducts.length > 0 ? (
          <div className="products-list">
            {displayProducts.map(product => (
              <div key={product.kitItemId} className={`kit-item ${activeTab}`}>
                <div className="product-info">
                  <p className="product-name">{product.name}</p>
                  {product.brand && <p className="product-brand">{product.brand}</p>}
                </div>
                <button
                  className="toggle-button"
                  onClick={() => handleToggle(product.kitItemId, activeTab === 'have')}
                  title={activeTab === 'have' ? 'Move to Need' : 'Move to Have'}
                >
                  {activeTab === 'have' ? '✓' : '+'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">
            {activeTab === 'have' ? 'No products yet' : 'No products to buy'}
          </p>
        )}
      </div>

      {showAddProduct && (
        <div className="modal-overlay" onClick={() => !adding && setShowAddProduct(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Product to Kit</h2>
            
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                placeholder="e.g. Fenty Beauty Foundation"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                disabled={adding}
              />
            </div>

            <div className="form-group">
              <label>Brand (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Fenty Beauty"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                disabled={adding}
              />
            </div>

            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowAddProduct(false)}
                disabled={adding}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleAddProduct}
                disabled={adding}
              >
                {adding ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyKit;