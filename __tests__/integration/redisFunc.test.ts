import app from '../../src/app';
import request from 'supertest';

beforeAll(() => {
  jest.setTimeout(500000);
});

describe('Operações do Redis', () => {
  describe('SET', () => {
    it('Dados válidos', async () => {

      const response = await request(app.express)
        .post('/set')
        .send({
          "key": "chaveSet",
          "value": "valorSet"
        });

      expect(response.status).toBe(200);
    });
  });

  describe('SETEX', () => {
    it('Dados válidos', async () => {
      const response = await request(app.express)
        .post('/set')
        .send({
          "key": "chaveSetex",
          "value": "valorSetex",
          "ex": 5
        })

      expect(response.status).toBe(200);
    });
  });

  describe('GET', () => {
    it('Dados válidos', async () => {

      const response = await request(app.express)
        .post('/get')
        .send({
          "key": "chaveSet"
        });

      expect(response.status).toBe(200);
    });
  });

  describe('DEL', () => {
    it('Dados válidos', async () => {
      const response = await request(app.express)
        .post('/del')
        .send({
          "keys": ["chaveSet", "chaveInexistente"]
        });

      expect(response.status).toBe(200);
    });
  });

  describe('DBSIZE', () => {
    it('Dados válidos', async () => {

      const response = await request(app.express)
        .post('/dbsize')

      expect(response.status).toBe(200);
    });
  });

  describe('INCR', () => {
    it('Dados válidos', async () => {
      const response = await request(app.express)
        .post('/incr')
        .send({
          "key": "chaveIncr"
        });

      expect(response.status).toBe(200);
    });
  });

  describe('ZADD', () => {
    it('Dados válidos', async () => {

      const response = await request(app.express)
        .post('/zadd')
        .send({
          "key": "chaveZADD",
          "score": [1, 4, 5, 1, 2, 3, 1],
          "member": ["abc1", "abc5", "abc0", "abc2", "abc3", "abc4", "abc8"]
        });

      expect(response.status).toBe(200);
    });
  });

  describe('ZCARD', () => {
    it('Dados válidos', async () => {

      const response = await request(app.express)
        .post('/zcard')
        .send({
          "key": "chaveZADD"
        });

      expect(response.status).toBe(200);
    });
  });

  describe('ZRANK', () => {
    it('Dados válidos', async () => {

      const response = await request(app.express)
        .post('/zrank')
        .send({
          "key": "chaveZADD",
          "member": "abc2"
        });

      expect(response.status).toBe(200);
    });
  });

  describe('ZRANGE', () => {
    it('Dados válidos', async () => {
      const response = await request(app.express)
        .post('/zrange')
        .send({
          "key": "chaveZADD",
          "start": 2,
          "stop": -1
        })

      expect(response.status).toBe(200);
    });
  });
});
