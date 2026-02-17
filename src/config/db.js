const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected');
    console.log("bjhdjsbhj",process.env.MONGO_URL);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
module.exports = connectDB;
