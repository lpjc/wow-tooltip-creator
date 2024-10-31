// AttributeField.js
import React, { useState } from 'react';
import './AttributeField.css';

function AttributeField({ attribute, updateAttribute }) {
  const { label, value } = attribute;
  const [isEditing, setIsEditing] = useState(false);
  const placeholderText = label;

  const handleFocus = (e) => {
    if (value === placeholderText) {
      e.target.innerText = '';
    }
    setIsEditing(true);
  };

  const handleBlur = (e) => {
    const newValue = e.target.innerText.trim();
    if (newValue === '') {
      updateAttribute({ ...attribute, value: placeholderText });
      e.target.innerText = placeholderText;
    } else {
      updateAttribute({ ...attribute, value: newValue });
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`attribute-field ${isEditing ? 'editing' : ''}`}
      contentEditable
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {value}
    </div>
  );
}

export default AttributeField;
