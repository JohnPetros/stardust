import { Text } from '@/@types/text'

export const texts: Text[] = [
  {
    type: 'image',
    picture: 'foquete-viajando.jpg',
    content: 'Vagando no espaço...',
  },
  {
    content:
      'Ok, parace que você não encontrou nada de interessante no espaço ainda.',
    type: 'default',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: 'Mas por que?',
    type: 'user',
  },
  {
    content:
      'Justamente porque seu foguete ainda não sabe quem o está pilotando.',
    type: 'default',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content:
      'Para resolver esse problema você terá que escrever um programa que exiba suas informações para ele, e para isso você terá que usar os comandos `leia()` e `escreva()` explicados anteriormente.',
    type: 'default',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content:
      'Porém, como você já sabe, é necessário armazenar seu nome em uma variável no código para então escrevê-lo.',
    type: 'default',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: 'O que são variáveis mesmo?',
    type: 'user',
  },
  {
    content:
      'Variáveis são espaços reservados na memória de um programa para algum tipo de dado.',
    type: 'default',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content:
      'Para usá-las de fato é necessário fazer o que chamamos de declarar uma variável, escrevendo `var`  e em seguida você coloca um nome que você deseja que a variável contenha.',
    type: 'default',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: `var nomeCompleto`,
    type: 'code',
    isRunnable: false,
  },
  {
    content: 'Como colocar dados nelas?',
    type: 'user',
  },
  {
    content:
      'Simples, basta colocar o sinal de "=" depois do nome variável e em seguida o dado que você deseja.',
    picture: 'panda-andando-com-bambu.jpg',
    type: 'default',
  },
  {
    content: `var nome = "Kauê Cabess"
var idade = 90`,
    type: 'code',
    isRunnable: false,
  },
  {
    type: 'default',
    content:
      'No exemplo acima, estamos criando duas variáveis, uma chamada "nome" que armazenará o valor "Kauê Cabess" e outra chamada "idade" que armazenará o valor 90.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'alert',
    content:
      'O valor 90 não tem aspas porque ele é um número e não um texto, mas podemos falar sobre isso depois.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Além disso, você também pode atribuir o valor de uma variável a uma outra variável.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: `var nome = "Kauê Cabess"
var nomeCompleto = nome
escreva(nomeCompleto)

// Resultado: Kauê Cabess`,
    type: 'code',
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Agora observe um exemplo completo utilizando tudo que vimos até agora.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: `var nome = leia("Digite seu nome:")
var idade = leia("Digite sua idade:")
var nomeCompleto = nome

escreva("seu nome completo é ", nomeCompleto)
escreva("e sua idade é ", idade)

// Veja o resultado pressionando o botão de executar`,
    type: 'code',
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Dica: você também pode fazer com que o programa escreva um texto e o conteúdo de uma variável ao mesmo tempo, basta separá-los entre vírgulas, assim como mostrado no exemplo acima.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content:
      'ATENÇÃO: o criar o nome de suas variáveis, é importante seguir 4 regras principais:',
    type: 'alert',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content:
      '1 - O nome da variável deve iniciar com uma letra ou sublinhado `(_)`.',
    type: 'quote',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: `// Nada de iniciar nome de variaveis com números ❌
var 15Cavalos

// Mas o nome pode conter números desde que não seja no começo
var numero999`,
    type: 'code',
    isRunnable: true,
  },
  {
    content: '2 - Nome de variável não pode conter espaços.',
    type: 'quote',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: `// Nada de fazer isso ❌
var minha variavel

// Em vez disso, você pode separar usando sublinhado ✅
var minha_variavel

// ou colocando a primeira letra da segunda palavra em maiúscula ✅
var minhaVariavel`,
    type: 'code',
    isRunnable: true,
  },
  {
    content:
      '3 - O nome da variável não pode ser uma palavra já utilizada pela liguagem, por exemplo, um nome de um comando.',
    type: 'quote',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: `var leia // ❌

var escreva // ❌

var var // ❌`,
    type: 'code',
    isRunnable: true,
  },
  {
    content:
      '4 - O nome da variável deve ser descritivo e fácil de entender, e também, é claro, relacionado ao valor que está sendo armazenado nela.',
    type: 'quote',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: `// WHAT⁉
var hwrufh = "Paz mundial!" // ❌

var comida = 999 // ❌

var cor = "azul" // ✅`,
    type: 'code',
    isRunnable: true,
  },
  {
    content:
      'A atribuição de variáveis é uma parte fundamental da programação, pois permite armazenar valores e acessá-los ao longo do código. Ao seguir essas regras corretamente, você poderá atribuir valores a suas variáveis sem problemas em programas futuros.',
    type: 'alert',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content:
      'Agora que você aprendeu mais um pouco, que tal praticar tudo o que já vimos até agora?',
    type: 'quote',
    picture: 'panda-andando-com-bambu.jpg',
  },
]
