// TooltipPreview.js
import React from 'react';
import './TooltipPreview.css';

function TooltipPreview({ tooltipData }) {
  if (!tooltipData) {
    return null;
  }

  const {
    icon,
    name,
    description,
    attributes = [],
  } = tooltipData;

  // Fallback for missing icon
  const tooltipIcon = icon
    ? `/icons/${icon}`
    : 'https://db.ascension.gg/static/images/wow/icons/large/inv_misc_questionmark.jpg';

  return (
    <div className="tooltip-preview-container">
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
          <div className="tooltip-description">{description}</div>
          {/* Render additional attributes */}
          {attributes.map((attr, index) => (
            <div key={index} className="tooltip-attribute">
              {attr.label}: {attr.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TooltipPreview;
