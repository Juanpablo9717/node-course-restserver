const express = require('express');
const cors = require('cors');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
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
    this.app.use('/api/users', require('../routes/user.routes'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
