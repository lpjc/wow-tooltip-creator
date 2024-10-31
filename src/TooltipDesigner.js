// TooltipDesigner.js
import React, { useState } from 'react';
import IconSelector from './IconSelector';
import AddAttributeButton from './AddAttributeButton';
import AttributeField from './AttributeField';
import './TooltipDesigner.css';

function TooltipDesigner({ onSave }) {
  const [tooltipData, setTooltipData] = useState({
    icon: '', // Placeholder icon
    name: 'Click to edit name',
    description: 'Click to edit description',
    attributes: [],
  });
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

  // Function to update tooltip data
  const updateTooltipData = (field, value) => {
    setTooltipData({ ...tooltipData, [field]: value });
  };

  // Save function
  const handleSave = () => {
    onSave(tooltipData);
  };

  // Clear function
  const handleClear = () => {
    setTooltipData({
      icon: '',
      name: 'Click to edit name',
      description: 'Click to edit description',
      attributes: [],
    });
  };

  // Function to toggle attribute
  const handleToggleAttribute = (attributeLabel) => {
    const existingAttributeIndex = tooltipData.attributes.findIndex(
      (attr) => attr.label === attributeLabel
    );
    if (existingAttributeIndex > -1) {
      // Remove the attribute
      const updatedAttributes = [...tooltipData.attributes];
      updatedAttributes.splice(existingAttributeIndex, 1);
      setTooltipData({ ...tooltipData, attributes: updatedAttributes });
    } else {
      // Add the attribute
      setTooltipData({
        ...tooltipData,
        attributes: [
          ...tooltipData.attributes,
          { label: attributeLabel, value: '', type: 'text' },
        ],
      });
    }
  };

  return (
    <div className="tooltip-designer-container">
      {/* Main Container */}
      <div className="main-container">
        {/* Tooltip Preview */}
        <div className="tooltip-preview-container">
          <div className="left-column">
            {/* Action Buttons */}


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
          </div>

          <div className="tooltip-preview-body">
            <div className="tooltip-design">
              {/* Tooltip Content */}
              <div className="tooltip-content">
                <div className="tooltip-header">
                  {/* Editable Name */}
                  <div
                    className="tooltip-name"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateTooltipData('name', e.target.innerText)
                    }
                  >
                    {tooltipData.name}
                  </div>
                  {/* Display Talent attribute on top-right if present */}
                  {tooltipData.attributes.some(
                    (attr) => attr.label === 'Talent'
                  ) && (
                    <div className="talent-label">Talent</div>
                  )}
                </div>
                {/* Display Attributes */}
                {tooltipData.attributes
                  .filter((attr) => attr.label !== 'Talent')
                  .map((attr, index) => (
                    <AttributeField
                      key={index}
                      attribute={attr}
                      updateAttribute={(newAttr) => {
                        const updatedAttributes = [...tooltipData.attributes];
                        updatedAttributes[
                          tooltipData.attributes.findIndex(
                            (a) => a.label === attr.label
                          )
                        ] = newAttr;
                        setTooltipData({
                          ...tooltipData,
                          attributes: updatedAttributes,
                        });
                      }}
                    />
                  ))}
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
              </div>
            </div>
          </div>
          <div className="action-buttons">
              <button onClick={handleSave} className="save-button">
                Save
              </button>
              <button onClick={handleClear} className="clear-button">
                Clear
              </button>
            </div>

        </div>

        {/* Add Attribute Buttons */}
        <div className="add-attribute-section">
          <AddAttributeButton
            attributes={tooltipData.attributes}
            onToggleAttribute={handleToggleAttribute}
          />
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
