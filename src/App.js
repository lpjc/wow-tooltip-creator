// App.js
import React, { useState, useEffect } from 'react';
import TooltipDesigner from './TooltipDesigner';
import { FixedSizeGrid as Grid } from 'react-window';
import './App.css';

function App() {
  return (
    <div className="App">
      <TooltipDesigner />
    </div>
  );
}

export default App;
