// AttributeField.js
import React from 'react';
import './AttributeField.css';

function AttributeField({ attribute, updateAttribute }) {
  const { label, value, type } = attribute;

  return (
    <div className="attribute-field">
      <div className="attribute-label">{label}:</div>
      <input
        type="text"
        value={value}
        onChange={(e) =>
          updateAttribute({ ...attribute, value: e.target.value })
        }
      />
    </div>
  );
}

export default AttributeField;
