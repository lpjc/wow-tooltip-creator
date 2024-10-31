// TooltipHistoryDrawer.js
import React, { useState } from 'react';
import SavedTooltip from './SavedTooltip';
import './TooltipHistoryDrawer.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function TooltipHistoryDrawer({ savedTooltips, onEditTooltip }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`tooltip-history-drawer ${isOpen ? 'open' : 'closed'}`}>
      <div className="drawer-header">
        {isOpen && <h2>Tooltip History</h2>}
        <button className="toggle-button" onClick={toggleDrawer}>
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>
      {isOpen ? (
        <div className="history-list">
          {savedTooltips.map((tooltipData, index) => (
            <div key={index} className="history-item">
              <SavedTooltip tooltipData={tooltipData} />
              <div className="history-item-actions">
                <button onClick={() => onEditTooltip(tooltipData)}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="collapsed-history-list">
          {savedTooltips.map((tooltipData, index) => (
            <div key={index} className="collapsed-history-item">
              <div className="tooltip-icon-wrapper">
                <img onClick={() => onEditTooltip(tooltipData)}
                  src={
                    tooltipData.icon
                      ? `/icons/${tooltipData.icon}`
                      : 'https://db.ascension.gg/static/images/wow/icons/large/inv_misc_questionmark.jpg'
                  }
                  alt={tooltipData.name + "Click to Edit"}
                  title={"Edit " + tooltipData.name}
                  className="collapsed-icon"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TooltipHistoryDrawer;
