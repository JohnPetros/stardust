export const texts = [
  {
    type: 'image',
    content: 'Finalmente, já pousamos na superficie do planeta Arrayon.',
    picture: 'planeta-glacial.jpg',
  },
  {
    type: 'default',
    content:
      'Antes de sairmos do fogute é bom verificar se estamos levando um aquecedor no nosso conjunto de equipamentos',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'default',
    content: 'E, claro, nosso conjunto de equipamentos se trata de vetor.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'default',
    content:
      'Para fazer isso, devemos usar outro método, no caso, o `inclui()`',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var equipamentos = [
  "mochila",
  "lanterna",
  "aquecedor",
  "sinalizador"
]

escreva(equipamentos.inclui("aquecedor"))

// Resultado: verdadeiro`,
    isRunnable: true,
  },
  {
    type: 'quote',
    title: 'inclui()',
    content:
      'O método `inclui()` verifica se um elemento específico passado entre parênteses está presente no vetor ou nao. ',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'quote',
    content:
      'Esse método retorna um valor logico, ou seja, caso um item esteja incluido ele irá retornar `verdadeiro`, caso contrário retornará `falso`.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'É por esse motivo que nesse caso o resultado deu `verdadeiro`, pois de fato temos um aquecedor.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'Depois de verificar nosso aquecedor, vamos olhar novamente em nossos equipamentos para ver se possuimos alguma arma, uma blaster, por exemplo, que servirará para a nossa defesa, pois apesar de estar congelado, esse novo planeta pode possuir criaturas selvagens.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var equipamentos = [
  "mochila",
  "lanterna",
  "aquecedor",
  "sinalizador"
]

escreva(equipamentos.inclui("blaster"))

// Resultado: falso`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Obiviamente deu `falso`, pois já te contei que não temos armas há 4 planetas atrás.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'default',
    content:
      'Porém, você não acha que ainda está faltando equipamentos importantes, tipo um kit de primeiro socorros ou um radar?.',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'default',
    content:
      'De fato, esquecemos coisas que ainda não tiramos do nosso vetor compras.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var compras = [
  "kit de primeiro socorros", 
  "radar", 
  "bateria",
]`,
    isRunnable: false,
  },
  {
    type: 'default',
    content:
      'Para adicionar esses itens no vetor equipamentos, podemos fazer de várias formas.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'A mais simples é usando um método que junte esses vetores em um único vetor, ou seja, que concatene eles.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'user',
    content: 'Então existe o método concatenar()?',
  },
  {
    type: 'default',
    content:
      'Isso! Você já deve ter percebido que temos métodos para quase tudo.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'quote',
    title: 'concatenar()',
    content:
      'O método `concatenar()` uni vetores diferentes em um vetor, só que ele não altera nenhum dos vetores originais. Então o resultado dessa união é um novo vetor.',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'code',
    content: `var equipamentos = [
  "mochila",
  "lanterna",
  "aquecedor",
  "sinalizador"
]

var meusItens = equipamentos.concatenar(compras)

escreva(meusItens)

// Resultado: mochila, lanterna, aquecedor, sinalizador, kit de primeiro socorros, radar, bateria'`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Veja que os vetores `equipamentos` e `compras` ainda existem, mas não precisamos mais deles, todos os elementos presentes nos dois estão também na variável `meusItens`.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'alert',
    content:
      'Essa é uma boa técnica para adicionar vários elementos de uma vez em um vetor, só que a única desvantagem seria ter que criar uma nova variável caso quiséssemos manipular esse novo vetor.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [1, 2, 3]

var novosNumeros = numeros.concatenar([4, 5, 6])

escreva(novosNumeros)

// Resultado: 1, 2, 3, 4, 5, 6`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Muito bem, mas acho que você deve estar se perguntando: "A gente não vai levar alimento nenhum?"',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'default',
    content:
      'Não passeremos fome. Eu coloquei os alimentos em um vetor separado.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = [
  "garrafa d'água", 
  "barra de cereal", 
  "carne enlatada", 
  "fruta"
]

var qtdAlimentos = [2, 7, 3, 4]

escreva(alimentos)
escreva(qtdAlimentos)

/* 
Resultado: 
garrafa d'água, barra de cereal, carne enlatada, fruta
2, 7, 3, 4
*/`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Antes que pergunte usar `/* */` é outra maneira para comentar código, só que para várias linhas ao mesmo tempo.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'user',
    content: 'O que são `qtdAlimentos`?',
  },
  {
    type: 'default',
    content:
      'São as quantidades para cada item do vetor alimentos, assim não teremos valores repetidos em um vetor.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'Além disso, para deixar tudo mais organizado, podemos ordenar os alimentos em ordem alfabética.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'default',
    content: 'E como fazer isso? Claro, usando um método chamado `ordenar()`',
    picture: 'panda-amando-bambu.jpg',
  },
  {
    type: 'quote',
    title: 'ordenar()',
    content:
      'O método `ordenar()` é usado para colocar os elementos de um vetor em ordem alfabética caso ele tenha textos, ou numérica, caso tenha números. Esse método já não cria um novo vetor, mas sim modifica o vetor original.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = [
  "garrafa d'água",
  "barra de cereal",
  "carne enlatada",
  "fruta",
]

var qtdAlimentos = [2, 7, 3, 4]

escreva(alimentos)
escreva(qtdAlimentos)

/* 
Resultado: 
barra de cereal, carne enlatada, fruta, garrafa d'água
2, 3, 4, 7
*/`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'É possível definir a forma de ordenação do `ordenar()`. Por exemplo, e se quiséssemos colocar quantidades em ordem descrecente? Mas isso podemos deixar para depois.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'Agora que temos tudo organizado, podemos partir para a exploração.',
    picture: 'panda-com-mochila.jpg',
  },
]
