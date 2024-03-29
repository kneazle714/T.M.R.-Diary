const mongoose = require('mongoose');

const MONGO_URI =
  'mongodb+srv://kristenyueran:helloworld@cluster0.tugaa8i.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(MONGO_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: 'memories',
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;

const memorySchema = new Schema({
  date: { type: String, required: true, unique: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model('Memory', memorySchema);
