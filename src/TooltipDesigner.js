// TooltipDesigner.js
import React, { useState, useEffect } from 'react';
import IconSelector from './IconSelector';
import AddAttributeButton from './AddAttributeButton';
import AttributeField from './AttributeField';
import './TooltipDesigner.css';

function TooltipDesigner({ onSave, initialTooltipData }) {
  const placeholderName = 'Click to edit name';
  const placeholderDescription = 'Click to edit description';

  const [tooltipData, setTooltipData] = useState({
    icon: '',
    name: placeholderName,
    description: placeholderDescription,
    attributes: [],
  });

  useEffect(() => {
    if (initialTooltipData) {
      setTooltipData({
        icon: initialTooltipData.icon || '',
        name: initialTooltipData.name || placeholderName,
        description: initialTooltipData.description || placeholderDescription,
        attributes: initialTooltipData.attributes || [],
      });
    } else {
      setTooltipData({
        icon: '',
        name: placeholderName,
        description: placeholderDescription,
        attributes: [],
      });
    }
  }, [initialTooltipData]);

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
      name: placeholderName,
      description: placeholderDescription,
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
          { label: attributeLabel, value: attributeLabel, type: 'text' },
        ],
      });
    }
  };

  return (
    <div className="tooltip-designer-container">
      <div className="main-container">
        <div className="tooltip-preview-container">
          <div className="left-column">
            <div
              className="preview-icon"
              onClick={() => setIsIconSelectorOpen(true)}
            >
              {tooltipData.icon ? (
                <img src={`/icons/${tooltipData.icon}`} alt="Icon" />
              ) : (
                <img
                  src="https://db.ascension.gg/static/images/wow/icons/large/inv_misc_questionmark.jpg"
                  alt="Default Icon"
                />
              )}
            </div>
          </div>

          <div className="tooltip-preview-body">
            <div className="tooltip-design">
              <div className="tooltip-content">
                <div className="tooltip-header">
                  <div
                    className="tooltip-name"
                    contentEditable
                    suppressContentEditableWarning
                    onFocus={(e) => {
                      if (tooltipData.name === placeholderName) {
                        e.target.innerText = '';
                      }
                    }}
                    onBlur={(e) => {
                      const newValue = e.target.innerText.trim();
                      updateTooltipData('name', newValue || placeholderName);
                      if (!newValue) e.target.innerText = placeholderName;
                    }}
                  >
                    {tooltipData.name}
                  </div>
                  {tooltipData.attributes.some(
                    (attr) => attr.label === 'Talent'
                  ) && <div className="talent-label">Talent</div>}
                </div>

                <div className="tooltip-attributes-container">
                  <div className="tooltip-attributes-left">
                    {tooltipData.attributes
                      .filter(attr => attr.label !== 'Talent' && attr.label !== 'Cooldown')
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
                  </div>
                  <div className="tooltip-attributes-right">
                    {tooltipData.attributes
                      .filter(attr => attr.label === 'Cooldown')
                      .map((attr, index) => (
                        <AttributeField
                          key={index}
                          attribute={attr}
                          rightAligned={true}
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
                  </div>
                </div>

                <div
                  className="tooltip-description"
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={(e) => {
                    if (tooltipData.description === placeholderDescription) {
                      e.target.innerText = '';
                    }
                  }}
                  onBlur={(e) => {
                    const newValue = e.target.innerText.trim();
                    updateTooltipData(
                      'description',
                      newValue || placeholderDescription
                    );
                    if (!newValue) e.target.innerText = placeholderDescription;
                  }}
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

        <div className="add-attribute-section">
          <AddAttributeButton
            attributes={tooltipData.attributes}
            onToggleAttribute={handleToggleAttribute}
          />
        </div>
      </div>

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
