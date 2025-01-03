// AddAttributeButton.js
import React from 'react';
import './AddAttributeButton.css';

function AddAttributeButton({ attributes, onToggleAttribute }) {
  // List of possible attributes to add
  const attributeOptions = [
    'Cooldown',
    'Cast Time',
    'Cost',
    'Secondary Cost',
    'Range',
    'Requirements',
    'Talent',
    'Charges',
  ];

  return (
    <div className="add-attribute-buttons">
      {attributeOptions.map((attr, index) => {
        const isAdded = attributes.some((a) => a.label === attr);
        return (
          <button
            key={index}
            className={`attribute-toggle-btn ${isAdded ? 'remove' : 'add'}`}
            onClick={() => onToggleAttribute(attr)}
          >
            {isAdded ? `- ${attr}` : `+ ${attr}`}
          </button>
        );
      })}
    </div>
  );
}

export default AddAttributeButton;
