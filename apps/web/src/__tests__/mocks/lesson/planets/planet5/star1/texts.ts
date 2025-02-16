import type { TextBlockDto } from '@stardust/core/global/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    content: 'Ufa, parace que aqueles aliens estranhos foram para outra direção.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content: 'Contudo, agora estamos em um planeta completamente desconhecido.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content:
      'Para começar tentar descobrir onde estamos, podemos fazer uma varredura do local, coletando amostras do solo.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'code',
    content: `var totalAmostras = 0`,
    isRunnable: false,
  },
  {
    type: 'default',
    content:
      'Toda vez que o foguete coleta uma amostra, podemos fazer um programa que incremente em 1 a variavel *totalAmostras*.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'code',
    content: `var totalAmostras = 0
totalAmostras++
escreva(totalAmostras)

// Resultado: 1`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'O que são esses dois sinais de mais?',
  },
  {
    type: 'alert',
    content:
      'Eu não te contei, mas esse é outro operador especial, chamado *operador de incremento*, representado por *++*, que se colocado após uma variável do tipo *número* ele acrescenta 1 ao seu valor atual.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content:
      'Ok, porém o foguete possui 10 lotes disponíveis para armazenar amostras. Então, devemos incrementar a variável *totalAmostras* 10 vezes seguidas.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var totalAmostras = 0
totalAmostras++
totalAmostras++
totalAmostras++
totalAmostras++
totalAmostras++
totalAmostras++
totalAmostras++
totalAmostras++
totalAmostras++
totalAmostras++

escreva(totalAmostras)
// Resultado: 10`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'É claro que existe uma maneira muuuuuuito mais fácil de fazer isso.',
    picture: 'panda-abracando-bambu.jpg',
  },
  {
    type: 'user',
    content: 'Como?',
  },
  {
    type: 'default',
    content:
      'Usando estrutura de repetição, ou para os mais íntimos, `laço de repetição` ou apenas `laço`.',
    picture: 'panda-abracando-bambu.jpg',
  },
  {
    type: 'user',
    content: 'Laço?',
  },
  {
    type: 'default',
    content:
      'Sim!! Os laços são usados para executar um conjunto de instruções várias vezes. Isso ajuda a reduzir o código e evitar repetições desnecessárias.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'alert',
    content:
      'Existem 3 maneiras de usar laços, mas considerando esse nosso caso, iremos utilizar a instrução *para*',
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    type: 'quote',
    title: 'Laço para',
    content:
      'A instrução *para* é o tipo de laço mais comum, e é usado para executar um bloco de código por um número específico de vezes. Para escrevê-la, a sintaxe é a seguinte:',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'code',
    content: `var totalLotes = 10
var totalAmostras = 0

para (var contador = 0; contador < totalLotes; contador++) {
  totalAmostras++
}

escreva(totalAmostras)
// Resultado: 10`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Não entendi nada!',
  },
  {
    type: 'default',
    content:
      'Vamos por partes: todo laço *para* tem que ter 3 parâmetros, que são as expressões separadas por ponto e vírgula e que estão entre parênteses após a palavra "para".',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'quote',
    title: 'Inicialização',
    content:
      'A primeira é a *Inicialização*, que é a primeira coisa a ser executada antes do *para* fazer o seu trabalho de fato.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'alert',
    content:
      'A inicialização serve para iniciar a variável de controle do laço, que explicarei mais sobre ela depois.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'quote',
    title: 'Condição',
    content:
      'A segunda é a *Condição*, que é a expressão lógica avaliada no início de cada iteração do laço. Se a condição for verdadeira, o bloco de código dentro do laço é executado; caso contrário, o laço é encerrado.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'alert',
    content:
      'Iteração do laço refere-se quantas vezes o bloco de código será executado, ou seja, 10 iterações significam 10 repetições.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'quote',
    title: 'Passo',
    content:
      'A última parte é chamado de *Passo*, que é a instrução executada no final de cada iteração do laço. Geralmente é usada para atualizar a variável de controle que mencionei anteriormente.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'alert',
    content:
      'A variável de controle é uma variável que é utilizada para determinar quando a execução do laço irá parar. Geralmente, o valor dela é atualizada a cada iteração e esse novo valor é então usada na condição do laço antes que uma nova execução seja feita.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content: 'Agora voltando ao código que acabamos de fazer:',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var totalLotes = 10
var totalAmostras = 0

para (var contador = 0; contador < totalLotes; contador++) {
  totalAmostras++
}

escreva(totalAmostras)
// Resultado: 10`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Nesse caso específico, na inicialização do *para* declaramos uma variável contador iniciando com 0 e ela fará o papel de controlar o laço.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content:
      'A condição será verificar se o valor de contador é menor que o valor de *totalLotes*, que é 10.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'default',
    content: 'No Passo, a variável *contador* será incrementado em 1 a cada iteração.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'No bloco de código, definimos que a variável *totalAmostras* também dever ser incrementada em 1 a cada iteração.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'Dessa forma, se a variável *totalAmostras* for igual ou maior que *totalLotes*, o *para* é encerrado, totalizando 10 iterações, ou seja, o valor de *totalAmostras* foi icrementada em 1 por 10 vezes seguidas.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'user',
    content: 'Acho que comecei a entender',
  },
  {
    type: 'default',
    content:
      'É claro também que podemos colocar qualquer código válido dentro do bloco do *para*, inclusive outras estruturas.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, se quisermos que ao coletar 5 amostras seja escrito "Já coletei 5 amostras", podemos colocar uma estrutura condicional dentro do *para*.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'code',
    content: `var totalLotes = 10
var totalAmostras = 0

para (var contador = 0; contador < totalLotes; contador++) {
  se (contador == 5) {
    escreva("Já coletei 5 amostras")
  }

  totalAmostras++
}
escreva(totalAmostras) // 10`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'O que quer dizer também que podemos colocar laço dentro de outro laço, mas podemos falar sobre isso em outra hora.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'default',
    content:
      'Agora que já temos amostras coletadas, podemos ver o que nesse novo planeta pode nos surpreender. Mas para isso precisaremos de uma máquina que analise essas amostras.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'image',
    content: 'Olá!',
    picture: 'analisador-acenando.jpg',
  },
  {
    type: 'user',
    content: 'Quem é esse?',
  },
  {
    type: 'default',
    content: 'Esse é nosso robô analisador, que veio junto no foguete, é claro.',
    picture: 'panda-sorrindo.jpg',
  },
]
