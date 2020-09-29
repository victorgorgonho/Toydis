// Tipos
import { Request, Response } from 'express';
import HashTable from '../models/hashTable';
import {
  SetFuncBody,
  GetFuncBody,
  DelFuncBody,
  IncrFuncBody,
  ZAddFuncBody,
  OrderedArrayType,
  ZCardFuncBody,
  ZRankFuncBody,
  ZRangeFuncBody
} from '../../services/types';

// Funções
import { mergeSort } from '../../services/sort';
import { binarySearch } from '../../services/binarySearch';

// Banco de dados
const data = new HashTable;

// Banco de dados auxiliar para ZADD e ZRANK
const auxData = new HashTable;

// Importando formatos de validação do corpo esperado das requisições
import Schemas from '../../config/joiSchemas';

class RedisFuncController {
  // Associa um valor a uma chave - O(1)
  async set(req: Request, res: Response) {
    try {
      const body: SetFuncBody = req.body;
      const { key, value, ex } = body;

      // Valida corpo da requisição com formato esperado
      await Schemas.setSchema.body.validateAsync(req.body);

      // Se um parametro de segundos foi fornecido, expirar o dado
      if (ex) {
        // Dado anterior armazenado na chave fornecida
        const previousValue = data.get(key);

        // Seta o valor
        data.set(key, value);

        // Executa após "ex" segundos
        setTimeout(() => {
          if (previousValue) {
            // Se havia um valor anterior, setar de volta
            data.set(key, previousValue);
          } else {
            // Se não havia um valor anterior, apagar
            data.del(key);
          }
        }, ex * 1000);
      } else {
        // Seta o valor
        data.set(key, value);
      };

      return res.json({ reply: "OK" });
    } catch (error) {
      // Falha na requisição capturada pelo Middleware
      if (error.details) {
        const message = error.details[0].message;

        if (message || typeof message === 'string') {
          return res.status(400).send({ reply: message });
        }
      }

      return res.status(400).send({ reply: null });
    }
  };

  // Retorna o valor associado a uma chave - O(1)
  async get(req: Request, res: Response) {
    try {
      const body: GetFuncBody = req.body;
      const { key } = body;

      // Valida corpo da requisição com formato esperado
      await Schemas.getSchema.body.validateAsync(req.body);

      // Busca valor associado a chave
      const value = data.get(key);

      // Retorna nulo se a chave não for encontrada
      if (!value) {
        return res.status(400).send({ reply: null });
      };

      // Retorna erro se o valor não for uma string
      if (typeof value !== 'string' && typeof value !== 'number') {
        return res.status(400).send({ reply: 'Valor não é castável para string' });
      };

      return res.json({ reply: value });
    } catch (error) {
      // Falha na requisição capturada pelo Middleware
      if (error.details) {
        const message = error.details[0].message;

        if (message || typeof message === 'string') {
          return res.status(400).send({ reply: message });
        }
      }

      return res.status(400).send({ reply: null });
    }
  };

  // Exclui o valor associado a uma chave - O(N)
  async del(req: Request, res: Response) {
    try {
      const body: DelFuncBody = req.body;
      const { keys } = body;

      let count = 0;

      // Valida corpo da requisição com formato esperado
      await Schemas.delSchema.body.validateAsync(req.body);

      // Percorre todas as chaves do body
      keys.forEach((key: string) => {
        const value = data.del(key);

        // Se o item for deletado, incrementar contador
        if (value) {
          count++;
        };
      });

      return res.json({ reply: count });
    } catch (error) {
      // Falha na requisição capturada pelo Middleware
      if (error.details) {
        const message = error.details[0].message;

        if (message || typeof message === 'string') {
          return res.status(400).send({ reply: message });
        }
      }

      return res.status(400).send({ reply: null });
    }
  };

  // Retorna o número de chaves contidas no servidor - O(1)
  async dbsize(req: Request, res: Response) {
    try {
      return res.json({ reply: data.size });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ reply: null });
    }
  };

  // Incrementa o valor associado a uma chave - O(1)
  async incr(req: Request, res: Response) {
    try {
      const body: IncrFuncBody = req.body;
      const { key } = body;

      // Valida corpo da requisição com formato esperado
      await Schemas.incrSchema.body.validateAsync(req.body);

      // Busca valor associado a chave
      const value = data.get(key);

      // Executa se algum valor foi retornado
      if (value) {
        if (typeof value !== 'number') {
          return res.status(400).send({ reply: 'Valor não é do tipo number' });
        } else if (typeof value === 'number') {
          // Incrementa
          data.set(key, value + 1);
        }
      } else {
        // Se a chave não existir, setar pra 0 antes de incrementar
        data.set(key, 1);
      };

      return res.json({ reply: value + 1 });
    } catch (error) {
      // Falha na requisição capturada pelo Middleware
      if (error.details) {
        const message = error.details[0].message;

        if (message || typeof message === 'string') {
          return res.status(400).send({ reply: message });
        }
      }

      return res.status(400).send({ reply: null });
    }
  };

  // Adiciona um elemento a um conjunto ordenado (não add se member for igual) - O(n + log(n)), seria O(log(n)) utilizando objeto JavaScript
  async zadd(req: Request, res: Response) {
    try {
      const body: ZAddFuncBody = req.body;
      const { key, score, member } = body;

      // Valida corpo da requisição com formato esperado
      await Schemas.zaddSchema.body.validateAsync(req.body);

      // Busca valor associado a chave
      let orderedArray: OrderedArrayType = data.get(key);

      // Se não tiver nada na key, criar array
      if (!orderedArray) {
        orderedArray = [];
      };

      // Executa se array não for do tipo objeto
      if (typeof orderedArray !== 'object') {
        return res.status(400).send({ reply: "Valor não é do tipo object" });
      };

      // Executa se arrays de score e member tiverem tamanhos diferentes
      if (score.length !== member.length) {
        return res.status(400).send({ reply: "Score e Member de tamanhos diferentes" });
      };

      // Adiciona novos items ao array de forma desordenada
      // O(n), porém se recebidos como objeto (proibido), seria O(1)
      for (let index = 0; index < score.length; index++) {
        orderedArray.push([score[index], member[index]]);

        // Armazena no banco auxiliar o score do member associado
        auxData.set(member[index], score[index]);
      };

      // Ordena elementos do Array através do merge sort
      const newOrderedArray = mergeSort(orderedArray);

      // Quantidade de elementos adicionados corretamente ao array
      const elementsAddedCount = score.length - (orderedArray.length - newOrderedArray.length);

      data.set(key, newOrderedArray);

      return res.json({ reply: elementsAddedCount });
    } catch (error) {
      // Falha na requisição capturada pelo Middleware
      if (error.details) {
        const message = error.details[0].message;

        if (message || typeof message === 'string') {
          return res.status(400).send({ reply: message });
        }
      }

      return res.status(400).send({ reply: null });
    }
  };

  // Retorna o número de elementos em um conjunto ordenado - O(1)
  async zcard(req: Request, res: Response) {
    try {
      const body: ZCardFuncBody = req.body;
      const { key } = body;

      // Valida corpo da requisição com formato esperado
      await Schemas.zcardSchema.body.validateAsync(req.body);

      // Busca valor associado a chave
      let orderedArray: OrderedArrayType = data.get(key);

      // Se não tiver nada na key, retornar 0
      if (!orderedArray) {
        return res.json({ reply: 0 });
      };

      // Executa se array não for do tipo objeto
      if (typeof orderedArray !== 'object') {
        return res.status(400).send({ reply: "Valor não é do tipo object" });
      };

      return res.json({ reply: orderedArray.length });
    } catch (error) {
      // Falha na requisição capturada pelo Middleware
      if (error.details) {
        const message = error.details[0].message;

        if (message || typeof message === 'string') {
          return res.status(400).send({ reply: message });
        }
      }

      return res.status(400).send({ reply: null });
    }
  };

  // Retorna o índice de um elemento em um conjunto ordenado - O(log(n) + M), sendo M o número de elementos de score igual até encontrar o member
  async zrank(req: Request, res: Response) {
    try {
      const body: ZRankFuncBody = req.body;
      const { key, member } = body;

      // Valida corpo da requisição com formato esperado
      await Schemas.zrankSchema.body.validateAsync(req.body);

      // Busca valor associado a chave
      let orderedArray: OrderedArrayType = data.get(key);

      // Se não tiver nada na key, retornar null
      if (!orderedArray) {
        return res.status(400).send({ reply: null });
      };

      // Executa se array não for do tipo objeto
      if (typeof orderedArray !== 'object') {
        return res.status(400).send({ reply: "Valor não é do tipo object" });
      };

      // Score do member
      const memberScore = auxData.get(member);

      // Index de member
      const index = binarySearch(orderedArray, memberScore, member, 0, orderedArray.length - 1);

      if (index === false) {
        return res.status(400).send({ reply: null });
      };

      return res.json({ reply: index });
    } catch (error) {
      // Falha na requisição capturada pelo Middleware
      if (error.details) {
        const message = error.details[0].message;

        if (message || typeof message === 'string') {
          return res.status(400).send({ reply: message });
        }
      }

      return res.status(400).send({ reply: null });
    }
  };

  // Retorna os elementos contidos em um intervalo de um conjunto ordenado - O(N)
  async zrange(req: Request, res: Response) {
    try {
      const body: ZRangeFuncBody = req.body;
      const { key, start, stop } = body;

      // Valida corpo da requisição com formato esperado
      await Schemas.zrangeSchema.body.validateAsync(req.body);

      // Busca valor associado a chave
      let orderedArray: OrderedArrayType = data.get(key);

      // Se não tiver nada na key, retornar null
      if (!orderedArray) {
        return res.status(400).send({ reply: null });
      };

      // Executa se array não for do tipo objeto
      if (typeof orderedArray !== 'object') {
        return res.status(400).send({ reply: "Valor não é do tipo object" });
      };

      const elements = [];
      let left = start;
      let right = stop;

      // Se start for negativo, converter para notação correta
      if (start < 0) {
        left = orderedArray.length - Math.abs(start);
      };

      // Se stop for negativo, converter para notação correta
      if (stop < 0) {
        right = orderedArray.length - Math.abs(stop);
      };

      // Se stop for maior que o tamanho do array, converter para tamanho do array
      if (right > (orderedArray.length - 1)) {
        right = (orderedArray.length - 1);
      };

      // Se start for maior que stop, ou start maior que o tamanho do array, retornar array vazio
      if (left > right || left > (orderedArray.length - 1)) {
        return res.status(400).send({ reply: [] });
      };

      // Percorre do start até o stop, adicionando elementos ao array
      for (let index = left; index <= right; index++) {
        elements.push(orderedArray[index][1]);
      };

      return res.json({ reply: elements });
    } catch (error) {
      // Falha na requisição capturada pelo Middleware
      if (error.details) {
        const message = error.details[0].message;

        if (message || typeof message === 'string') {
          return res.status(400).send({ reply: message });
        }
      }

      return res.status(400).send({ reply: null });
    }
  };

  // Retorna todos os buckets - O(1)
  async getAll(req: Request, res: Response) {
    try {
      return res.json({ reply: data.getAll() });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ reply: null });
    }
  };
};

export const redisFuncController = new RedisFuncController();