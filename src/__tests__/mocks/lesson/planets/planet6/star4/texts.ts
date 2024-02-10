import { Text } from '@/@types/Text'

export const texts: Text[] = [
  {
    type: 'default',
    content:
      'Muito bem, já faz algum tempo que estamos andando nesse planeta e já adquirimos alguns itens:',
    picture: 'panda-com-mochila.jpg',
  },
  {
    type: 'code',
    content: `var itens = [
  "fruta",
  "ovo de Icelope", 
  "amêndua"
  "cristal", 
  "pirita", 
  "bastão laser quebrado", 
  "fóssil de urso anão",
  "meteorito congelado"
]
    var qtdItens = [9, 4, 20, 37, 12, 1, 2, 1]`,
    isRunnable: false,
  },
  {
    type: 'default',
    content:
      'Assim como fizemos com os alimentos, nós separamos os nomes dos itens das quantidades de cada um.',
    picture: 'panda-com-mochila.jpg',
  },
  {
    type: 'default',
    content: 'E se quiséssemos saber a quantidade total dos itens?',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'user',
    content: 'Usando o método `tamanho()`?',
  },
  {
    type: 'default',
    content:
      'Na verdade, o método `tamanho()` retornaria quantos itens há no vetor, que no nosso caso é 8.',
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    type: 'user',
    content: 'Então `somar()`?',
  },
  {
    type: 'default',
    content: 'Isso!',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'code',
    content: `var qtdItens = [9, 4, 20, 37, 12, 1, 2, 1]

var soma = qtdItens.somar()

// Resultado: 86`,
    isRunnable: false,
  },
  {
    type: 'quote',
    title: 'somar()',
    content:
      'O método `somar()` gera um número sendo a soma de todos os números presente no vetor.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'alert',
    content:
      'Você percebeu que eu coloquei o resultado de `somar()` em uma variável, o que também seria possível usando o método `inclui()`.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [1, 2, 3]

var temNumero2 = numeros.inclui(2)

escreva(temNumero2)

// Resultado: verdadeiro`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Mas, e se o vetor tivesso texto?',
  },
  {
    type: 'default',
    content:
      'Boa pergunta! Nesse caso os primeiros itens que são números seriam somados, mas ao encontrar um texto ele concatenaria os demais itens para formar um texto único, veja só:',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'code',
    content: `var itens = [9, 4, 20, 'texto', 37, 12, 1, 2, 1]

var soma = itens.somar()

escreva(soma)

// Resultado: 33texto3712121`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Mas isso não o que a gente quer usando o método `somar()`, não é?',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'default',
    content:
      'Ok, contudo, esse vetor `itens` está muito bagunçado! Podemos organizá-lo melhor separando os itens por categoria.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'user',
    content: 'Como assim?',
  },
  {
    type: 'default',
    content:
      'Por exemplo, podemos pegar os itens que são alimentos e colocá-los em um vetor separado.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content:
      'Só que aí teríamos que criar um novo vetor contendo parte dos itens de um vetor principal.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content: 'E como fazer isso? Claro, usando um método.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'quote',
    content:
      'Com o método `fatiar()` literalmente pegaremos uma fatia de um vetor. Para usá-lo é preciso passar dois valores entres os seus parênteses: índice inicial e ínidice final.',
    title: 'Fatiar()',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'user',
    content: 'Como assim índice inicial e final?',
  },
  {
    type: 'default',
    content:
      'O índice quer dizer o índice de vetor mesmo, ou seja, sua posição. Primeiramente definimos a partir de qual índice/posição do vetor, começaremos a fatiá-lo. Após isso, definimos em qual posição a fatia deve parar.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'Dessa forma, os itens desse novo vetor, serão aqueles cujo os índices estão presentes nessa fatia.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'user',
    content: 'Não entendi.',
  },
  {
    type: 'default',
    content:
      'Por exemplo, os alimentos do vetor itens são os três primeiros, ou seja, índices 0, 1, e 2. Logo para pegar uma fatia contendo esses itens, definimos o índice inicial como 0 e o índice final como 3.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'code',
    content: `var itens = [
  "fruta",
  "ovo de Icelope", 
  "amêndua",
  "cristal", 
  "pirita", 
  "bastão laser quebrado", 
  "fóssil de urso anão",
  "meteorito congelado"
]

var alimentos = itens.fatiar(0, 3)

escreva(alimentos)
// Resultado: fruta, ovo de Icelope, amêndua`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Mas por que 3?',
  },
  {
    type: 'alert',
    content:
      'Como deve ter percebido, o método `fatiar()` gera um novo vetor, mas não altera o vetor original, apenas avisando.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'user',
    content: 'Hmm...',
  },
  {
    type: 'default',
    content:
      'Esse método é um pouco mais complicado de entender, então continuaremos usando-o para organizar os demais itens.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'code',
    content: `var itens = [
  "fruta",
  "ovo de Icelope", 
  "amêndua",
  "cristal", 
  "pirita", 
  "bastão laser quebrado", 
  "fóssil de urso anão",
  "meteorito congelado"
]

var alimentos = itens.fatiar(0, 3)
var minerais = itens.fatiar(3, 5)
var ferramentas = itens.fatiar(5, 6)
var exoticos = itens.fatiar(6)

escreva(alimentos)
escreva(minerais)
escreva(ferramentas)
escreva(exoticos)
// Excecute para ver o resultado`,
    isRunnable: true,
  },
  {
    type: 'list',
    content: 'Assim, temos:',
    items: [
      '(0, 3) - Primeiro item até o terceiro item',
      '(3, 5) - Quarto item até o quinto item',
      '(5, 6) - Sexto item até ele mesmo',
      '(6) - Sétimo item até o último item',
    ],
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'user',
    content:
      'Mas espera aí! no último, o `fatiar()` só tem um valor nos parênteses!',
  },
  {
    type: 'default',
    content:
      'Bem observado! Não te contei, mas é possível omitir o índice final. Caso você faça isso, o índice final será sempre o útimo índice do vetor.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content:
      'O que quer dizer que se apenas o índice inicial for passado, o `fatiar()` retornará o item com esse índice e todos os demais itens do vetor após ele.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [1, 2, 3, 4, 5]
var fatia = numeros.fatiar(2)
escreva(fatia)

// Resultado: 3, 4, 5
// fatiar(2) = Terceiro item até o último item do vetor`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Tá mas, o que fazemos com vetor itens?',
  },
  {
    type: 'default',
    content:
      'Sim, agora temos itens duplicados em vetores diferentes, justo porque o `fatiar()` não modifica o vetor originial.',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'default',
    content:
      'Entretanto, há um método que faz exatamente o que "fatiar()" faz, porém ele consegue alterar o original.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content: 'Esse método contarei na próxima.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'user',
    content: ':(',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Mas, como bônus por você ter chegado até aqui, vou te ensinar um método extra.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'user',
    content: 'Qual?',
  },
  {
    type: 'default',
    content: 'O método `inverter()`.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'quote',
    title: 'inverter()',
    content:
      'O método `inverter()` é usado para inverter a ordem dos elementos de um vetor. Ele não cria um novo vetor, mas sim modifica o vetor original.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'quote',
    content:
      'E estou falando de inverter mesmo, ou seja, ao aplicar o método `inverter()` em um vetor, o último elemento passa a ser o primeiro, o penúltimo passa a ser o segundo, e assim por diante.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = [
  "fruta",
  "ovo de Icelope", 
  "amêndua",
]
    
var alimentosInvertidos = alimentos.inverter()
escreva(alimentosInvertidos)
// Resultado: amêndua, ovo de Icelope, fruta`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Ah...',
  },
  {
    type: 'default',
    content: 'Pode não parecer muito útil, mas vai que né.',
    picture: 'panda-rindo-deitado.jpg',
  },
]
