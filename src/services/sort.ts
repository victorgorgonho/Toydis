import { OrderedArrayType } from './types';

// Merge Sort Implentation (Recursion)
export function mergeSort(unsortedArray: OrderedArrayType): OrderedArrayType {
  // Não precisa ordenar array se possuir 1 ou menos elementos
  if (unsortedArray.length <= 1) {
    return unsortedArray;
  }

  // Encontra o meio do array
  const middle = Math.floor(unsortedArray.length / 2);

  // Divide o array em dois
  const left = unsortedArray.slice(0, middle);
  const right = unsortedArray.slice(middle);

  // Usa recursão para combinar esquerda e direita
  return merge(
    mergeSort(left), mergeSort(right)
  );
}

// Mergeia os dois arrays
function merge(left: OrderedArrayType, right: OrderedArrayType) {
  let resultArray = [], leftIndex = 0, rightIndex = 0;

  // Concatena valores ordenados
  while (leftIndex < left.length && rightIndex < right.length) {
    const leftTuple = left[leftIndex];
    const rightTuple = right[rightIndex];

    if (leftTuple[0] < rightTuple[0]) {
      resultArray.push(left[leftIndex]);
      leftIndex++; // Move ponteiro do array da esquerda
    } else if (rightTuple[0] < leftTuple[0]) {
      resultArray.push(right[rightIndex]);
      rightIndex++; // Move ponteiro do array da direita
    } else {
      // Compara as duas strings da tupla, para organizar lexicogramaticamente
      const temp = leftTuple[1].localeCompare(rightTuple[1]);

      // Se esquerda for maior, dá push no elemento da esquerda
      if (temp === -1) {
        resultArray.push(left[leftIndex]);
        leftIndex++; // Move ponteiro do array da esquerda

        // Se direita for maior, dá push no elemento da direita
      } else if (temp === 1) {
        resultArray.push(right[rightIndex]);
        rightIndex++; // Move ponteiro do array da direita

        // Se esquerda for igual a direita, apaga um e dá push no outro
      } else {
        left.splice(leftIndex, 1);
        resultArray.push(right[rightIndex]);
        rightIndex++; // Move ponteiro do array da direita
      }
    }
  }

  // Concatena pois vai sobrar um elemento na esquerda ou direita
  return resultArray
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex));
}