import React, { useState, useEffect } from 'react';
import { getKit, toggleKitItem, addProductToStep, getTutorials, addToKit } from '../services/api';
import '../styles/MyKit.css';

const MyKit = () => {
  const [kit, setKit] = useState({ have: [], need: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('have');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', brand: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadKit();
    
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'have' || tabParam === 'need') {
      setActiveTab(tabParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    return (
      <div className="mykit-screen">
        <div className="kit-header">
          <div className="skeleton" style={{ width: '120px', height: '32px' }} />
          <div className="skeleton" style={{ width: '120px', height: '40px', borderRadius: 'var(--radius-md)' }} />
        </div>
        <div className="kit-stats">
          <div className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-lg)' }} />
          <div className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-lg)' }} />
        </div>
      </div>
    );
  }

  const displayProducts = activeTab === 'have' ? kit.have : kit.need;

  return (
    <div className="mykit-screen fade-in">
      <div className="kit-header">
        <h1>My Kit</h1>
        <button 
          className="add-product-btn btn-ripple"
          onClick={() => setShowAddProduct(true)}
        >
          + Add
        </button>
      </div>

      {/* Clickable stat boxes */}
      <div className="kit-stats">
        <div 
          className={`stat clickable ${activeTab === 'have' ? 'active' : ''}`}
          onClick={() => setActiveTab('have')}
        >
          <div className="stat-icon">✓</div>
          <span className="stat-number">{kit.haveCount || 0}</span>
          <span className="stat-label">I Have</span>
        </div>
        <div 
          className={`stat clickable ${activeTab === 'need' ? 'active' : ''}`}
          onClick={() => setActiveTab('need')}
        >
          <div className="stat-icon">🛒</div>
          <span className="stat-number">{kit.needCount || 0}</span>
          <span className="stat-label">I Need</span>
        </div>
      </div>

      <div className="kit-content">
        <h2>{activeTab === 'have' ? 'Products I Have' : 'Products I Need'}</h2>
        {displayProducts && displayProducts.length > 0 ? (
          <div className="products-list">
            {displayProducts.map((product, index) => (
              <div 
                key={product.kitItemId} 
                className={`kit-item ${activeTab} slide-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="product-info">
                  <p className="product-name">{product.name}</p>
                  {product.brand && <p className="product-brand">{product.brand}</p>}
                </div>
                <button
                  className="toggle-button btn-ripple"
                  onClick={() => handleToggle(product.kitItemId, activeTab === 'have')}
                  title={activeTab === 'have' ? 'Move to Need' : 'Move to Have'}
                >
                  {activeTab === 'have' ? '✓' : '+'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">{activeTab === 'have' ? '💄' : '🛍️'}</div>
            <p className="empty-title">
              {activeTab === 'have' ? 'No products yet' : 'Nothing to buy'}
            </p>
            <p className="empty-subtitle">
              {activeTab === 'have' 
                ? 'Add products from tutorials or manually' 
                : 'Move products here when you need to buy them'}
            </p>
          </div>
        )}
      </div>

      {showAddProduct && (
        <div className="modal-overlay fade-in" onClick={() => !adding && setShowAddProduct(false)}>
          <div className="modal-content slide-up" onClick={(e) => e.stopPropagation()}>
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
                className="btn-secondary btn-ripple"
                onClick={() => setShowAddProduct(false)}
                disabled={adding}
              >
                Cancel
              </button>
              <button 
                className="btn-primary btn-ripple"
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