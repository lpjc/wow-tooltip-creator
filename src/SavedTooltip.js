// Update the attributes section in SavedTooltip.js:

function SavedTooltip({ tooltipData }) {
  if (!tooltipData) {
    return null;
  }

  const { icon, name, description, attributes = [] } = tooltipData;

  const tooltipIcon = icon
    ? `/icons/${icon}`
    : 'https://db.ascension.gg/static/images/wow/icons/large/inv_misc_questionmark.jpg';

  const isTalent = attributes.some((attr) => attr.label === 'Talent');

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
          
          <div className="tooltip-attributes-wrapper">
            <div className="tooltip-attributes-left">
              {attributes
                .filter(attr => attr.label !== 'Talent' && attr.label !== 'Cooldown')
                .map((attr, index) => (
                  <div key={index} className="tooltip-attribute">
                    {attr.displayValue}
                  </div>
                ))}
            </div>
            <div className="tooltip-attributes-right">
              {attributes
                .filter(attr => attr.label === 'Cooldown')
                .map((attr, index) => (
                  <div key={index} className="tooltip-attribute right-aligned">
                    {attr.displayValue}
                  </div>
                ))}
            </div>
          </div>

          <div className="tooltip-description">{description}</div>
        </div>
      </div>
    </div>
  );
}

export default SavedTooltip;