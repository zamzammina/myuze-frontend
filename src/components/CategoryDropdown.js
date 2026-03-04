import React, { useState, useEffect } from 'react';
import { getCategories, createCustomCategory } from '../services/api';
import { Search, Plus } from 'lucide-react';
import '../styles/CategoryDropdown.css';

const CategoryDropdown = ({ value, onChange, placeholder = "Select category" }) => {
  const [categories, setCategories] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustom = async () => {
    if (!customName.trim()) return;
    
    try {
      await createCustomCategory(customName.trim());
      await loadCategories();
      onChange({ id: null, name: customName.trim(), isCustom: true });
      setCustomName('');
      setShowCustomInput(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating custom category:', error);
      alert('Failed to create custom category');
    }
  };

  const handleSelect = (category) => {
    onChange(category);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Flatten and filter categories for search
  const getFilteredCategories = () => {
    const allCategories = [];
    Object.entries(categories).forEach(([group, cats]) => {
      cats.forEach(cat => {
        allCategories.push({ ...cat, group });
      });
    });

    if (!searchTerm) return allCategories;

    return allCategories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredCategories = getFilteredCategories();

  if (loading) {
    return <div className="category-dropdown-loading">Loading categories...</div>;
  }

  return (
    <div className="category-dropdown">
      <div 
        className="category-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value?.name || placeholder}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className="category-dropdown-menu">
          <div className="category-search">
            <Search size={18} strokeWidth={2} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {!showCustomInput ? (
            <>
              <button 
                className="custom-category-button"
                onClick={() => setShowCustomInput(true)}
              >
                <Plus size={18} strokeWidth={2} />
                Custom Category (Can't find yours? Type your own)
              </button>

              <div className="category-divider"></div>

              {searchTerm ? (
                // Flat search results
                <div className="category-list">
                  {filteredCategories.map(cat => (
                    <button
                      key={cat.id}
                      className="category-option"
                      onClick={() => handleSelect(cat)}
                    >
                      {cat.name}
                      <span className="category-group-tag">{cat.group}</span>
                    </button>
                  ))}
                </div>
              ) : (
                // Grouped display
                <div className="category-groups">
                  {Object.entries(categories).map(([group, cats]) => (
                    <div key={group} className="category-group">
                      <div className="category-group-header">{group}</div>
                      {cats.map(cat => (
                        <button
                          key={cat.id}
                          className="category-option"
                          onClick={() => handleSelect(cat)}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="custom-category-input">
              <input
                type="text"
                placeholder="Enter custom category name..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateCustom()}
                autoFocus
              />
              <div className="custom-category-actions">
                <button onClick={handleCreateCustom} className="btn-primary">
                  Create
                </button>
                <button onClick={() => setShowCustomInput(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;