import express from 'express';

const routes = express.Router();

routes.post('/teste', (req, res) => res.json('funcionou'));

export default routes;