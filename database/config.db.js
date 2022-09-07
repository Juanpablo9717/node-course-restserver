const mongoose = require('mongoose');

const dbConnection = async () => {
  this.port = process.env.PORT;
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log('\n##  Database connected successfully  ##\n');
    console.log(`Open in: http://localhost:${this.port}\n`);
  } catch (error) {
    throw new Error('Error! Database connection can not be established', error);
  }
};

module.exports = {
  dbConnection,
};
