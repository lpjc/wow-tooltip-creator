// scripts/generateIconsJson.js
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../public/icons');
const outputFile = path.join(__dirname, '../public/icons.json');

fs.readdir(iconsDir, (err, files) => {
  if (err) {
    console.error('Error reading icons directory:', err);
    return;
  }

  const icons = files.filter((file) => file.toLowerCase().endsWith('.png'));

  fs.writeFile(outputFile, JSON.stringify(icons), (err) => {
    if (err) {
      console.error('Error writing icons.json:', err);
    } else {
      console.log('icons.json generated successfully.');
    }
  });
});
