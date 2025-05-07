## Princípios e Comandos Básicos

### Variáveis

<Text>
  Variáveis são as primeiras estruturas de dados que todo programador aprende. São caracterizadas por ter um nome e armazenar um valor em memória.
</Text>

As variáveis são declaradas escrevendo a palavra-chave **var**, seguida pelo nome e valor.

<Code>
var valor = "1"
</Code>

Além disso, variáveis podem ter seus valores alterados a qualquer momento do código.

<Code>
var numero = "1"
numero = "2"
escreva(numero) // Resultado: "2".
</Code>

#### Regras de nomenclatura de variáveis

<Text>Ao nomear variáveis é preciso seguir algumas regras:</Text>

<Quote>*Comece com uma letra, sublinhado ou sifrão*: o primeiro caractere do nome deve ser uma letra, sublinhado (_) ou sifrão ($). Outros caracteres especiais não devem ser usados, assim como palavras já utilizadas internamente pela linguagem. Além disso, espaços não são permitidos.</Quote>

<Code>
var 2valor ❌
var meu nome ❌
var escreva ❌

var quantidade ✅
var $dinheiro ✅
var _valor ✅
var maioresQue10 ✅
</Code>

<Quote>*Prefira o estilo camelo*: É mais comum usar estilo camelo para nomes de variáveis, onde a primeira palavra começa com uma letra minúscula e a primeira letra de cada palavra subsequente é maiúscula (parecido com as costas de um camelo 🐫)</Quote>

<Code>
var meuNome ✅
var usuariosComIdadeMaiorQue18 ✅
</Code>

<Quote>*Utilize nomes qua fazem sentido*: Nomeie suas variáveis de acordo com o valor que elas armazenam.</Quote>

<Code>
var nome = 'Ítalo Brandão' ✅
var anoDeNascimento = 2004 ✅
var temSexoMasculino = verdadeiro

var fruta = 'arroz' ❌
var cidade = 7895 ❌
var profissao = falso ❌
</Code>

## Constantes

<Quote>Além de variáveis, é possível criar constantes, ou seja, estruturas semlhantes a variáveis, mas com a diferença fundamental que uma vez declarado seu valor esse valor nunca mais poderá ser alterado no programa.</Quote>

<Code exec>
  const nome = 'Ítalo Brandão'
  nome = 'Leonel Sanches' ❌ 
</Code>

<Alert>As regras de nomenclatura de variáveis também se aplica às constantes.</Alert>

## Entrada e saída

Existem duas funções nativas para entrada e saída de dados:

<Quote>
  *escreva()*: usado para escrever uma variável ou um valor na saída.
</Quote>

<Quote>
  *leia()*: usado para escrever uma variável ou um valor na saída.
</Quote>

### escreva()

<Text>
  A função *escreva()* pode aceitar N valores, que ele irá escrever cada valor um lado ao do outro.
</Text>

<Code>
escreva(1) // Escreverá 1
  
var valor = 'Texto'
escreva(valor) // Escreverá 'Texto'

escreva(valor, 1, 2, 3) // Escreverá 'Texto' 1 2 3
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
