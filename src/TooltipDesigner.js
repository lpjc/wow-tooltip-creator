// TooltipDesigner.js
import React, { useState } from 'react';
import IconSelector from './IconSelector';
import AddAttributeButton from './AddAttributeButton';
import AttributeField from './AttributeField';
import './TooltipDesigner.css';

function TooltipDesigner() {
  const [tooltipData, setTooltipData] = useState({
    icon: '', // Placeholder icon
    name: 'Click to edit name',
    description: 'Click to edit description',
    attributes: [],
  });
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

  // Handle updating tooltip data
  const updateTooltipData = (field, value) => {
    setTooltipData({ ...tooltipData, [field]: value });
  };

  // Handle adding new attributes
  const addAttribute = (attribute) => {
    setTooltipData({
      ...tooltipData,
      attributes: [...tooltipData.attributes, attribute],
    });
  };

  return (
    <div className="tooltip-designer-container">
      {/* Main Container */}
      <div className="main-container">
        {/* Tooltip Preview */}
        <div className="tooltip-preview-container">
          <div
            className="preview-icon"
            onClick={() => setIsIconSelectorOpen(true)}
          >
            {tooltipData.icon ? (
              <img src={`/icons/${tooltipData.icon}`} alt="Icon" />
            ) : (
              <div className="placeholder-icon">Icon</div>
            )}
          </div>
          <div className="tooltip-preview-body">
            <div className="tooltip-design">
              {/* Editable Name */}
              <div
                className="tooltip-name"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateTooltipData('name', e.target.innerText)}
              >
                {tooltipData.name}
              </div>
              {/* Editable Description */}
              <div
                className="tooltip-description"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  updateTooltipData('description', e.target.innerText)
                }
              >
                {tooltipData.description}
              </div>
              {/* Display Attributes */}
              {tooltipData.attributes.map((attr, index) => (
                <AttributeField
                  key={index}
                  attribute={attr}
                  updateAttribute={(newAttr) => {
                    const updatedAttributes = [...tooltipData.attributes];
                    updatedAttributes[index] = newAttr;
                    setTooltipData({
                      ...tooltipData,
                      attributes: updatedAttributes,
                    });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Add Attribute Buttons */}
        <div className="add-attribute-section">
          <AddAttributeButton onAdd={addAttribute} />
        </div>
      </div>

      {/* Icon Selector Modal */}
      {isIconSelectorOpen && (
        <IconSelector
          onSelect={(icon) => {
            updateTooltipData('icon', icon);
            setIsIconSelectorOpen(false);
          }}
          onClose={() => setIsIconSelectorOpen(false)}
        />
      )}
    </div>
  );
}

export default TooltipDesigner;
