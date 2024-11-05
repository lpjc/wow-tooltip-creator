// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;
const ICONS_PER_PAGE = 50; // Set the number of icons per page

// Enable CORS for your React app
app.use(cors({
  origin: 'http://localhost:3000' // Your React app's URL
}));

// Cache object (simple in-memory cache)
const cache = {
  data: null,
  timestamp: null,
  TTL: 60 * 60 * 1000, // 1 hour in milliseconds

  async get(key) {
    if (!this.data || !this.timestamp) return null;
    
    // Check if cache has expired
    if (Date.now() - this.timestamp > this.TTL) {
      this.data = null;
      this.timestamp = null;
      return null;
    }
    
    return this.data;
  },

  async set(key, value) {
    this.data = value;
    this.timestamp = Date.now();
  }
};

// Icons endpoint with pagination
app.get('/api/icons', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || ICONS_PER_PAGE;
  
  try {
    // Check cache first
    const cached = await cache.get('icons');
    let icons;
    if (cached) {
      icons = cached.icons;
    } else {
      // If not cached, read the public/icons directory
      const iconsPath = path.join(__dirname, '../public/icons');
      const files = await fs.readdir(iconsPath);
      
      // Filter for valid icon files
      icons = files.filter(file => /\.(png|jpg|svg|gif)$/i.test(file));
      
      // Cache the result
      await cache.set('icons', { icons });
    }
    
    // Calculate pagination
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
      error: 'Failed to load icons',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.listen(PORT, () => {
  console.log(`Icon server running on port ${PORT}`);
});
