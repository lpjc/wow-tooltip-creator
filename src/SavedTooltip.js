// SavedTooltip.js
import React from 'react';
import './SavedTooltip.css';

function SavedTooltip({ tooltipData }) {
  if (!tooltipData) {
    return null;
  }

  const { icon, name, description, attributes = [] } = tooltipData;

  // Fallback for missing icon
  const tooltipIcon = icon
    ? `/icons/${icon}`
    : 'https://db.ascension.gg/static/images/wow/icons/large/inv_misc_questionmark.jpg';

  return (
    <div className="saved-tooltip-container">
      {/* Icon Section */}
      <div className="iconlarge">
        <div
          className="icon-image"
          style={{ backgroundImage: `url('${tooltipIcon}')` }}
        ></div>
      </div>

      {/* Tooltip Content */}
      <div className="wowhead-tooltip">
        <div className="tooltip-content">
          <b className="tooltip-name">{name}</b>
          {/* Render additional attributes */}
          {attributes
            .filter((attr) => attr.label !== 'Talent')
            .map((attr, index) => (
              <div key={index} className="tooltip-attribute">
                {attr.value}
              </div>
            ))}
          <div className="tooltip-description">{description}</div>
        </div>
      </div>
    </div>
  );
}

export default SavedTooltip;
