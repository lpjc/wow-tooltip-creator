// IconSelector.js
import React, { useState, useEffect } from 'react';
import './IconSelector.css';

function IconSelector({ onSelect, onClose }) {
  const [iconList, setIconList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const iconsPerPage = 60;

  // Fetch icon list
  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await fetch('/icons.json');
        const icons = await response.json();
        setIconList(icons);
      } catch (error) {
        console.error('Error fetching icons:', error);
      }
    };
    fetchIcons();
  }, []);

  // Filter and paginate icons based on search term
  const filteredIcons = iconList.filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedIcons = filteredIcons.slice(
    (currentPage - 1) * iconsPerPage,
    currentPage * iconsPerPage
  );

  return (
    <div className="icon-selector-modal">
      <div className="icon-selector-content">
        <div className="icon-selector-header">
          <label>Icon:</label>
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={onClose}>Close</button>
        </div>
        <div className="icon-grid">
          {paginatedIcons.map((iconName) => (
            <div
              key={iconName}
              className="image-wrapper"
              onClick={() => onSelect(iconName)}
            >
              <img
                src={`/icons/${iconName}`}
                alt={iconName}
                className="actual-image visible"
              />
            </div>
          ))}
        </div>
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
          <button onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default IconSelector;
