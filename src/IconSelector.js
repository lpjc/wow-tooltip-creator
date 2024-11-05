import React, { useState, useEffect, useRef, useCallback } from 'react';
import './IconSelector.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const ICONS_PER_PAGE = 50;

function IconSelector({ onSelect, onClose }) {
  const [icons, setIcons] = useState([]);
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [imageCache, setImageCache] = useState(new Map());
  const modalRef = useRef(null);
  const abortControllerRef = useRef(null);
  const pageLoadingRef = useRef(new Set());

  // Fetch all icons once on component mount
  useEffect(() => {
    const fetchAllIcons = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/icons/all`, {
          signal: controller.signal
        });
        
        if (!response.ok) throw new Error('Failed to fetch icons');
        
        const data = await response.json();
        setIcons(data.icons);
        setFilteredIcons(data.icons);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllIcons();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handle search and filtering
  useEffect(() => {
    const filtered = icons.filter(icon => 
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIcons(filtered);
    setCurrentPage(1);
  }, [searchTerm, icons]);

  // Preload images for a specific page
  const preloadPage = useCallback(async (page) => {
    if (pageLoadingRef.current.has(page)) return;
    
    const startIndex = (page - 1) * ICONS_PER_PAGE;
    const endIndex = startIndex + ICONS_PER_PAGE;
    const pageIcons = filteredIcons.slice(startIndex, endIndex);
    
    pageLoadingRef.current.add(page);

    await Promise.all(
      pageIcons.map(async (iconName) => {
        if (!imageCache.has(iconName)) {
          try {
            const img = new Image();
            const loadPromise = new Promise((resolve, reject) => {
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error(`Failed to load ${iconName}`));
            });
            img.src = `/icons/${iconName}`;
            await loadPromise;
            setImageCache(prev => new Map(prev).set(iconName, true));
          } catch (error) {
            console.error(`Failed to load icon: ${iconName}`, error);
          }
        }
      })
    );

    pageLoadingRef.current.delete(page);
  }, [filteredIcons, imageCache]);

  // Preload current and adjacent pages
  useEffect(() => {
    const loadPages = async () => {
      // Load current page first
      await preloadPage(currentPage);
      
      // Then load adjacent pages
      if (currentPage > 1) {
        preloadPage(currentPage - 1);
      }
      preloadPage(currentPage + 1);
    };

    loadPages();
  }, [currentPage, preloadPage]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredIcons.length / ICONS_PER_PAGE);
  const startIndex = (currentPage - 1) * ICONS_PER_PAGE;
  const displayedIcons = filteredIcons.slice(startIndex, startIndex + ICONS_PER_PAGE);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  // Optimized image component
  const IconImage = React.memo(({ iconName }) => {
    const isLoaded = imageCache.has(iconName);

    return (
      <div 
        className="image-wrapper"
        onClick={() => isLoaded && onSelect(iconName)}
        role="button"
        tabIndex={0}
      >
        {!isLoaded ? (
          <div className="icon-loading">
            <div className="loading-spinner" />
          </div>
        ) : (
          <img
            src={`/icons/${iconName}`}
            alt={iconName}
            className="actual-image visible"
          />
        )}
      </div>
    );
  });

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="icon-selector-modal" role="dialog">
      <div ref={modalRef} className="icon-selector-content">
        <div className="icon-selector-header">
          <label htmlFor="icon-search">Icon:</label>
          <input
            id="icon-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search icons..."
          />
          <button onClick={onClose}>Close</button>
        </div>

        {error ? (
          <div className="error-message">
            {error}
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <>
            <div className="icon-grid">
              {isLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner" />
                  <p>Loading icons...</p>
                </div>
              ) : displayedIcons.length > 0 ? (
                displayedIcons.map((iconName) => (
                  <IconImage 
                    key={`${iconName}-${currentPage}`} 
                    iconName={iconName} 
                  />
                ))
              ) : (
                <div className="no-results">No icons found.</div>
              )}
            </div>

            {filteredIcons.length > 0 && (
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default IconSelector;