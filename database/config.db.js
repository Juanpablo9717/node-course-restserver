const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log('Database connected successfully');
  } catch (error) {
    throw new Error('Error! Database connection can not be established', error);
  }
};

module.exports = {
  dbConnection,
};
