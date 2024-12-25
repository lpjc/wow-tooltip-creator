// FooterMenu.js
import React from 'react';
import './FooterMenu.css';

function FooterMenu() {
  return (
    <div className="footer-menu">
      <div className="footer-text">
        World of Warcraft Tooltip Maker by <a href="https://www.linkedin.com/in/larsudraabstegn/" target="_blank" rel="noopener noreferrer">
          Lars!
        </a> © 2024-2025
        <span className="version">v1.0.4</span>
      </div>
    </div>
  );
}

export default FooterMenu;