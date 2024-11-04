// SavedTooltip.js
import React from 'react';
import './SavedTooltip.css';

function SavedTooltip({ tooltipData }) {
  if (!tooltipData) {
    return null;
  }

  const { icon, name, description, attributes = [] } = tooltipData;

  const tooltipIcon = icon
    ? `/icons/${icon}`
    : 'https://db.ascension.gg/static/images/wow/icons/large/inv_misc_questionmark.jpg';

  const isTalent = attributes.some((attr) => attr.label === 'Talent');

  // Group attributes
  const costAttributes = attributes.filter(attr => 
    attr.label === 'Cost' || attr.label === 'Secondary Cost'
  );
  const rangeAttribute = attributes.find(attr => attr.label === 'Range');
  const castTimeAttribute = attributes.find(attr => attr.label === 'Cast Time');
  const cooldownAttribute = attributes.find(attr => attr.label === 'Cooldown');
  const requirementsAttribute = attributes.find(attr => attr.label === 'Requirements');
  const chargesAttribute = attributes.find(attr => attr.label === 'Charges');

  return (
    <div className="saved-tooltip-container">
      <div className="iconlarge">
        <div
          className="icon-image"
          style={{ backgroundImage: `url('${tooltipIcon}')` }}
        ></div>
      </div>

      <div className="wowhead-tooltip">
        <div className="tooltip-content">
          <div className="tooltip-header">
            <b className="tooltip-name">{name}</b>
            {isTalent && <div className="talent-label">Talent</div>}
          </div>
          
          {/* Cost and Range Row */}
          {(costAttributes.length > 0 || rangeAttribute) && (
            <div className="tooltip-row">
              <div className="tooltip-left">
                {costAttributes.map((attr, index) => (
                  <div key={index} className="tooltip-attribute">
                    {attr.displayValue}
                  </div>
                ))}
              </div>
              {rangeAttribute && (
                <div className="tooltip-right">
                  <div className="tooltip-attribute right-aligned">
                    {rangeAttribute.displayValue}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cast Time and Cooldown Row */}
          {(castTimeAttribute || cooldownAttribute) && (
            <div className="tooltip-row">
              {castTimeAttribute && (
                <div className="tooltip-left">
                  <div className="tooltip-attribute">
                    {castTimeAttribute.displayValue}
                  </div>
                </div>
              )}
              {cooldownAttribute && (
                <div className="tooltip-right">
                  <div className="tooltip-attribute right-aligned">
                    {cooldownAttribute.displayValue}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Charges */}
          {chargesAttribute && (
            <div className="tooltip-row">
              <div className="tooltip-attribute">
                {chargesAttribute.displayValue}
              </div>
            </div>
          )}

          {/* Requirements */}
          {requirementsAttribute && (
            <div className="tooltip-row">
              <div className="tooltip-attribute">
                {requirementsAttribute.displayValue}
              </div>
            </div>
          )}

          <div className="tooltip-description">{description}</div>
        </div>
      </div>
    </div>
  );
}

export default SavedTooltip;