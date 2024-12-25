// api/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();

// Enable CORS for your frontend domain
app.use(cors({
  origin: ['https://wow-tooltip-creator.vercel.app', 'http://localhost:3000']
}));

// Serve static files from the public directory
app.use('/icons', express.static(path.join(process.cwd(), 'public/icons')));

// Icons endpoint with pagination
app.get('/api/icons', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  
  try {
    const iconsPath = path.join(process.cwd(), 'public/icons');
    const files = await fs.readdir(iconsPath);
    
    const icons = files.filter(file => /\.(png|jpg|svg|gif)$/i.test(file));
    
    const totalPages = Math.ceil(icons.length / limit);
    const start = (page - 1) * limit;
    const paginatedIcons = icons.slice(start, start + limit);

    res.json({
      icons: paginatedIcons,
      currentPage: page,
      totalPages: totalPages,
      totalIcons: icons.length
    });
  } catch (error) {
    console.error('Error reading icons directory:', error);
    res.status(500).json({ 
      error: 'Failed to load icons'
    });
  }
});

// Handle all routes
app.all('*', (req, res) => {
  res.json({ message: 'Welcome to the WoW Tooltip API' });
});

module.exports = app;