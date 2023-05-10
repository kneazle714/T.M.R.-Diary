// const db = require('./memoryModels');

const Memory = require('./memoryModel');

const memoryController = {};

// // create memory
memoryController.createMemory = (req, res, next) => {
  //   const { date, content } = req.body;
  console.log('INSIDE creatememory');
  Memory.create({ date: '5.13', content: 'new day' })
    .then(() => {
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
  // const { date } = req.body;
  Memory.find({ date: '5.12' })
    .then((data) => {
      console.log('memory has been found');
      res.locals = data[0].content;
      return next();
    })
    .catch((err) => {
      res.send('Nothing happened on this day');
    });
};

// // update memory
memoryController.updateMemory = (req, res, next) => {
  //  const { date, content } = req.body;
  Memory.findOneAndUpdate(
    { date: '5.12' },
    { content: 'updated content' },
    { new: true }
  )
    .then(() => {
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

// // delete memory
memoryController.deleteMemory = (req, res, next) => {
  //   const { date } = req.body;
  Memory.findOneAndDelete({ date : '5.12' })
  .then(() => {
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

module.exports = memoryController;
