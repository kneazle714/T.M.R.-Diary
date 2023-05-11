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

// app.post('/test',(req,res)=>{
//   console.log('req.body: ', req.body);
//   res.json(req.body);
// });

// // POST

app.post('/hello', (req, res) => {
  res.json('Hello, my name is Tom Riddle.');
});

app.post('/who', (req, res) => {
  res.json('I am the owner of this diary. Now, this diary is at your disposal.');
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
