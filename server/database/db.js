// Database connection setup
// For MongoDB integration, uncomment and configure

/*
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
*/

// For now, using in-memory storage
const db = {
  companies: {},
  analysis: {},
  users: {},
};

module.exports = db;
