// FooterMenu.js
import React from 'react';
import './FooterMenu.css';

function FooterMenu() {
  return (
    <div className="footer-menu">
      <div className="left-menu">
        <button>Settings</button>
      </div>
      <div className="right-menu">
        <button>Help</button>
        <button>About</button>
      </div>
    </div>
  );
}

export default FooterMenu;
