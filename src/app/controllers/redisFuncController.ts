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
const data = HashTable;

class RedisFuncController {
  // Associa um valor a uma chave - O(1)
  async set(req: Request, res: Response) {
    try {
      const body: SetFuncBody = req.body;
      const { key, value, ex } = body;

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

      return res.json({ message: "OK" });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ message: null });
    }
  };

  // Retorna o valor associado a uma chave - O(1)
  async get(req: Request, res: Response) {
    try {
      const body: GetFuncBody = req.body;
      const { key } = body;

      // Busca valor associado a chave
      const value = data.get(key);

      if (!value) {
        return res.status(404).send({ message: 'Valor não encontrado' });
      };

      if (typeof value !== 'string' && typeof value !== 'number') {
        return res.status(400).send({ message: 'Valor não é castável para string' });
      };

      return res.json({ message: value });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ message: null });
    }
  };

  // Exclui o valor associado a uma chave - O(N)
  async del(req: Request, res: Response) {
    try {
      const body: DelFuncBody = req.body;
      const { keys } = body;

      let count = 0;

      // Percorre todas as chaves do body
      keys.forEach((key: string) => {
        const value = data.del(key);

        // Se o item for deletado, incrementar contador
        if (value) {
          count++;
        };
      });

      return res.json({ message: count });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ message: null });
    }
  };

  // Retorna o número de chaves contidas no servidor - O(1)
  async dbsize(req: Request, res: Response) {
    try {
      return res.json({ message: data.size });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ message: null });
    }
  };

  // Incrementa o valor associado a uma chave - O(1)
  async incr(req: Request, res: Response) {
    try {
      const body: IncrFuncBody = req.body;
      const { key } = body;

      // Busca valor associado a chave
      const value = data.get(key);

      // Executa se algum valor foi retornado
      if (value) {
        if (typeof value !== 'number') {
          return res.status(400).send({ message: 'Valor não é do tipo number' });
        } else if (typeof value === 'number') {
          // Incrementa
          data.set(key, value + 1);
        }
      } else {
        // Se a chave não existir, setar pra 0 antes de incrementar
        data.set(key, 1);
      };

      return res.json({ message: value + 1 });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ message: null });
    }
  };

  // Adiciona um elemento a um conjunto ordenado (não add se member for igual) - O(n + log(n)), seria O(log(n)) utilizando objeto JavaScript
  async zadd(req: Request, res: Response) {
    try {
      const body: ZAddFuncBody = req.body;
      const { key, score, member } = body;

      // Busca valor associado a chave
      let orderedArray: OrderedArrayType = data.get(key);

      // Se não tiver nada na key, criar array
      if (!orderedArray) {
        orderedArray = [];
      };

      // Executa se array não for do tipo objeto
      if (typeof orderedArray !== 'object') {
        return res.status(400).send({ message: "Valor não é do tipo object" });
      };

      // Executa se arrays de score e member tiverem tamanhos diferentes
      if (score.length !== member.length) {
        return res.status(400).send({ message: "Score e Member de tamanhos diferentes" });
      };

      // Adiciona novos items ao array de forma desordenada
      // O(n), porém se recebidos como objeto (proibido), seria O(1)
      for (let index = 0; index < score.length; index++) {
        orderedArray.push([score[index], member[index]]);
      };

      // Ordena elementos do Array através do merge sort
      const newOrderedArray = mergeSort(orderedArray);

      // Quantidade de elementos adicionados corretamente ao array
      const elementsAddedCount = score.length - (orderedArray.length - newOrderedArray.length);

      data.set(key, newOrderedArray);

      return res.json({ message: elementsAddedCount });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ message: null });
    }
  };

  // Retorna o número de elementos em um conjunto ordenado - O(1)
  async zcard(req: Request, res: Response) {
    try {
      const body: ZCardFuncBody = req.body;
      const { key } = body;

      // Busca valor associado a chave
      let orderedArray: OrderedArrayType = data.get(key);

      // Se não tiver nada na key, retornar 0
      if (!orderedArray) {
        return res.json({ message: 0 });
      };

      // Executa se array não for do tipo objeto
      if (typeof orderedArray !== 'object') {
        return res.status(400).send({ message: "Valor não é do tipo object" });
      };

      return res.json({ message: orderedArray.length });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ message: null });
    }
  };

  // Retorna o índice de um elemento em um conjunto ordenado - O(log(n)), apresenta erros
  async zrank(req: Request, res: Response) {
    try {
      const body: ZRankFuncBody = req.body;
      const { key, member } = body;

      // Busca valor associado a chave
      let orderedArray: OrderedArrayType = data.get(key);

      // Se não tiver nada na key, retornar null
      if (!orderedArray) {
        return res.status(404).send({ message: null });
      };

      // Executa se array não for do tipo objeto
      if (typeof orderedArray !== 'object') {
        return res.status(400).send({ message: "Valor não é do tipo object" });
      };

      // Index de member
      const index = binarySearch(orderedArray, member, 0, orderedArray.length - 1);

      if (index === false) {
        return res.status(404).send({ message: null });
      };

      return res.json({ message: index });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ message: null });
    }
  };

  // Retorna os elementos contidos em um intervalo de um conjunto ordenado - O(N)
  async zrange(req: Request, res: Response) {
    try {
      const body: ZRangeFuncBody = req.body;
      const { key, start, stop } = body;

      // Busca valor associado a chave
      let orderedArray: OrderedArrayType = data.get(key);

      // Se não tiver nada na key, retornar null
      if (!orderedArray) {
        return res.status(404).send({ message: null });
      };

      // Executa se array não for do tipo objeto
      if (typeof orderedArray !== 'object') {
        return res.status(400).send({ message: "Valor não é do tipo object" });
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
        return res.status(400).send({ message: [] });
      };

      // Percorre do start até o stop, adicionando elementos ao array
      for (let index = left; index <= right; index++) {
        elements.push(orderedArray[index][1]);
      };

      return res.json({ message: elements });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ message: null });
    }
  };

  // Retorna todos os buckets - O(1)
  async getAll(req: Request, res: Response) {
    try {
      return res.json({ message: data.getAll() });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ message: null });
    }
  };
};

export const redisFuncController = new RedisFuncController();