const mongoose = require('mongoose');

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// MongoDB connection string from environment variable
// Set this in your .env file or deployment platform's environment variables
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI environment variable is not set!');
  console.error('Please set MONGO_URI in your .env file or deployment platform.');
}

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
