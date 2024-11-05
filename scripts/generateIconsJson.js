// scripts/generateIconsJson.js
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../public/icons');
const outputDir = path.join(__dirname, '../public/iconPages'); // Output directory for paginated JSON files
const ICONS_PER_PAGE = 50; // Adjust as needed

// Ensure the public directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Remove existing icons-page-*.json files
const filesInOutputDir = fs.readdirSync(outputDir);
filesInOutputDir.forEach((file) => {
  if (file.startsWith('icons-page-') && file.endsWith('.json')) {
    fs.unlinkSync(path.join(outputDir, file));
  }
});

// Read the icons directory
fs.readdir(iconsDir, (err, files) => {
  if (err) {
    console.error('Error reading icons directory:', err);
    return;
  }

  // Filter for PNG files and sort them alphabetically
  const icons = files
    .filter((file) => file.toLowerCase().endsWith('.png'))
    .sort((a, b) => a.localeCompare(b));

  const totalIcons = icons.length;
  const totalPages = Math.ceil(totalIcons / ICONS_PER_PAGE);

  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * ICONS_PER_PAGE;
    const endIndex = startIndex + ICONS_PER_PAGE;
    const iconsForPage = icons.slice(startIndex, endIndex);

    const pageData = {
      icons: iconsForPage,
      totalIcons: totalIcons,
    };

    const outputFile = path.join(outputDir, `icons-page-${page}.json`);

    // Write the paginated icons JSON file
    fs.writeFileSync(outputFile, JSON.stringify(pageData, null, 2), { flag: 'w' });
  }

  console.log(`Successfully split ${totalIcons} icons into ${totalPages} pages.`);
});
