import app from '../../src/app';
import request from 'supertest';

beforeAll(() => {
  jest.setTimeout(500000);
});

describe('Operações do Redis', () => {
  describe('SET', () => {
    it('Valor setado', async () => {
      const response = await request(app.express)
        .post('/set')
        .send({
          "key": "chaveSet",
          "value": "valorSet"
        });

      expect(response.status).toBe(200);
      expect(response.body.reply).toBe("OK");
    });
  });

  describe('SETEX', () => {
    it('Valor setado', async () => {
      const response = await request(app.express)
        .post('/set')
        .send({
          "key": "chaveSetex",
          "value": "valorSetex",
          "ex": 5
        })

      expect(response.status).toBe(200);
      expect(response.body.reply).toBe("OK");
    });
  });

  describe('GET', () => {
    it('Chave encontrada', async () => {

      const response = await request(app.express)
        .post('/get')
        .send({
          "key": "chaveSet"
        });

      expect(response.status).toBe(200);
      expect(response.body.reply).toBe("valorSet");
    });

    it('Chave não encontrada', async () => {
      const response = await request(app.express)
        .post('/get')
        .send({
          "key": "chaveNãoSetada"
        });

      expect(response.status).toBe(400);
      expect(response.body.reply).toBe(null);
    });

    it('Chave encontrada não contem string', async () => {
      await request(app.express)
        .post('/set')
        .send({
          "key": "naoString",
          "value": [15, 14, "-1"]
        });

      const response = await request(app.express)
        .post('/get')
        .send({
          "key": "naoString"
        });

      expect(response.status).toBe(400);
      expect(response.body.reply).toBe("Valor não é castável para string");
    });
  });

  describe('DEL', () => {
    it('Deletando 2 existentes e 1 inexistente', async () => {
      const response = await request(app.express)
        .post('/del')
        .send({
          "keys": ["chaveSet", "naoString", "chaveInexistente"]
        });

      expect(response.status).toBe(200);
      expect(response.body.reply).toBe(2);
    });

    it('Deletando 1 inexistente', async () => {
      const response = await request(app.express)
        .post('/del')
        .send({
          "keys": ["chaveInexistente"]
        });

      expect(response.status).toBe(200);
      expect(response.body.reply).toBe(0);
    });
  });

  describe('DBSIZE', () => {
    it('Banco com 1 elemento', async () => {
      const response = await request(app.express)
        .post('/dbsize')

      expect(response.status).toBe(200);
      expect(response.body.reply).toBe(1);
    });
  });

  describe('INCR', () => {
    it('Chave inexistente (inicia com 0, incrementa pra 1)', async () => {
      const response = await request(app.express)
        .post('/incr')
        .send({
          "key": "chaveIncr"
        });

      expect(response.status).toBe(200);
      expect(response.body.reply).toBe(1);
    });

    it('Chave existente de tipo diferente', async () => {
      const response = await request(app.express)
        .post('/incr')
        .send({
          "key": "chaveSetex"
        });

      expect(response.status).toBe(400);
      expect(response.body.reply).toBe("Valor não é do tipo number");
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
      expect(response.body.reply).toBe(7);
    });

    it('Apenas valores repetidos', async () => {
      const response = await request(app.express)
        .post('/zadd')
        .send({
          "key": "chaveZADD",
          "score": [1, 4, 5, 1, 2, 3, 1],
          "member": ["abc1", "abc5", "abc0", "abc2", "abc3", "abc4", "abc8"]
        });

      expect(response.status).toBe(200);
      expect(response.body.reply).toBe(0);
    });

    it('Tipo incompativel armazenado na chave', async () => {
      const response = await request(app.express)
        .post('/zadd')
        .send({
          "key": "chaveSetex",
          "score": [1, 4, 5, 1, 2, 3, 1],
          "member": ["abc1", "abc5", "abc0", "abc2", "abc3", "abc4", "abc8"]
        });

      expect(response.status).toBe(400);
      expect(response.body.reply).toBe("Valor não é do tipo object");
    });

    it('Score e member de tamanhos diferentes', async () => {
      const response = await request(app.express)
        .post('/zadd')
        .send({
          "key": "chaveZADD",
          "score": [1, 4],
          "member": ["abc1", "abc5", "abc0"]
        });

      expect(response.status).toBe(400);
      expect(response.body.reply).toBe("Score e Member de tamanhos diferentes");
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
      expect(response.body.reply).toBe(7);
    });

    it('Tipo incompativel armazenado na chave', async () => {
      const response = await request(app.express)
        .post('/zcard')
        .send({
          "key": "chaveSetex"
        });

      expect(response.status).toBe(400);
      expect(response.body.reply).toBe("Valor não é do tipo object");
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
      expect(response.body.reply).toBe(1);
    });

    it('Dado não encontrado na chave', async () => {
      const response = await request(app.express)
        .post('/zrank')
        .send({
          "key": "chaveZADD",
          "member": "valorNãoEncontrado"
        });

      expect(response.status).toBe(400);
      expect(response.body.reply).toBe(null);
    });

    it('Tipo incompativel armazenado na chave', async () => {
      const response = await request(app.express)
        .post('/zrank')
        .send({
          "key": "chaveSetex",
          "member": "abc8"
        });

      expect(response.status).toBe(400);
      expect(response.body.reply).toBe("Valor não é do tipo object");
    });

    it('Chave inexistente', async () => {
      const response = await request(app.express)
        .post('/zrank')
        .send({
          "key": "chaveInexistente",
          "member": "abc8"
        });

      expect(response.status).toBe(400);
      expect(response.body.reply).toBe(null);
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
      expect(response.body.reply).toHaveLength(5);
    });

    it('Tipo incompativel armazenado na chave', async () => {
      const response = await request(app.express)
        .post('/zrange')
        .send({
          "key": "chaveSetex",
          "start": 4,
          "stop": 2
        });

      expect(response.status).toBe(400);
      expect(response.body.reply).toBe("Valor não é do tipo object");
    });

    it('Chave inexistente', async () => {
      const response = await request(app.express)
        .post('/zrange')
        .send({
          "key": "chaveInexistente",
          "start": 4,
          "stop": 2
        });

      expect(response.status).toBe(400);
      expect(response.body.reply).toBe(null);
    });
  });
});
