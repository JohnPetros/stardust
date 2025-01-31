import type { TextBlockDto } from '@stardust/core/global/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    title: 'Missão cumprida!',
    content:
      'Agora que o ambiente do planeta foi devidamente analisado, é possível perceber que ele é perfeitamente habitável 🎉! ',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'default',
    content: 'Contudo, você ainda há uma questão pendente.',
    picture: 'panda.jpg',
  },
  {
    type: 'user',
    content: 'E qual seria?',
  },
  {
    type: 'default',
    content:
      'Você precisa verificar o custo de vida, pois não dá para viver em um planeta sem analisar os gastos, né?',
    picture: 'panda-com-mochila.jpg',
  },
  {
    type: 'user',
    content: 'E como faço isso?',
  },
  {
    type: 'default',
    content:
      'Por sorte, seu foguete é equipado com tecnologia de ponta, que faz cálculos usando operadores aritméticos.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'user',
    content: 'Pera aí, operadores aritméticos? Tipo somar e subtrair?',
  },
  {
    type: 'default',
    content: 'Sim!! não só aritméticos, mas também lógicos e relacionais!',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'alert',
    content:
      'Porém, por enquanto vamos apenas usar os aritméticos para efetuar operações mais simples.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, já é uma boa hora de reabastecer o foguete com combustível, ou seja, precisamos adicionar combustível atual com combustível novo.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'list',
    content:
      'E para isso nós usamos o operador *+* de adição, o mesmo usado para concatenar textos.',
    title: 'Adição (+)',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var combustivel = 100 
var combustivelAtual = 200
var totalCombustivel = combustivel + combustivelAtual

escreva("A nave agora tem " + totalCombustivel + " galões de combustível")

// Resultado: A nave agora tem 300 galões de combustível`,
    isRunnable: true,
  },
  {
    type: 'list',
    content:
      'Além de reabastecer, o próprio foguete consegue calcular o quanto de suprimentos você já consumiu até agora, utilizando simplesmente o operador de subtração *-*.',
    title: 'Subtração (-)',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var suprimentosConsumidos = 250
var suprimentosAtual = 300
var suprimentosRestante = suprimentosAtual - suprimentosConsumidos

escreva("Você possui " + suprimentosRestante + " suprimentos")

// Resultado: Você possui 50 suprimentos`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content: 'Parece que você não tem muitos suprimentos agora, não é mesmo?',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content:
      'Nem tudo está perdido! Por sua sorte (de novo), seu foguete está preparado com uma máquina de produzir suprimentos.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'default',
    content:
      'Mas nem tudo são flores! A máquina de fazer suprimentos produz apenas 1 suprimento por dia.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'default',
    content:
      'Logo, para fazer o cálculo da quantidade de suprimentos que você teria em um mês é necessário fazer uma operação de multiplicação: ***',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'list',
    content:
      'Você não leu errado. Para fazer um cálculo de multiplicação, usamos o operador *** em vez de *x*.',
    title: 'Multiplicação (*)',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var suprimentoPorDia = 1
var diasNoMes = 30
var suprimentosNoMes = suprimentoPorDia * diasNoMes

escreva("Em um mês você terá " + suprimentosNoMes + " suprimentos")

// Resultado: Em um mês você terá 30 suprimentos`,
    isRunnable: true,
  },
  {
    type: 'list',
    content:
      'Parece muito para você? Ok, mas agora é necessário calcular a quantidade de suprimentos que você consome por mês.',
    title: 'Multiplicação (*)',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'user',
    content: 'Será que é o suficiente?',
  },
  {
    type: 'default',
    content:
      'Parece muito para você? Ok, mas agora é necessário calcular a quantidade de suprimentos que você consome por mês.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'Normalmente, vejo que seu consumo é de 90 suprimentos ao mês, então basta dividir 90 por 30.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'list',
    content:
      'Aí temos mais uma caso diferenciado: em vez de usar o operador *÷* que você provavelmente já se acustumou a utilizar, é necessário usar a barra */*. Veja o exemplo:',
    picture: 'panda-abracando-bambu.jpg',
    title: 'Divisão (/)',
  },
  {
    type: 'code',
    content: `var suprimentosNoMes = 90
var diasNoMes = 30
var suprimentosPorDia = suprimentosNoMes / diasNoMes

escreva("Você consome " + suprimentosPorDia + " suprimentos por dia")

// Resultado: Você consome 3 suprimentos por dia`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Obviamente, você também pode usar vários operadores ao mesmo tempo em uma única linha.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'alert',
    content:
      'Cuidado! Os operadores obedecem a ordem de precedência da matemática, ou seja, operações de multiplicação ou divisão são executadas antes de adição ou subtração!',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, ao querer calcular 5 + 5 * 5, o resultado não vai ser 50, mas sim 30!',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `escreva(5 + 5 * 5)
//  Resultado: 30`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Mas se eu quisesse fazer a soma primeiro?',
  },
  {
    content:
      'Para isso, assim como na matemática, você deve colocar entre parênteses as expressões que deseja que sejam calculadas primeiro.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
    type: 'default',
  },
  {
    type: 'code',
    content: `escreva((5 + 5) * 5)
//  Resultado: 50`,
    isRunnable: true,
  },
  {
    content:
      'Veja o código de cálculo de suprimentos no final do mês, mas usando vários operadores:',
    picture: 'panda-olhando-computador.jpg',
    type: 'default',
  },
  {
    type: 'code',
    content: `var diasMes = 30
var suprimentosPorDia = 1
var suprimentosAtual = 300
var consumoTotal = suprimentosAtual - 250 + suprimentosPorDia * diasMes - 3 * diasMes

escreva('no final do mês você terá ' + consumoTotal + ' de suprimentos')

//  Resultado: no final do mês você terá -10 de suprimentos`,
    isRunnable: true,
  },
  {
    content:
      'Agora você percebeu a importância das variáveis de organizar o código, não é?',
    picture: 'panda-olhando-computador.jpg',
    type: 'default',
  },
  {
    content:
      'Enfim, Não é preciso ser o mestre da matemática pra perceber que você não terá a quantidade de suprimento para sobreviver nesse planeta.',
    picture: 'panda-comendo-moeda.jpg',
    type: 'alert',
  },
  {
    content:
      'Nesse caso, suponho que você precise achar vida alienígena para obter outros tipos de suprimentos.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
    type: 'default',
  },
  {
    content:
      'Porém, ainda há a questão de quanto de energia existe disponível para os dois motores presentes no foguete, pois por algum motivo a proporção não está igual.',
    picture: 'panda-olhando-computador.jpg',
    type: 'default',
  },
  {
    content: 'Mas, como assim?',
    type: 'user',
  },
  {
    content:
      'Para o foguete funcionar direito, seus dois motores precisam dividir a energia de forma equivalente, caso contrário as chances dele explodir com você dentro aumentam bastante :)',
    picture: 'panda-segurando-bambu-de-pe.jpg',
    type: 'default',
  },
  {
    content:
      'No momento atual há disponível *10125* de energia. Para saber se é possível distribuir a energia igualmente para os dois motores, basta verificar se esse número é divisível por 2.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
    type: 'default',
  },
  {
    content:
      'Para isso, podemos usar um operador especial chamado *módulo*, que serve para calcular o resto da divisão entre 2 números usando o símbolo de porcentagem *%*.',
    picture: 'panda-fazendo-coracao.jpg',
    title: 'Módulo (%)',
    type: 'list',
  },
  {
    content: `var energiaAtual = 10125
var resto = 10125 % 2
escreva('O resto da divisão de 10125 por 2 é igual a ' + resto)

// Resultado: Portanto, o resto da divisão de 10125 por 2 é igual a 1`,
    type: 'code',
    isRunnable: true,
  },
  {
    content: 'Não sei se entendi.',
    picture: 'panda-olhando-computador.jpg',
    type: 'user',
  },
  {
    content:
      '10125 dividido por 2 é igual 5062 e sobra 1, ou seja, a proporção não será igual para os dois motores porque um motor tem um a mais 😢.',
    picture: 'panda-triste.jpg',
    type: 'default',
  },
  {
    content:
      'Para resolver esse problema, precisaremos usar os operadores, mas não os aritméticos',
    picture: 'panda.jpg',
    type: 'default',
  },
  {
    content:
      "Antes vamos averiguar se não tem nenhuma vida alienígena nas redondezas. Let's go!",
    picture: 'panda-olhando-de-lado.jpg',
    type: 'default',
  },
]
