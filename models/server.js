const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.usersPath = '/api/users';
    this.authPath = '/api/auth';

    //Connect DB
    this.connectDB();

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Parse and read body
    this.app.use(express.json());

    // Public Folder
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.authPath, require('../routes/auth.routes'));
    this.app.use(this.usersPath, require('../routes/user.routes'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
