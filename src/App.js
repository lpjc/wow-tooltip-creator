// App.js
import React from 'react';
import TooltipDesigner from './TooltipDesigner';
import TooltipHistoryDrawer from './TooltipHistoryDrawer';
import FooterMenu from './FooterMenu';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="app-container">
        <TooltipDesigner />
        <TooltipHistoryDrawer />
      </div>
      <div className="footer-container">
        <FooterMenu />
      </div>
    </div>
  );
}

export default App;
