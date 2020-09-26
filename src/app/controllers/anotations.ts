/*
SET key value:
associa um valor a uma chave;

key: string
value: any

res:
200: "OK"
400: "$-1\r\n"

SETEX key seconds value:
associa um valor a uma chave durante um período de tempo;

key: string
value: any
ex: number

res:
200: "OK"
400: "$-1\r\n"
An error is returned when seconds (ex) is invalid. (celebrate)

GET key:
retorna o valor associado a uma chave;

key: string

res:
200: value
400: "$-1\r\n"
An error is returned if the value stored at key is not a string, because GET only handles string values.

DEL key:
exclui o valor associado a uma chave;

keys: Array<string>

res:
200: integer(num values)
400: "$-1\r\n"

DBSIZE:
retorna o número de chaves contidas no servidor;

res:
200: integer
400: "$-1\r\n"

INCR key:
incrementa o valor associado a uma chave;

key: string

res:
200: integer (valor pos incremento)
400: "$-1\r\n"
If the key does not exist, it is set to 0 before performing the operation.
An error is returned if the key contains a value of the wrong type or contains a string that can not be represented as integer.

ZADD key score member:
adiciona um elemento a um conjunto ordenado;

key: string
score: integer (valor)
member: string

res:
200: integer (num added)
400: "$-1\r\n"

If a specified member is already a member of the sorted set,
the score is updated and the element reinserted at the right position to ensure the correct ordering.

If key does not exist, a new sorted set with the specified members as sole members is created,
like if the sorted set was empty. If the key exists but does not hold a sorted set, an error is returned.

ZCARD key:
retorna o número de elementos em um conjunto ordenado;

key: string

res:
200: integer (number of elements) or 0 if key does not exist.
400: "$-1\r\n"

ZRANK key member:
retorna o índice de um elemento em um conjunto ordenado;

key: string
member: string

res:
200: integer (indexOf starting 0)
400: "$-1\r\n" If member does not exist in the sorted set or key does not exist

ZRANGE key start stop:
retorna os elementos contidos em um intervalo de um conjunto ordenado.

key: string
start & stop: integer

res:
200: Array<members>
400: "$-1\r\n"
*/