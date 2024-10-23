// IconSelector.js
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import LazyLoadImage from './lazyLoadImage';
import './IconSelector.css';

function IconSelector({ iconList, selectedIcon, setSelectedIcon }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Set a fixed number of icons per page
  const iconsPerPage = 50; 

  // Filtered icons based on the search term
  const filteredIcons = iconList.filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredIcons.length / iconsPerPage);

  // Get the icons for the current page
  const indexOfLastIcon = (currentPage + 1) * iconsPerPage;
  const indexOfFirstIcon = currentPage * iconsPerPage;
  const currentIcons = filteredIcons.slice(indexOfFirstIcon, indexOfLastIcon);

  // Handle page change
  const handlePageClick = (data) => {
    setLoading(true); // Start loading
    setCurrentPage(data.selected);
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setLoading(true); // Start loading
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to the first page on search
  };

  // Simulate loading delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust delay as needed

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm]);

  return (
    <div className="icon-selector">
      <label>Icon:</label>
      <input
        type="text"
        placeholder="Search icons..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className="icon-grid">
        {currentIcons.map((iconName) => (
          <LazyLoadImage
            key={iconName} // Unique key
            src={`/icons/${iconName}`}
            alt={iconName}
            className={`icon-image ${iconName === selectedIcon ? 'selected' : ''}`}
            onClick={() => setSelectedIcon(iconName)}
            loading={loading}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
          forcePage={currentPage}
        />
      )}
    </div>
  );
}

export default IconSelector;
