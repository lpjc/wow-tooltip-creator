// TooltipHistoryDrawer.jsx
import React, { useState, useRef } from 'react';
import SavedTooltip from './SavedTooltip';
import './TooltipHistoryDrawer.css';
import { FaChevronLeft, FaChevronRight, FaEdit, FaDownload, FaShareAlt } from 'react-icons/fa';
import html2canvas from 'html2canvas';

function TooltipHistoryDrawer({ savedTooltips, onEditTooltip, onShareTooltip }) {
  const [isOpen, setIsOpen] = useState(true);
  const tooltipRefs = useRef({});

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleDownload = async (tooltipData, index) => {
    const tooltipElement = tooltipRefs.current[index];
    if (!tooltipElement) return;

    try {
      const canvas = await html2canvas(tooltipElement, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${tooltipData.name || 'tooltip'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating tooltip image:', error);
    }
  };

  // Reverse the tooltips array to show newest first
  const reversedTooltips = [...savedTooltips].reverse();

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
          {reversedTooltips.map((tooltipData, index) => (
            <div key={index} className="history-item">
              <div className='tooltip-container' ref={el => (tooltipRefs.current[index] = el)}>
                <SavedTooltip tooltipData={tooltipData} />
              </div>
              <div className="history-item-actions">
                <button className="button" onClick={() => onEditTooltip(tooltipData)}>
                  <FaEdit /> Edit
                </button>
                <button
                  className="button download-button"
                  onClick={() => handleDownload(tooltipData, index)}
                >
                  <FaDownload /> Download
                </button>
                <button
                  className="button share-button"
                  onClick={() => onShareTooltip(tooltipData)}
                >
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="collapsed-history-list">
          {reversedTooltips.map((tooltipData, index) => (
            <div key={index} className="collapsed-history-item">
              <div className="tooltip-icon-wrapper">
                <img
                  onClick={() => onEditTooltip(tooltipData)}
                  src={
                    tooltipData.icon
                      ? `/icons/${tooltipData.icon}`
                      : 'https://db.ascension.gg/static/images/wow/icons/large/inv_misc_questionmark.jpg'
                  }
                  alt={tooltipData.name}
                  title={`Edit ${tooltipData.name}`}
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
