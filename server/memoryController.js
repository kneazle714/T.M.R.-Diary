// const db = require('./memoryModels');

const Memory = require('./memoryModel');

const memoryController = {};

// // create memory
memoryController.createMemory = (req, res, next) => {
  const { date, content } = req.body;
  console.log(req.body);
  console.log(date);
  console.log('INSIDE creatememory');

  Memory.create({ date, content })
    .then(() => {
      // res.locals.memory = data;
      console.log('memory has been saved');
      return next();
    })
    .catch((err) => {
      return next({
        log: 'Error occurred in memoryController.createMemory.',
        status: 400,
        message: { err: 'An error occurred' },
      });
    });
};

// // find memory
memoryController.findMemory = (req, res, next) => {
  const { date } = req.body;
  console.log('INSIDE findmemory:', req.body);
  Memory.find({ date })
    .then((data) => {
      console.log('data is:', data);
      console.log('memory has been found');
      if(data.length === 0) {
        return res.json('Nothing happened on this day');
      }
      res.locals.memory = data[0].content;
      return next();
    })
    .catch((err) => {
      return next({
        log: 'Error occurred in memoryController.findMemory.',
        status: 400,
        message: { err: 'An error occurred' },
      });
    });
};

// // update memory
memoryController.updateMemory = (req, res, next) => {
   const { date, content } = req.body;
   console.log('INSIDE updatememory:', req.body);
  Memory.findOneAndUpdate(
    { date: date},
    { content: content },
    { new: true }
  )
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next({
        log: 'Error occurred in memoryController.updateMemory.',
        status: 400,
        message: { err: 'An error occurred' },
      });
    });
};

// // delete memory
memoryController.deleteMemory = (req, res, next) => {
  const { date } = req.body;
  Memory.findOneAndDelete({ date: date })
  .then(() => {
    return next();
  })
  .catch((err) => {
    return next({
      log: 'Error occurred in memoryController.deleteMemory.',
      status: 400,
      message: { err: 'An error occurred' },
    });
  });
};

module.exports = memoryController;
