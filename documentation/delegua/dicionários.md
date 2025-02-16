## Dicionários

<Text>Os dicionários são estruturas que contém uma chave e um valor associado a ela.</Text>

<Quote>Os conjuntos de chave e valor são colacodes entre chaves `{}` e separados por vírgula *,*.</Quote>

<Code exec>
  var dicionario = {
    'chave 1': 'valor 1',
    'chave 2': 'valor 2',
    'chave 3': 'valor 3',
  }

  escreva(dicionario)

  // Resultado: {"chave 1":"valor 1","chave 2":"valor 2","chave 3":"valor 3"}
</Code>

<Text>Os valores de um dicinário podem ser de qualquer um dos tipo de dados básicos: *texto*, *número*, *lógico* </Text>

<Code exec>
  var dicionarioDeNumeros = {
    'numero 1': 1,
    'numero 2': 2,
  }

  var dicionarioDeTextos = {
    'meu texto': 'texto qualquer'
  }

  var dicionarioDeLogicos = {
    'verdadeiro': verdadeiro
    'falso': falso
  }

  var dicionarioComDadosMistos = {
    'valor logico': verdadeiro
    'valor textual': 'texto'
    'valor numérido': 1000
  }

  escreva(dicionarioDeNumeros)
  escreva(dicionarioDeTextos)
  escreva(dicionarioDeLogicos)
  escreva(dicionarioComDadosMistos)
</Code>

É possível usar como valores tipos de dados mais complexos como `listas` ou ainda `dicionários`.

<Code exec>
  var dicionarioDeListas = {
    'lista 1': [1, 2, 3, 4],
    'lista 2': [verdadeiro, falso],
  }

  var dicionarioDeDicionarios = {
    'dicionário 1': {
      'chave do dicionário': 1000
      'outro dicionário': {
        'chave do outro dicionário': 2000
      } 
    }
  }

  escreva(dicionarioDeListas)
  escreva(dicionarioDeDicionarios)
</Code>

<Alert>É possível também utilizar outros tipos de dados além do tipo `texto` para chaves, mas é mais comum utilzar tipo `texto` e `numero` na hora de definir as chaves.</Alert>

<Code exec>
  var dicionarioComChavesTexto = {
    'texto 1': 1,
    'texto 2': 2,
  }

  var dicionarioComChavesNumero = {
    1: 1,
    2: 2,
  }

  escreva(dicionarioComChavesTexto)
  escreva(dicionarioComChavesNumero)
</Code>


### Acessando valores

<Text>Para acessar o valor contido em um dicionário é necessário escrever a chave correspondente a esse valor entre conchetes `[]`.</Text>

<Code exec>
  var meuDicionario = {
    'chave 1': 1,
    'chave 2': 2,
    'chave 3': 3,
  }

  escreva(meuDicionario['chave 2'])

  // Resultado: 2
</Code>

<Quote>Caso o valor fornecido não exista no dicionário será retornado o valor `nulo`.</Quote>

<Code exec>
  var meuDicionario = {
    'chave 1': 1,
    'chave 2': 2,
    'chave 3': 3,
  }

  escreva(meuDicionario['chave 4'])

  // Resultado: nulo
</Code>

### Alterando valores

<Text>Para alterar o valor de uma chave basta colocar a chave do valor que deseja ser alterado entre colchetes e atribuir a um novo valor utilizando o operador `=`.</Text>

<Code exec>
  var meuDicionario = {
    'chave 1': 1,
    'chave 2': 2,
    'chave 3': 3,
  }

  meuDicionario['chave 2'] = 4

  escreva(meuDicionario['chave 2'])

  // Resultado: 4
</Code>

### Adicionando valores

<Text>Para adicionar o valor é necessário criar um novo conjunto de chave e valor, colocando o nome da nova chave entre colchetes e atribuindo a um novo valor à chave utilizando o operador `=`.</Text>

<Code exec>
  var meuDicionario = {
    'chave 1': 1,
    'chave 2': 2,
    'chave 3': 3,
  }

  meuDicionario['chave 4'] = 4

  escreva(meuDicionario['chave 4'])

  // Resultado: 4
</Code>

### Método chaves()

<Text>É possível retornar apenas as chaves de um dicionário em forma de `lista` utilizando o método `chaves()`.</Text>

<Code exec>
  var dicionario = {
    'uma chave': 1,
    'outra chave': 1,
    'mais outra chave': 1,
  }

  escreva(dicionario.chaves())

  // Resultado: ['uma chave', 'outra chave', 'mais outra chave']
</Code>

### Método valores()

<Text>É possível retornar apenas as valores de um dicionário em forma de `lista` utilizando o método `valores()`.</Text>

<Code exec>
  var dicionario = {
    'chave 1': 'um valor',
    'chave 2': 'outro valor',
    'chave 3': 'mais outro valor',
  }

  escreva(dicionario.valores())

  // Resultado: ['uma valor', 'outro valor', 'mais outro valor']
</Code>

### Desestruturação

<Text>É possível atribuir os valores de um dicionário em variáveis diferentes em uma única linha com uma única palavra-chave `var` ou `const`.</Text>

<Alert>Para fazer isso, os nomes das variáveis precisam estar entre chaves `{}` e exatamente iguais às chaves do dicionário em questão</Alert>

<Code exec>
  var dicionario = {
    'chave1': 'um valor',
    'chave2': 'outro valor',
    'chave3': 'mais outro valor',
  }

  var { chave1, chave2, chave3 } = dicionario

  escreva(chave1) // 'uma valor'
  escreva(chave2) // 'outro valor'
  escreva(chave3) // 'mais outro valor'
</Code>

<Alert>Note que isso só vai funcionar se chaves do dicionario forem do tipo `texto` sem conter espaços, começar com número etc. Veja a documentação básica para saber mais sobre nomenclatura de variáveis e constantes.</Alert>

<Quote>A ordem das variáveis entre chaves não precisa ser igual à ordem das chaves no dicionário</Quote>

<Code exec>
  var dicionario = {
    'chave1': 'um valor',
    'chave2': 'outro valor',
    'chave3': 'mais outro valor',
  }

  var { chave2, chave1, chave3 } = dicionario

  escreva(chave1) // 'uma valor'
  escreva(chave2) // 'outro valor'
  escreva(chave3) // 'mais outro valor'
</Code>
