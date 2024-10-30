// TooltipHistoryDrawer.js
import React, { useState } from 'react';
import TooltipPreview from './TooltipPreview';
import './TooltipHistoryDrawer.css';

function TooltipHistoryDrawer() {
  const [isOpen, setIsOpen] = useState(true);
  const [history, setHistory] = useState([
    // Example history data
    {
      icon: '',
      name: 'Sample Tooltip 1',
      description: 'This is a sample description.',
      attributes: [],
    },
    // Add more history items as needed
  ]);

  return (
    <div className={`tooltip-history-drawer ${isOpen ? 'open' : 'closed'}`}>
      <div className="drawer-header">
        <h2>Tooltip History</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>
      {isOpen && (
        <div className="history-list">
          {history.map((tooltipData, index) => (
            <div key={index} className="history-item">
              <TooltipPreview tooltipData={tooltipData} />
              <div className="history-item-actions">
                <button>Edit</button>
                <button>Share</button>
                <button>Download</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TooltipHistoryDrawer;
