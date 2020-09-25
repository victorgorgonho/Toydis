Desafio: Toydis
===============

Olá! Seja bem-vindo ao desafio de back end da autono.dev.

Nesse desafio, você deverá criar um serviço HTTP
que expõe operações a serem feitas em um banco de dados chave-valor,
similar ao [Redis](https://redis.io/).


Requisitos
----------

As operações que esse serviço deve oferecer são:

- [`SET key value`](http://redis.io/commands/set):
  associa um valor a uma chave;
- [`SETEX key seconds value`](http://redis.io/commands/setex):
  associa um valor a uma chave durante um período de tempo;
- [`GET key`](http://redis.io/commands/get):
  retorna o valor associado a uma chave;
- [`DEL key`](http://redis.io/commands/del):
  exclui o valor associado a uma chave;
- [`DBSIZE`](http://redis.io/commands/dbsize):
  retorna o número de chaves contidas no servidor;
- [`INCR key`](http://redis.io/commands/incr):
  incrementa o valor associado a uma chave;
- [`ZADD key score member`](http://redis.io/commands/zadd):
  adiciona um elemento a um conjunto ordenado;
- [`ZCARD key`](http://redis.io/commands/zcard):
  retorna o número de elementos em um conjunto ordenado;
- [`ZRANK key member`](http://redis.io/commands/zrank):
  retorna o índice de um elemento em um conjunto ordenado; e
- [`ZRANGE key start stop`](http://redis.io/commands/zrange):
  retorna os elementos contidos em um intervalo de um conjunto ordenado.

A interface que deve ser oferecida pelo serviço
está descrita num [documento de definição OpenAPI](/api/openapi.yml),
disponível no diretório `api/`.

A documentação dos comandos do Redis
são a fonte autoritativa
dos comportamentos das operações disponibilizadas pelo serviço.
O serviço [Try Redis](https://try.redis.io) é um ótimo lugar
para verificar eses comportamentos
em um ambiente Redis isolado.

As operações disponibilizadas pelo serviço
devem oferecer as mesmas garantias de complexidade de tempo
que os comandos do Redis.

É importante notar que
não é permitido utilizar estruturas de dados e algoritmos prontos,
sejam elas fornecidas pela linguagem de programação
ou por bibliotecas de terceiros;
todas as estruturas de dados e algoritmos utilizados na solução final
devem ser escritas por você.

Também não é permitido o uso de bancos de dados.
Nesse desafio, o objetivo _não é_ criar uma interface do Redis
em cima de um banco de dados,
mas sim criar um servidor
que, de fato, implementa estruturas de dados e algoritmos
que, juntos, são capazes de oferecer as operações do Redis acima listadas.


Qual *Stack* Utilizar
---------------------

Você tem liberdade total para definir sua *stack* de desenvolvimento.
Porém, documente o passo-a-passo necessário para executar a aplicação.
Se for possível,
ao invés do passo-a-passo,
você pode criar um arquivo `docker-compose.yml`
que permita subir a aplicação com um simples `docker-compose up`.


Critérios de Avaliação
----------------------

Os seguintes critérios serão avaliados:

- cumprimento dos requisitos;
- abordagem usada no levantamento de requisitos e extração de tarefas;
- arquitetura;
- clareza e manutenibilidade do código;
- desempenho e eficiência das operações;
- presença e completude de testes unitários e/ou de integração;
- documentação;
- histórico do Git.

São diferenciais, mas não necessários:

- integração contínua;
- fuzzing;
- disponibilização da aplicação utilizando Docker;
- comentários sobre as decisões técnicas tomadas.

---

Você tem 7 dias corridos,
contados a partir da data em que você teve acesso a esse repositório,
para finalizar o desafio.

Boa sorte!
