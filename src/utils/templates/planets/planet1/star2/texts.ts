export const texts = [
  {
    type: 'image',
    picture: 'foguete-decolando.jpg',
    content: 'Decolando...',
  },
  {
    content:
      'Agora que você finalmente está no espaço, imagino que você queira explorar novos planetas e talvez encontrar vidas alienígenas 👽.',
    type: 'default',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content:
      'Para isso você vai ter que instruir seu foguete, escrevendo programas, e para escrever programas é preciso usar uma linguagem de programação.',
    type: 'default',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    content:
      'Toda linguagem de programação possui uma maneira própria de escrever, que é o conjunto de regras e comandos que instruem o que o programa deve fazer. E existem diversas linguagens de programação!',
    type: 'alert',
    picture: 'panda.jpg',
  },
  {
    content: 'E qual devemos utilizar?',
    type: 'user',
  },
  {
    content:
      'Para nossa sorte, o foguete entende uma linguagem especial chamada Delégua. Ela possui uma sintaxe fácil e intuitiva em português, o que facilita bastante.',
    type: 'default',
    picture: 'panda.jpg',
  },
  {
    content:
      'Por exemplo, para fazer com que o foguete imprima no painel: "explorar o espaço é legal", basta usar o comando chamado `escreva()` e colocar a mensagem entre seus parênteses.',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: 'Veja um exemplo:',
    type: 'default',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    content: `escreva("explorar o espaço é legal")`,
    type: 'code',
    isRunnable: true,
  },
  {
    content:
      'Simples e fácil, mas caso você queria que o foguete receba e leia informações suas (o que chamamos de entrada de dados), você pode usar o comando `leia()`',
    type: 'default',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    content:
      'Sempre que o comando `leia()` for executado, uma janela abrirá para inserir algum dado.',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: `leia()`,
    type: 'code',
    isRunnable: true,
  },
  {
    content: 'Mas, não aconteceu nada!',
    type: 'user',
  },
  {
    content:
      'Veja que se algum texto for colocado dentro do parênteses do `leia()`, esse texto servirá como mensagem dentro da janela.',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: `var seuNome = leia("Insira seu nome: ")`,
    type: 'code',
    isRunnable: true,
  },
  {
    content: 'Mas, o que diachos é var?',
    type: 'user',
  },
  {
    content:
      'Para receber dados, naturalmente você tem que colocar em algum lugar, que no caso de um programa sempre vai ser em algo que chamamos de variável.',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content:
      'Variáveis nada mais são do que espaços na memória de um programa, onde você pode armazenar qualquer tipo de dado.',
    type: 'quote',
    picture: 'panda-piscando.jpg',
  },
  {
    content:
      'Elas tem esse nome porque elas podem variar de valor, ou seja, receber outros valores no decorrer do programa.',
    type: 'default',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    content:
      'Você não precisa entender tudo de variáveis agora, pois usaremos melhor elas mais para frente.',
    type: 'alert',
    picture: 'panda-sorrindo.jpg',
  },
  {
    content: 'Vamos fazer o seguinte: Colocar seu nome em uma variável usando `leia()` e depois exibí-lo usando `escreva()`.',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: `var seuNome = leia("Insira seu nome: ")
escreva(seuNome)`,
    type: 'code',
    isRunnable: true,
  },
  {
    content: 'Bacana!! Mas na hora de escrever um código consistente em sem erros, você precisa tomar alguns cuidados:',
    type: 'default',
    picture: 'panda-comemorando.jpg',
  },
  {
    content: '1 - É preciso respeitar sempre o nome dos comandos definida pela linguagem, por exemplo, caso você tivesse colocado `exiba` em vez de `escreva`, deixado de usar os parênteses ou as aspas para escrever as mensagem dentro dos parênteses, o código daria erro.',
    type: 'quote',
    picture: 'panda-exercitando.jpg',
  },
  {
    content: '2 - Você deve entender o objetivo, quando e porquê usar cada comando. Por exemplo, para exibir dados que serão inseridos no programa, eu preciso usar primeiro o comando `leia()` porque ele serve para ler informações que vem de fora do programa. Depois devo usar o comando `escreva()` para exibir esses dados.',
    type: 'quote',
    picture: 'panda-exercitando.jpg',
  },
  {
    content: '3 - É crucial compreender que o fluxo de um programa é sempre de cima para baixo, ou seja, não faria sentido eu tentar ler uma informação com `leia()` depois de tentar exibi-la na tela com `escreva()`.',
    type: 'quote',
    picture: 'panda-exercitando.jpg',
  },
  {
    content: 'Veja um exemplo de código completamente errado:',
    type: 'quote',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: `// Código completamente sem cabimento 🤨
exiba(seuNome)
var seuNome = leia()`,
    type: 'code',
    isRunnable: false,
  },
  {
    content: 'Ah... Essas duas barras escritas no código servem para indicar ao programa ignorar uma determinada linha na hora de execução. Dessa forma você pode escrever qualquer coisa após as duas barras e nenhum erro acontecerá.',
    type: 'default',
    picture: 'panda-sorrindo.jpg',
  },
  {
    content: '`leia` e `escreva` são considerados comandos de entrada e saída respectivamente. Podemos dizer que usando o comando `leia()` você está entrando com dados, enquanto com o `escreva()` você está fazendo dados saírem para serem exibidos.',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: 'Agora que você sabe um pouco mais está na hora revisar tudo isso, que tal?',
    type: 'quote',
    picture: 'panda.jpg',
  },
]
