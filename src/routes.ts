import express from 'express';
import { redisFuncController } from './app/controllers/redisFuncController';

const routes = express.Router();

routes.post('/set', redisFuncController.set);
routes.post('/get', redisFuncController.get);
routes.post('/del', redisFuncController.del);
routes.post('/dbsize', redisFuncController.dbsize);
routes.post('/incr', redisFuncController.incr);
routes.post('/zadd', redisFuncController.zadd);
routes.post('/zcard', redisFuncController.zcard);
routes.post('/zrank', redisFuncController.zrank);
routes.post('/zrange', redisFuncController.zrange);
routes.post('/getAll', redisFuncController.getAll);

export default routes;