import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes';
import { errors } from 'celebrate';

class AppController {
  express: Express;

  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(cors());
    this.express.use(express.json());
  }

  routes() {
    this.express.use(routes);
    this.express.use(errors());
  }
}

export default new AppController();
