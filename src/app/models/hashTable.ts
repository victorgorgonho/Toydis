class HashTable {
  buckets: Array<any>;
  size: number;
  max: number;

  // Valores iniciais
  constructor() {
    this.buckets = [];
    this.size = 0;
    this.max = 8;
  };

  // Função para gerar hash único a partir de uma string (param1) e dentro de um limite (param2)
  hashFunc(str: string, max: number) {
    // String hashing from K&R's "The C Programming Language"
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const letter = str[i];

      hash = letter.charCodeAt(0) + 31 * hash;
    };

    //console.log('String: ', str, 'Hash: ', hash % max);
    return hash % max;
  };

  // Seta um valor (param2) em um bucket da HashTable, indexado pelo hash gerado com a chave (param1)
  set(key: string, value: any) {
    // Calcula o indice baseado na função de Hash e na chave fornecida
    const index = this.hashFunc(key, this.max);

    // Busca valor armazenado no bucket do indice gerado
    let bucket = this.buckets[index];

    // Verifica se o bucket possui valor ou está vazio
    if (!bucket) {
      // Cria novo bucket
      const newBucket: Array<any> = [];

      this.buckets[index] = newBucket;
      bucket = newBucket;
    };

    let override = false;
    // Confere se o bucket já possui a chave (param1), se sim, sobrescreve o valor.
    // Se não, armazena nova chave e valor.
    for (let i = 0; i < bucket.length; i++) {
      let tuple = bucket[i];

      if (tuple[0] === key) {
        // Substitui valor armazenado na chave
        tuple[1] = value;
        override = true;
      };
    };

    if (!override) {
      /* Armazena uma nova tupla no bucket, podendo ser em um novo bucket vazio, 
      ou um bucket com tuplas que possuem chaves diferentes do parametro recebido.
      As tuplas estão no mesmo bucket devido ao método de Chaining para tratamento
      de colisões. */
      bucket.push([key, value]);
      this.size++;

      // Se 75% do Hash estiver completo, dobrar o tamanho disponível.
      if (this.size > this.max * 0.75) {
        this.resize(this.max * 2);
      };
    };

    return this;
  };

  // Apaga determinado bucket da HashTable, indexado pelo hash gerado com a chave (param1)
  del(key: string) {
    const index = this.hashFunc(key, this.max);
    const bucket = this.buckets[index];

    // Se não houver nenhum bucket, retornar nulo pois a chave não está presente no banco.
    if (!bucket) {
      return null;
    };

    // Percorre o bucket
    for (let i = 0; i < bucket.length; i++) {
      let tuple = bucket[i];
      // Confere se a chave está na tupla
      if (tuple[0] === key) {
        // Se estiver, apagar a tupla
        bucket.splice(i, 1);
        this.size--;

        // Se mais de 25% estiver livre, diminuir o número de buckets pela metade.
        if (this.size < this.max * 0.25) {
          this.resize(this.max / 2);
        };
        return tuple[1];
      };
    };
  };

  // Busca um bucket na HashTable, indexado pelo hash gerado com a chave (param1)
  get(key: string) {
    const index = this.hashFunc(key, this.max);
    const bucket = this.buckets[index];

    if (!bucket) {
      return null;
    };

    for (let i = 0; i < bucket.length; i++) {
      const tuple = bucket[i];
      if (tuple[0] === key) {
        return tuple[1];
      };
    };

    return null;
  };

  // Função para expandir ou reduzir o número de buckets em uma HashTable baseado no novo limite
  resize(newMax: number) {
    // Armazena todos os buckets atuais
    const oldStorage = this.buckets;

    // Zera os buckets atuais, e seta novo limite
    this.buckets = [];
    this.size = 0;
    this.max = newMax;

    // Percorre buckets antigos
    oldStorage.forEach((bucket: any) => {
      if (!bucket) {
        return;
      };
      for (let i = 0; i < bucket.length; i++) {
        const tuple = bucket[i];

        // Seta valores anteriores no novo hashTable com novo tamanho
        this.set(tuple[0], tuple[1]);
      };
    });
  };

  // Função para printar todos os buckets
  print() {
    console.log(this.buckets);
    console.log(this.max);
  };
};

export const hashTable = new HashTable();