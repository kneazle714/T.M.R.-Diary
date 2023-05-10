const express = require('express');
const path = require('path');
// const bodyparser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');

const memoryController = require('./memoryController');

const PORT = 3000;

const app = express();

// handle parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// serve html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// // GET
app.get('/diary', memoryController.findMemory, (req, res) => {
  res.send(res.locals);
});

// // POST
app.post('/diary', memoryController.createMemory, (req, res) => {
  res.send('Legilimens');
});

// PUT
app.put('/diary', memoryController.updateMemory, (req, res) => {
  res.send('Imperio');
});

// DELETE
app.delete('/diary', memoryController.deleteMemory, (req, res) => {
  res.send('Obliviate');
});

// // catch all route handler
app.use('*', (req, res) => {
  return res
    .status(404)
    .sendFile(path.resolve(__dirname, '../client/404.html'));
});

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
  console.log('app is listening on port 3000');
});
