import type { TextBlockDto } from '@stardust/core/global/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    content:
      'Parece que sua mensagem foi enviada com sucesso para o planeta que você encontrou, mas você não obteve nenhuma resposta :(',
    picture: 'panda-confuso.jpg',
  },
  {
    content: 'Mas, por quê?',
    type: 'user',
  },
  {
    type: 'default',
    content:
      'Isso dever ter acontecido por causa do tipo de dado que você estava usando.',
    picture: 'panda.jpg',
  },
  {
    content: 'Pera aí, tipo de dado?',
    type: 'user',
  },
  {
    content:
      'Isso mesmo! Em programação podemos usar vários tipos de dados diferentes. Os mais básicos são tipo de texto, número e lógico.',
    type: 'default',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    content:
      'Por enquanto, vamos falar sobre o tipo texto, que é o que mais usamos até agora.',
    type: 'alert',
    picture: 'panda.jpg',
  },
  {
    content:
      'O tipo de texto é utilizado para representar valores que são texto, dã! Eles podem ser compostos por uma ou mais letras, como também números ou símbolos.',
    type: 'quote',
    title: 'Tipo texto',
    picture: 'panda.jpg',
  },
  {
    content:
      'Para fazer com que o programa entenda que uma informação é do tipo texto, basta colocá-la entre aspas, podendo ser simples `(\' \')` ou duplas `(" ")` assim como nós já fizemos antes.',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: `var mensagem = "Olá, mundo!"
var nome = 'Thiago Martins'
var numero = "250"
var simbolos = '$@%&'`,
    type: 'code',
    isRunnable: false,
  },
  {
    content:
      'Cuidado, o `250` no exemplo acima não do tipo número, mas sim do tipo texto, justamente porque ele está entre aspas.',
    type: 'alert',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content:
      'É possível unir textos usando o operador de `adição (+)`, ato que chamamos de `concatenação`.',
    type: 'quote',
    title: 'Concatenação de textos',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: `escreva('Eu encontrei um ' + 'planeta')
// Resultado: Eu encontrei um planeta`,
    type: 'code',
    isRunnable: true,
  },
  {
    content: 'Você também pode concatenar textos que estão em variáveis.',
    type: 'alert',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: `var nomePlaneta = "Datahon"
escreva('Eu encontrei um ' + 'planeta' + ' e ele se chama ' + nomePlaneta)
// Resultado: Eu encontrei um planeta e ele se chama Datahon`,
    type: 'code',
    isRunnable: true,
  },
  {
    content:
      'Você também pode usar o que chamamos de `interpolação`: Em vez de inserir a variável em um texto usando operador de adição, você pode colocar essa variável entre `${ }`',
    type: 'quote',
    title: 'Interpolação',

    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: `var nomePlaneta = "Datahon"
escreva("Esse planeta \${nomePlaneta} parece ser amigável")
// Resultado: Esse planeta Datahon parece ser amigável`,
    type: 'code',
    isRunnable: true,
  },
  {
    content:
      'Cuidado também: se você usar aspas duplas dentro de outras aspas duplas, vai haver conflito.',
    type: 'alert',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: `escreva("Essa mensagem foi "estranha"")

// Resultado: Código inválido`,
    type: 'code',
    isRunnable: true,
  },
  {
    content:
      'A solução para essa situação é escrever aspas simples dentro de aspas duplas ou vice-versa.',
    type: 'alert',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    content: `escreva("Essa mensagem foi 'extranha'")
escreva('Também "acho"')`,
    type: 'code',
    isRunnable: true,
  },
  {
    content:
      'Agora que você conhece mais sobre o tipo texto, que tal reforçar isso com algumas questões?',
    type: 'quote',
    picture: 'panda-andando-com-bambu.jpg',
  },
]
