## Tipos de Dados

### Tipo Texto

<Text>Variáveis do tipo *texto* são expressas com aspas duplas *""* ou aspas simples *''*.</Text>

<Code>
  var texto1 = "abc"
  var texto2 = 'abc'
</Code>

### Tipo Número

<Text>Números são inteiros ou decimais (com parte fracionária). Por padrão, todos os números são armazenados como decimais.</Text>

<Code>
  var numeroInteiro = 3
  var numeroDecimal = 8.5
</Code>

Também é possível haver números negativos (menores que zero).

<Code>
  var numeroInteiroNegativo = -8
  var numeroDecimalNegativo = -0.5
</Code>

### Tipo Lógico

<Text>Tipo de dado que só pode ser *verdadeiro* ou *falso*.</Text>

<Code>
 var valor_logico_1 = verdadeiro
 var valor_logico_0 = falso
</Code>

### Tipo Nulo

<Text>Nulo representa a ausência de qualquer valor.</Text>

<Code exec>
 var minhaVariavel = nulo
 escreva(minha_variavel)
</Code>

<Alert>Na maioria das vezes um valor do tipo nulo se comporta como valor *falso*</Alert>

<Alert>Caso uma variável não tenha um valor definido ela conterá valor nulo</Alert>

<Code exec>
  var numero
  escreva(numero) // nulo
</Code>

### Interpolação de texto

Ao escrever *\${  }* dentro de um texto, é possível inserir uma variável já definida entre esses elementos.

<Code exec>
  var minha_variavel = "Strogonoff"

  // Escreverá "Eu gosto de Strogonoff"
  escreva("Eu gosto de \${minha_variavel}") 
</Code>

Também é possível	inserir diretamente uma expressão que resulta em um valor, desde que esse resultado seja do tipo número, lógico ou texto.

<Code exec>
  // Escreverá "Eu tenho 22 anos"
  escreva("Eu tenho \${2024 - 2002} anos") 

  var resposta = 22 > 18

  // Escreverá "Você é de maior? verdadeiro"
  escreva("Você é de maior? \${resposta}") 
</Code>
