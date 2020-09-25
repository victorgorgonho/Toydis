import { hashTable } from './app/models/hashTable';

const hashT = hashTable;

hashT.set('Alex Hawkins', '510-599-1930');
hashT.set('Boo Radley', '520-589-1970');
hashT.set('Vance Carter', '120-589-1970').set('Rick Mires', '520-589-1970').set('Tom Bradey', '520-589-1970').set('Biff Tanin', '520-589-1970');

// Exemplos com a mesma chave
hashT.set('Rick Mires', '650-589-1970').set('Tom Bradey', '818-589-1970').set('Biff Tanin', '987-589-1970');

hashT.del('Rick Mires');
hashT.del('Tom Bradey');

hashT.set('Dick Mires', '650-589-1970').set('Lam James', '818-589-1970').set('Ricky Ticky Tavi', '987-589-1970');
hashT.print();

/* Tamanho máximo do HashTable alcanca 75% da capacidade (6/8), então dobra, sendo agora 16. */
console.log(hashT.get('Lam James'));  //818-589-1970
console.log(hashT.get('Dick Mires')); //650-589-1970
console.log(hashT.get('Ricky Ticky Tavi')); //987-589-1970
console.log(hashT.get('Alex Hawkins')); //510-599-1930
console.log(hashT.get('Lebron James')); //null