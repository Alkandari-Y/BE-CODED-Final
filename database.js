require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MGN_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`mongo connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
