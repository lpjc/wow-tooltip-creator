// App.js
import React, { useState } from 'react';
import TooltipDesigner from './TooltipDesigner';
import TooltipHistoryDrawer from './TooltipHistoryDrawer';
import FooterMenu from './FooterMenu';
import { Analytics } from "@vercel/analytics/react";
import './App.css';

function App() {
  const [savedTooltips, setSavedTooltips] = useState([]);
  const [currentTooltipData, setCurrentTooltipData] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleSaveTooltip = (tooltipData) => {
    setSavedTooltips([...savedTooltips, tooltipData]);
    setCurrentTooltipData(null);
  };

  const handleEditTooltip = (tooltipData) => {
    setCurrentTooltipData(tooltipData);
  };

  return (
    <>
      <div className="app">
        <Analytics />
        <div className="app-container">
          <TooltipDesigner
            onSave={handleSaveTooltip}
            initialTooltipData={currentTooltipData}
          />
          <TooltipHistoryDrawer
            savedTooltips={savedTooltips}
            onEditTooltip={handleEditTooltip}
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
          />
        </div>
        <FooterMenu />
        <button className="history-button" onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
          Tooltip History
          {savedTooltips.length > 0 && <span className="badge">{savedTooltips.length}</span>}
        </button>
      </div>
    </>
  );
}

export default App;