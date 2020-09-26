import express from 'express';
import { celebrate } from 'celebrate';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/doc.json';

import Schemas from './config/joiSchemas';

import { redisFuncController } from './app/controllers/redisFuncController';

const routes = express.Router();

routes.use('/docs', swaggerUi.serve);
routes.get('/docs', swaggerUi.setup(swaggerDocument, { customCss: '.swagger-ui .topbar { display: none }' }));

routes.post('/set', celebrate(Schemas.setSchema), redisFuncController.set);
routes.post('/get', celebrate(Schemas.getSchema), redisFuncController.get);
routes.post('/del', celebrate(Schemas.delSchema), redisFuncController.del);
routes.post('/dbsize', redisFuncController.dbsize);
routes.post('/incr', celebrate(Schemas.incrSchema), redisFuncController.incr);
routes.post('/zadd', celebrate(Schemas.zaddSchema), redisFuncController.zadd);
routes.post('/zcard', celebrate(Schemas.zcardSchema), redisFuncController.zcard);
routes.post('/zrank', celebrate(Schemas.zrankSchema), redisFuncController.zrank);
routes.post('/zrange', celebrate(Schemas.zrangeSchema), redisFuncController.zrange);
routes.post('/getAll', redisFuncController.getAll);

export default routes;