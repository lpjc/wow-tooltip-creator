import React, { useState, useEffect, useRef, useCallback } from 'react';
import './IconSelector.css';
import { ICONS_API_URL } from './config';

const ICONS_PER_PAGE = 50;

function IconSelector({ onSelect, onClose }) {
  const [icons, setIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const imageCache = useRef(new Map()); // Changed from useState to useRef
  const modalRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Fetch icons when component mounts or currentPage changes
  useEffect(() => {
    // Cancel any ongoing fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchIcons = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${ICONS_API_URL}/api/icons?page=${currentPage}&limit=${ICONS_PER_PAGE}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) throw new Error('Failed to fetch icons');

        const data = await response.json();

        setIcons(data.icons);
        setTotalPages(data.totalPages);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchIcons();

    // Cleanup function to abort fetch on unmount or before next fetch
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentPage]);

  // Preload images for the current page only
  useEffect(() => {
    let isCancelled = false;

    const preloadIcons = () => {
      icons.forEach((iconName) => {
        if (!imageCache.current.has(iconName)) {
          const img = new Image();
          img.onload = () => {
            if (!isCancelled) {
              imageCache.current.set(iconName, true);
              // Force re-render to update the loaded images
              // Since imageCache is now a ref, we need to trigger a re-render manually
              setIcons((prevIcons) => [...prevIcons]);
            }
          };
          img.onerror = () => {
            console.error(`Failed to load icon: ${iconName}`);
          };
          img.src = `${ICONS_API_URL}/icons/${iconName}`;
        }
      });
    };

    preloadIcons();

    // Cleanup function to prevent state updates after component unmount
    return () => {
      isCancelled = true;
    };
  }, [icons]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    },
    [totalPages]
  );

  // Optimized image component
  const IconImage = React.memo(({ iconName }) => {
    const isLoaded = imageCache.current.has(iconName);

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
            src={`${ICONS_API_URL}/icons/${iconName}`}
            alt={iconName}
            className="actual-image visible"
          />
        )}
      </div>
    );
  });

  // Handle click outside to close modal
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
              ) : icons.length > 0 ? (
                icons.map((iconName) => (
                  <IconImage key={iconName} iconName={iconName} />
                ))
              ) : (
                <div className="no-results">No icons found.</div>
              )}
            </div>

            {totalPages > 1 && (
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
