// CurrentTooltip.js
import React from 'react';
import AttributeField from './AttributeField';
import './CurrentTooltip.css';

const CurrentTooltip = ({ tooltipData, onEditField, onIconClick }) => {
  const { name, description, icon, attributes = [] } = tooltipData;
  
  const tooltipIcon = icon
    ? `/icons/${icon}`
    : 'https://db.ascension.gg/static/images/wow/icons/large/inv_misc_questionmark.jpg';

  const isTalent = attributes.some((attr) => attr.label === 'Talent');
  
  // Group attributes by type
  const costAttributes = attributes.filter(attr => 
    attr.label === 'Cost' || attr.label === 'Secondary Cost'
  );
  const rangeAttribute = attributes.find(attr => attr.label === 'Range');
  const castTimeAttribute = attributes.find(attr => attr.label === 'Cast Time');
  const cooldownAttribute = attributes.find(attr => attr.label === 'Cooldown');
  const requirementsAttribute = attributes.find(attr => attr.label === 'Requirements');
  const chargesAttribute = attributes.find(attr => attr.label === 'Charges');

  // Handler for attribute updates
  const handleAttributeUpdate = (attribute, updatedAttribute) => {
    const updatedAttributes = attributes.map(attr => 
      attr.label === attribute.label ? updatedAttribute : attr
    );
    onEditField('attributes', updatedAttributes);
  };

  return (
    <div className="current-tooltip-container">
      <div className="iconlarge" onClick={onIconClick}>
        <div
          className="icon-image"
          style={{ backgroundImage: `url('${tooltipIcon}')`, cursor: 'pointer' }}
        ></div>
      </div>

      <div className="wowhead-tooltip">
        <div className="tooltip-content">
          <div className="tooltip-header">
            <div
              className="tooltip-name"
              contentEditable
              suppressContentEditableWarning
              onFocus={(e) => {
                if (e.target.innerText === 'Name') {
                  e.target.innerText = '';
                }
              }}
              onBlur={(e) => {
                const newValue = e.target.innerText.trim();
                onEditField('name', newValue || 'Name');
                if (!newValue) e.target.innerText = 'Name';
              }}
            >
              {name || 'Name'}
            </div>
            {isTalent && (
              <AttributeField
                attribute={attributes.find(attr => attr.label === 'Talent')}
                updateAttribute={(updatedAttr) => handleAttributeUpdate(
                  attributes.find(attr => attr.label === 'Talent'),
                  updatedAttr
                )}
              />
            )}
          </div>

          {/* Cost and Range Row */}
          {(costAttributes.length > 0 || rangeAttribute) && (
            <div className="tooltip-row">
              <div className="tooltip-left">
                {costAttributes.map((attr, index) => (
                  <AttributeField
                    key={index}
                    attribute={attr}
                    updateAttribute={(updatedAttr) => handleAttributeUpdate(attr, updatedAttr)}
                  />
                ))}
              </div>
              {rangeAttribute && (
                <div className="tooltip-right">
                  <AttributeField
                    attribute={rangeAttribute}
                    updateAttribute={(updatedAttr) => handleAttributeUpdate(rangeAttribute, updatedAttr)}
                    rightAligned
                  />
                </div>
              )}
            </div>
          )}

          {/* Cast Time and Cooldown Row */}
          {(castTimeAttribute || cooldownAttribute) && (
            <div className="tooltip-row">
              {castTimeAttribute && (
                <div className="tooltip-left">
                  <AttributeField
                    attribute={castTimeAttribute}
                    updateAttribute={(updatedAttr) => handleAttributeUpdate(castTimeAttribute, updatedAttr)}
                  />
                </div>
              )}
              {cooldownAttribute && (
                <div className="tooltip-right">
                  <AttributeField
                    attribute={cooldownAttribute}
                    updateAttribute={(updatedAttr) => handleAttributeUpdate(cooldownAttribute, updatedAttr)}
                    rightAligned
                  />
                </div>
              )}
            </div>
          )}

          {/* Charges */}
          {chargesAttribute && (
            <div className="tooltip-row">
              <AttributeField
                attribute={chargesAttribute}
                updateAttribute={(updatedAttr) => handleAttributeUpdate(chargesAttribute, updatedAttr)}
              />
            </div>
          )}

          {/* Requirements */}
          {requirementsAttribute && (
            <div className="tooltip-row">
              <AttributeField
                attribute={requirementsAttribute}
                updateAttribute={(updatedAttr) => handleAttributeUpdate(requirementsAttribute, updatedAttr)}
              />
            </div>
          )}

          <div 
            className="tooltip-description"
            contentEditable
            suppressContentEditableWarning
            onFocus={(e) => {
              if (e.target.innerText === 'Description') {
                e.target.innerText = '';
              }
            }}
            onBlur={(e) => {
              const newValue = e.target.innerText.trim();
              onEditField('description', newValue || 'Description');
              if (!newValue) e.target.innerText = 'Description';
            }}
          >
            {description || 'Description'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTooltip;