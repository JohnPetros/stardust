import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

export const texts: TextBlockDto[] = [
  { type: 'image', content: 'Decolando...', picture: 'foguete-decolando.jpg' },
  {
    type: 'default',
    content:
      'Agora que você finalmente está no espaço, imagino que você queira explorar novos planetas e talvez encontrar vidas alienígenas 👽.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Para isso, você vai ter que instruir seu foguete escrevendo programas, e para escrever programas é preciso usar uma linguagem de programação.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'alert',
    content:
      'Toda linguagem de programação possui uma maneira própria de escrever, ou seja, um conjunto de regras e comandos que instruem o que o programa deve fazer. E existem diversas linguagens de programação!',
    picture: 'panda.jpg',
  },
  { type: 'user', content: 'E qual devemos utilizar?' },
  {
    type: 'default',
    content:
      'Para nossa sorte, o foguete entende uma linguagem especial chamada Delégua. Ela possui uma sintaxe fácil e intuitiva em português, o que facilita bastante, inclusive.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, para fazer com que o foguete imprima no painel: "explorar o espaço é legal", basta usar o comando chamado *escreva()* e colocar a mensagem entre seus parênteses.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content: 'Veja um exemplo:',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'code',
    content: 'escreva("explorar o espaço é legal")',
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Simples e fácil, mas caso você queira que o foguete receba e leia informações suas (o que chamamos de entrada de dados), você pode usar o comando *leia()*.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'default',
    content:
      'Sempre que o comando *leia()* for executado, uma janela abrirá para inserir algum dado.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  { type: 'code', content: 'leia()', isRunnable: true },
  { type: 'user', content: 'Oxe! Nada foi impresso na tela!' },
  {
    type: 'default',
    content:
      'Exatamente! Primeiro, veja que se algum texto for colocado dentro do parênteses do *leia()*, esse texto será exibido como mensagem dentro da janela.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = leia("Alguma mensagem")
escreva(mensagem)`,
    isRunnable: true,
  },
  { type: 'user', content: 'Mas, o que diachos é var?' },
  {
    type: 'default',
    content:
      'Para receber dados, naturalmente, você deve armazená-los em algum lugar, e no caso de um programa, esse lugar é algo que chamamos de variável.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'quote',
    content:
      'Variáveis nada mais são do que espaços na memória de um programa, onde você pode armazenar qualquer tipo de dado.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'default',
    content:
      'Elas têm esse nome porque podem variar de valor, ou seja, receber outros valores no decorrer do programa.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'alert',
    content:
      'Você não precisa entender tudo de variáveis agora, pois usaremos melhor elas mais para frente.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content:
      'Vamos fazer o seguinte: Colocar seu nome em uma variável usando *leia()* e depois exibi-lo usando *escreva()*.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var seuNome = leia("Insira seu nome: ")
escreva(seuNome)`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Bacana!! Porém, na hora de escrever um código consistente e sem erros, você precisa tomar alguns cuidados:',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'quote',
    content:
      '1 - É preciso respeitar sempre o nome dos comandos definidos pela linguagem. Por exemplo, caso você tivesse colocado *exiba* em vez de *escreva*, deixado de usar os parênteses ou as aspas para escrever as mensagens dentro dos parênteses, o código daria erro.',
    picture: 'panda-exercitando.jpg',
  },
  {
    type: 'quote',
    content:
      '2 - Você deve entender o objetivo, quando e porquê usar cada comando. Por exemplo, para exibir dados que serão inseridos no programa, eu preciso usar primeiro o comando *leia()* porque ele serve para ler informações que vêm de fora do programa. Depois devo usar o comando *escreva()* para exibir esses dados.',
    picture: 'panda-exercitando.jpg',
  },
  {
    type: 'quote',
    content:
      '3 - É crucial compreender que o fluxo de um programa é sempre de cima para baixo, ou seja, não faria sentido eu tentar ler uma informação com *leia()* depois de tentar exibi-la na tela com *escreva()*.',
    picture: 'panda-exercitando.jpg',
  },
  {
    type: 'quote',
    content: 'Veja um exemplo de código completamente errado:',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content:
      '// Código completamente sem cabimento 🤨\nexiba(seuNome)\nvar seuNome = leia()',
    isRunnable: false,
  },
  {
    type: 'default',
    content:
      'Ah... Essas duas barras escritas no código servem para indicar ao programa ignorar uma determinada linha no momento de execução. Dessa forma você pode escrever qualquer coisa após as duas barras e nenhum erro acontecerá.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `// Não estou sendo executado
escreva("Estou sendo executado")`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Os comandos *leia()* e *escreva()* são considerados comandos de entrada e saída, respectivamente. Podemos dizer que usando o comando *leia()* você está fazendo os dados "entrarem" no programa, enquanto com o *escreva()* você está fazendo dados "saírem" para serem exibidos.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'quote',
    content:
      'Agora que você sabe um pouco mais, está na hora de revisar tudo isso, que tal?',
    picture: 'panda.jpg',
  },
]
