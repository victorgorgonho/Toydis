import express from 'express';

// Importação do Swagger para documentação da aplicação
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/doc.json';

// Importação do controller de funções do Redis
import { redisFuncController } from './app/controllers/redisFuncController';

const routes = express.Router();

// Rotas de documentação
routes.use('/docs', swaggerUi.serve);
routes.get('/docs', swaggerUi.setup(swaggerDocument, { customCss: '.swagger-ui .topbar { display: none }' }));

// Rotas do Redis
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