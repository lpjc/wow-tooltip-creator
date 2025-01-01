require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

// Import your route handlers
const openaiTooltipHandler = require('./openaiTooltip');
const openaiQueryHandler = require('./openaiQuery');
const findIconHandler = require('./findIcon');

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.path}`);
  next();
});


// Register routes FIRST to ensure they are matched before middleware or catch-all

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5000',
    'https://wow-tooltip-creator.vercel.app',
    'https://WoWTooltipMaker.com'
  ]
}));
app.use(express.json());


// Static icons route
app.use('/icons', express.static(path.join(process.cwd(), 'public/icons')));

// Example icons API
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
      totalPages,
      totalIcons: icons.length
    });
  } catch (error) {
    console.error('Error reading icons directory:', error);
    res.status(500).json({ error: 'Failed to load icons' });
  }
});
app.post('/api/openai-tooltip', openaiTooltipHandler);
app.post('/api/openai-query', openaiQueryHandler);
app.post('/api/find-icon', findIconHandler);
// Catch-all route
app.all('*', (req, res) => {
  res.json({ message: 'Welcome to the WoW Tooltip APIzzzz' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
