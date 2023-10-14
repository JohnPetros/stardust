import { Text } from '@/@types/text'

export const texts: Text[] = [
  {
    type: 'default',
    content:
      'Ei! Já que você está indo em direção ao planeta, é bom regular a velocidade do foguete para fazer um pouso seguro.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'user',
    content: 'E como fazer isso?',
  },
  {
    type: 'default',
    content:
      'A velocidade atual do foguete é `50`, caso a força da gravidade seja maior que `10`, a velocidade deverá diminuir em `20`, caso contrário precisará aumentar em `20`.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var velFoguete = 50
var gravidade = 9.8

se (gravidade > 10) {
  velFoguete -= 20
  escreva(velFoguete)
}

se (gravidade < 10) {
  velFoguete += 20
  escreva(velFoguete)
}

// Resultado: 70`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Perceba que usei `+=` e `-=` para alterar o valor da variável `velFoguete`. Isso é a mesma coisa que escrever: `velFoguete = velFoguete + 20` e `velFoguete = velFoguete - 20`, só que de um jeito mais curto.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'alert',
    content:
      'Esse operador especial é chamado de operador de atribuição aritmética, ou seja, ele pode ser usado para fazer qualquer uma das quatros operações aritméticas vimos anteriormente: `(+=, -=, *=, /=)`',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'default',
    content: 'Veja exemplos utilizando esses operadores:`',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'code',
    content: `var numero = 100
numero += 5
escreva(numero) // 105

var numero = 100
numero -= 5
escreva(numero) // 95

var numero = 100
numero *= 5
escreva(numero) // 500

var numero = 100
numero /= 5
escreva(numero) // 20`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Agora, voltando ao código do foguete, você pode achar ele que cumpre o seu papel perfeitamente, o que de fato é verdade.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'user',
    content: 'Mas, qual o problema?',
  },
  {
    type: 'default',
    content:
      'Acontece que geralmente após terminar a escrita de um código, haverá sempre a oportunidade de melhorá-lo, tornando-o mais eficiente e claro, processo esse que normalmente chamamos de refatoração',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'default',
    content:
      'Neste caso, em vez de usar dois `se`, é possível usar outra estrutura, chamada `se-senão`, veja só:',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'code',
    content: `var velFoguete = 50
var gravidade = 9.8

se (gravidade > 10) {
  velFoguete -= 20
  escreva(velFoguete)
} senao {
  velFoguete += 20
  escreva(velFoguete)
}

// Resultado: 70`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Acho que você já percebeu, mas ao escrever código dentro do bloco entre chaves `{}` de qualquer estrutura, é comum inserir um espaço antes de cada linha. Você pode fazer isso apertando `tab` no teclado',
    picture: 'panda-abracando-bambu.jpg',
  },
  {
    type: 'quote',
    content:
      'Como o nome já deixa claro, caso a primeira condição não seja verdadeira, apenas o código contido no bloco do `senao` é executado.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'default',
    content: 'Ou seja, se for verdadeiro faça algo, senão faça outra coisa...',
    picture: 'panda-abracando-bambu.jpg',
  },
  {
    type: 'user',
    content: 'Entendi',
  },
  {
    type: 'default',
    content:
      'Muito bem! Agora que a velocidade está regulada, é preciso verificar se o ar é respirável ou não.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'user',
    content: 'Como?',
  },
  {
    type: 'default',
    content:
      'Basta checar se a atmosfera tem nível de oxigênio adequado e se têm ausência de gases tóxicos',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'code',
    content: `var oxigenio = 20 // nível de oxigênio
var nitrogenio = 78 // nível de nitrogênio
var outrosGases = 2 // nível de outros gases

se (
  oxigenio >= 19 e 
  nitrogenio >= 75 e 
  nitrogenio <= 81 e 
  outrosGases <= 5
) {
  escreva("A atmosfera é respirável!")
} senao {
  escreva("A atmosfera não é respirável!")
}

// Resultado: A atmosfera é repirável!`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Acho que você já deve ter percebido, mas como visto no código acima, é possível usar mais de um operador lógico para formar uma condição.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'alert',
    content:
      'Como também escrever uma condição debaixo da outra, que o programa será executado normalmente também, desde que estejam entre os parênteses do `se`.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'default',
    content:
      'Agora com a confirmação de que a atmosfera é respirável, podemos aterrissar no planeta de forma segura.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content:
      'Mas não antes de praticar o tudo o que vimos até agora de estrutura condicional.',
    picture: 'panda-sorrindo.jpg',
  },
]
