## Tuplas

<Text>São estruturas selhantes a listas, com a diferença que ela são imutáveis, isto significa que quando criadas, seus elementos não podem ser alterados, adicionados ou removidos.</Text>

Para criar uma tupla é necessário colocar entre colchetes `[]` os elementos da tupla dentro de parênteses `()`, separados por vírgula `,`

<Code exec>
  var tupla = [(1, 2, 3)]

  escreva(tupla)

  // Resultado: [1, 2, 3]
</Code>

<Quote>Caso haja uma tentativa de alteração de qualquer elemento da tupla o programa dará erro.</Quote>

<Code exec>
  var tupla = [(1, 2, 3)]

  tupla[0] = 1
</Code>

<Text>Uma vez que são parecidas com as `listas`, é possível utilizar algumas funções nativas utilizada para `listas` como `tamanho()`, `ordernar()`, `mapear()`, `filtrarPor()` etc.</Text>

<Code exec>
  var tupla = [(2, 3, 1)]

  escreva(tamanho(tupla)) // 3
  escreva(ordenar(tupla)) // [1, 2, 3]
  escreva(mapear(tupla, funcao(valor) { valor * 2 })) // [2, 4, 6]
  escreva(filtrarPor(tupla, funcao(valor) { valor > 1 })) // [2, 3]
</Code>

<Text>Veja a documentação sobre `listas` e `funções` para entender mais sobre esses recursos.</Text>
