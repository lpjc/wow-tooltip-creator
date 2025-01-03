// FooterMenu.js
import React from 'react';
import './FooterMenu.css';

function FooterMenu() {
  return (
    <div className="footer-menu">
      <div className="footer-text">
        <span className="main-text">
          World of Warcraft Tooltip Maker by <span className="highlight"><a href="https://www.linkedin.com/in/larsudraabstegn/" target="_blank" rel="noopener noreferrer">Lars!</a></span> · © 2025 · v2.1.0 · 
        </span>
        <span className="coffee-text">
          <a href="https://buymeacoffee.com/larsdesign" target="_blank" rel="noopener noreferrer">Buy me a Coffee</a>
        </span>
      </div>
    </div>
  );
}

export default FooterMenu;