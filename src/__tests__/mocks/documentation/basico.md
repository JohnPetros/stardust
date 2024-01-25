## Princípios e Comandos Básicos

### Variáveis

<Text>
  Variáveis são as primeiras estruturas de dados que todo programador aprende. São caracterizadas por ter um nome e armazenar um valor em memória.
</Text>

As variáveis são declaradas escrevendo a palavra-chave **var**.

<code>
  // Aqui declaro uma variável chamada "variável", um texto, cujo valor é "1".
  var valor = "1"
</code>

Além disso, variáveis podem ter seus valores alterados a qualquer momento do código.

<Code>
  var a = "1"
  a = "2"
  escreva(a) // escreverá 2 como resultado.
</Code>

## Entrada e saída

Existem duas funções nativas para entrada e saída de dados:

<Quote>
  **escreva()**: usado para escrever uma variável ou um valor na saída.
</Quote>

<Quote>
  **leia()**: usado para escrever uma variável ou um valor na saída.
</Quote>


### escreva()
<Text>
  A função *escreva()* pode aceitar N valores, que ele irá escrever cada valor um lado ao do outro.
</Text>

<Code>
  escreva(1) // Escreverá 1
  
  var a = 'Texto'
  escreva(a) // Escreverá 'Texto'

  escreva(a, 1, 2, 3) // Escreverá 'Texto' 1 2 3
</Code>

### leia()
<Text>
  Para ler dados da entrada do usuário, você deve usar a função *leia()*, então abrir-se-á um campo na tela para inserir um valor.
</Text>

<Code>
  var entrada = leia()
  escreva('Resultado: ' + entrada)
</Code>

<Alert>
  Obs.: O valor inserido no campo sempre será do tipo *texto*.
</Alert>

Além disso, caso haja um texto dentro do comando *leia()*, o mesmo será utilizado como título do campo.

<Code>
  var valor = leia("Insira um valor:")
  escreva('Valor recebido: ' + valor)
</Code>

### Comentários

<Text>
  É possível inserir uma linha de comentário dentro do código inserindo duas barras *//* antes do conteúdo do comentário.
</Text>

<Alert>
  Qualquer comentário não será executado no programa.
</Alert>

<Code>
  // escreva("Não estou sendo executado")

  escreva("Estou sendo executado")
</Code>

 É possível também inserir um bloco de comentário em vez de uma única linha escrevendo barra asterisco /* e fechando com asterisco barra */.

 <Code>
  /*
   escreva("--------------------")
   escreva(" BLOCO DE COMENTÁRIO )
   escreva("--------------------")
  */

  escreva("Estou sendo executado")
</Code>
