import { OrderedArrayType } from './types';

export function binarySearch(arr: OrderedArrayType, x: number, y: string, start: number, end: number): any {

  // Condição base 
  if (start > end)
    return false;

  // Encontra indíce do meio 
  let mid = Math.floor((start + end) / 2);

  // Compara o score do meio com valor de x
  if (arr[mid][0] === x) {
    // Compara o member de todos os elementos com o mesmo score, partindo do meio para
    // a esquerda, até encontrar um elemento de score diferente ou ser menor do que 0
    for (let index = 0; (mid - index >= 0) && (arr[mid - index][0] === x); index++) {
      // Se o member for igual ao valor de y, retornar o indice encontrado
      if (arr[mid - index][1] === y)
        return mid - index;
    }

    // Compara o member de todos os elementos com o mesmo score, partindo do meio para
    // a direita, até encontrar um elemento de score diferente ou ser maior ou igual 
    // que o length
    for (let index = 1; (mid + index < arr.length) && arr[mid + index][0] === x; index++) {
      // Se o member for igual ao valor de y, retornar o indice encontrado
      if (arr[mid + index][1] === y)
        return mid + index;
    }
  }

  // Se o elemento do meio é maior que x, 
  // procura na metade da esquerda
  if (arr[mid][0] > x) {
    return binarySearch(arr, x, y, start, mid - 1);
  } else {
    // Se o elemento do meio é menor que x, 
    // procura na metade da direita 
    return binarySearch(arr, x, y, mid + 1, end);
  }
} 