# Princípios e Comandos Básicos

## Variáveis

<Text>
  Variáveis são as primeiras estruturas de dados que todo programador aprende. São caracterizadas por ter um nome e armazenar um valor em memória.
</Text>

As variáveis são declaradas com **var**.

`var variavel = "1"; // Aqui declaro uma variável chamada "variável", um texto, cujo valor é "1".`

Além disso, variáveis podem ter seus valores alterados a qualquer momento do código.

<Code>
  a = "1"
  a = "2"
  escreva(a) // escreve 2 como resultado.
</Code>

## Entrada e saída

Existem duas funções nativas para entrada e saída de dados:

<Quote>
  **escreva()**: usado para escrever uma variável ou literal na saída-padrão
</Quote>

<Quote>
  **leia()**: usado para escrever uma variável ou literal na saída-padrão
</Quote>


### escreva()
<Text>
  A função escreva() pode aceitar N valores'
</Text>

<Code>
  escreva(1) // Escreverá 1
  
  var a = 'Texto'
  escreva(a) // Escreverá 'Texto'

  escreva(a, 1, 2, 3) // Escreverá 'Texto' 1 2 3
</Code>

### leia()
<Text>
  Para ler dados da entrada do usuário, você pode usar a função leia(), que aceita 0 ou 1 valores.
</Text>

<Code>
  var teste = leia()
  escreva('Resultado: ' + teste)
</Code>
