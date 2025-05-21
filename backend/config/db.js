const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo successfully");
  } catch (error) {
    console.error("Failed to connect to Mongo", error);
  }
};

module.exports = connectToMongo;  