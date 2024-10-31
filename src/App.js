// App.js
import React, { useState } from 'react';
import TooltipDesigner from './TooltipDesigner';
import TooltipHistoryDrawer from './TooltipHistoryDrawer';
import FooterMenu from './FooterMenu';
import './App.css';

function App() {
  const [savedTooltips, setSavedTooltips] = useState([]);
  const [currentTooltipData, setCurrentTooltipData] = useState(null);

  const handleSaveTooltip = (tooltipData) => {
    setSavedTooltips([...savedTooltips, tooltipData]);
    setCurrentTooltipData(null); // Clear current tooltip after saving
  };

  const handleEditTooltip = (tooltipData) => {
    setCurrentTooltipData(tooltipData);
  };

  return (
    <div className="app">
      <div className="app-container">
        <TooltipDesigner
          onSave={handleSaveTooltip}
          initialTooltipData={currentTooltipData}
        />
        <TooltipHistoryDrawer
          savedTooltips={savedTooltips}
          onEditTooltip={handleEditTooltip}
        />
      </div>
      <div className="footer-container">
        <FooterMenu />
      </div>
    </div>
  );
}

export default App;
