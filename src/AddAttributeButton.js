// AddAttributeButton.js
import React, { useState } from 'react';
import './AddAttributeButton.css';

function AddAttributeButton({ onAdd }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // List of possible attributes to add
  const attributeOptions = [
    { label: 'Cooldown', type: 'text' },
    { label: 'Cast Time', type: 'text' },
    { label: 'Cost', type: 'text' },
    { label: 'Range', type: 'text' },
    { label: 'Requirements', type: 'text' },
    // Add more attributes as needed
  ];

  return (
    <div className="add-attribute-button">
      <button
        className="add-attribute-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        + Add Attribute
      </button>
      {isMenuOpen && (
        <div className="attribute-menu">
          {attributeOptions.map((attr, index) => (
            <div
              key={index}
              className="attribute-option"
              onClick={() => {
                onAdd({ label: attr.label, value: '', type: attr.type });
                setIsMenuOpen(false);
              }}
            >
              {attr.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddAttributeButton;
