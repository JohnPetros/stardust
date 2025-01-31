import type { TextBlockDto } from '@stardust/core/global/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'image',
    picture: 'foquete-viajando.jpg',
    content: 'Vagando no espaço...',
  },
  {
    content: 'Ok, parace que você não encontrou nada de interessante no espaço ainda.',
    type: 'default',
    picture: 'panda-triste.jpg',
  },
  {
    content: 'Mas por quê?',
    type: 'user',
  },
  {
    content: 'Justamente porque seu foguete ainda não sabe quem o está pilotando.',
    type: 'default',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content:
      'Para resolver esse problema você terá que escrever um programa que exiba suas informações para ele, e para isso você terá que usar os comandos *leia()* e *escreva()*, que foram explicados anteriormente.',
    type: 'default',
    picture: 'panda.jpg',
  },
  {
    content:
      'Porém, como você já sabe, para escrever seu nome na tela, é necessário, antes, armazená-lo em uma variável.',
    type: 'default',
    picture: 'panda-sorrindo.jpg',
  },
  {
    content: 'O que são variáveis mesmo?',
    type: 'user',
  },
  {
    content:
      'Variáveis são espaços reservados na memória de um programa para guardar algum tipo de dado.',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content:
      'Para usá-las de fato é necessário fazer o que chamamos de declarar uma variável, escrevendo *var* e depois definindo um nome que você deseja que a variável tenha.',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: 'Como dessa forma:',
    type: 'default',
    picture: 'panda-olhando-computador.jpg',
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
      'Simples, basta colocar o sinal de igual *=* depois do nome da variável e, em seguida, colocar o valor que você deseja que a variável contenha:',
    picture: 'panda-fazendo-coracao.jpg',
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
      'No exemplo acima, estamos criando duas variáveis, uma chamada *nome* que armazenará o valor *Kauê Cabess* e outra chamada *idade* que armazenará o valor *90*.',
    picture: 'panda-oferecendo-bambu.jpg',
  },
  {
    type: 'alert',
    content:
      'O valor 90 não tem aspas porque ele é não é um texto, mas sim um número, mas podemos falar sobre isso depois.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content:
      'Além disso, você também pode atribuir o valor de uma variável a uma outra variável.',
    picture: 'panda-sorrindo-sentado.jpg',
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
    content: 'Agora, observe um exemplo completo utilizando tudo que vimos até agora.',
    picture: 'panda-deslumbrado.jpg',
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
      'ATENÇÃO: ao criar o nome de suas variáveis, é importante seguir 4 regras principais:',
    type: 'alert',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    content: '1 - O nome da variável deve iniciar com uma letra ou sublinhado *(_)*.',
    type: 'quote',
    picture: 'panda-de-oculos.jpg',
  },
  {
    content: `// Nada de iniciar nome de variaveis com números ❌
var 15Cavalos

// Mas o nome pode conter números desde que não seja no começo do nome
var numero999`,
    type: 'code',
    isRunnable: true,
  },
  {
    content: '2 - Nome de variável não pode conter espaços.',
    type: 'quote',
    picture: 'panda-de-oculos.jpg',
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
    picture: 'panda-de-oculos.jpg',
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
      '4 - O nome da variável deve ser descritivo e fácil de entender, e ser relacionado ao valor que está sendo armazenado nela.',
    type: 'quote',
    picture: 'panda-de-oculos.jpg',
  },
  {
    content: `// WHAT⁉
var hwrufh = "Paz mundial!" // ❌

var comida = 999 // ❌

var cor = "azul" // ✅`,
    type: 'code',
    isRunnable: false,
  },
  {
    content:
      'A atribuição de variáveis é uma parte fundamental da programação, pois ela permite armazenar valores e acessá-los ao longo do programa. Ao seguir essas regras corretamente, você poderá atribuir valores a suas variáveis sem problemas em programas futuros.',
    type: 'alert',
    picture: 'panda-sorrindo.jpg',
  },
  {
    content:
      'Agora que você aprendeu mais um pouco, que tal praticar tudo o que já vimos até agora?',
    type: 'quote',
    picture: 'panda-fazendo-coracao.jpg',
  },
]
