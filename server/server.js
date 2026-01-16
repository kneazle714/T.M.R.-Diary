const express = require('express');
const path = require('path');
const fs = require('fs');
// const bodyparser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');

const memoryController = require('./memoryController');

const PORT = process.env.PORT || 3000;

const app = express();

// handle parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Routes
app.post('/hello', (req, res) => {
  res.json('Hello, my name is Tom Riddle.');
});

app.post('/who', (req, res) => {
  res.json(
    'I am the owner of this diary. Now, this diary is at your disposal.'
  );
});

app.post('/finddiary', memoryController.findMemory, (req, res) => {
  return res.json(res.locals.memory);
});

app.post('/creatediary', memoryController.createMemory, (req, res) => {
  return res.json('Legilimens');
});

app.post('/updatediary', memoryController.updateMemory, (req, res) => {
  res.json('Imperio');
});

app.post('/deletediary', memoryController.deleteMemory, (req, res) => {
  res.json('Obliviate');
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  console.log('=== PRODUCTION MODE ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Serving static files from:', distPath);
  console.log('Current working directory:', process.cwd());
  
  // Check if dist folder exists
  if (!fs.existsSync(distPath)) {
    console.error('❌ ERROR: dist folder does not exist at:', distPath);
    console.error('Make sure to run "npm run build" before starting the server.');
  } else {
    const distContents = fs.readdirSync(distPath);
    console.log('✅ dist folder found. Contents:', distContents);
    
    const indexPath = path.join(distPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      console.error('❌ ERROR: index.html not found in dist folder!');
    } else {
      console.log('✅ index.html found');
    }
    
    const bundlePath = path.join(distPath, 'bundle.js');
    if (!fs.existsSync(bundlePath)) {
      console.error('❌ ERROR: bundle.js not found in dist folder!');
    } else {
      const stats = fs.statSync(bundlePath);
      console.log('✅ bundle.js found, size:', (stats.size / 1024).toFixed(2), 'KB');
    }
  }
  
  // Serve static files (JS, CSS, images, etc.) from dist folder
  app.use(express.static(distPath));
  
  // Serve React app for all GET routes (for client-side routing)
  // This must be last, after all API routes
  app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(500).send('Error: index.html not found. Build may have failed.');
    }
  });
} else {
  // Development: serve html from client folder
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });
  
  // catch all route handler for development
  app.use('*', (req, res) => {
    return res
      .status(404)
      .sendFile(path.resolve(__dirname, '../client/404.html'));
  });
}

// // global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// module.exports = app;

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
