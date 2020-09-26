export function binarySearch(arr: [number, string][], x: string, start: number, end: number): any {

  // Condição base 
  if (start > end)
    return false;

  // Encontra indíce do meio 
  let mid = Math.floor((start + end) / 2);

  // Compara elemento do meio com valor de x
  if (arr[mid][1] === x)
    return mid;

  // Se o elemento do meio é maior que x, 
  // procura na metade da esquerda
  if (arr[mid][1] > x) {
    return binarySearch(arr, x, start, mid - 1);
  } else {
    // Se o elemento do meio é menor que x, 
    // procura na metade da direita 
    return binarySearch(arr, x, mid + 1, end);
  }
} 