import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    content: 'Finalmente, já pousamos na superficie do planeta Arrayon.',
    picture: 'panda-com-mochila.jpg',
  },
  {
    type: 'default',
    content:
      'Antes de sairmos do foguete é bom verificar se estamos levando um aquecedor no nosso conjunto de equipamentos',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'image',
    content: 'E, claro, nosso conjunto de equipamentos se trata de uma lista.',
    picture: 'mochila.jpg',
  },
  {
    type: 'default',
    content: 'Para fazer isso, devemos usar outro método, no caso, o *inclui()*.',
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
    title: 'Método inclui()',
    content:
      'O método *inclui()* verifica se um elemento específico passado entre parênteses está presente na lista ou nao. ',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'quote',
    content:
      'Esse método retorna um valor logico, ou seja, caso um item esteja incluido ele irá retornar *verdadeiro*, caso contrário retornará *falso*.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'É por esse motivo que nesse caso o resultado deu *verdadeiro*, pois de fato temos um aquecedor.',
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
      'Obiviamente deu *falso*, pois já te contei que não temos armas há 4 planetas atrás.',
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
    content: 'De fato, esquecemos coisas que ainda não tiramos do nossa lista compras.',
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
      'Para adicionar esses itens na lista equipamentos, podemos fazer de várias formas.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'A mais simples é usando um método que junte esses listas em um única lista, ou seja, que concatene eles.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'user',
    content: 'Então existe o método *concatenar()*?',
  },
  {
    type: 'default',
    content: 'Isso! Você já deve ter percebido que temos métodos para quase tudo.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'quote',
    title: 'Método concatenar()',
    content:
      'O método *concatenar()* uni listas diferentes em uma lista, só que ele não altera nenhum das listas originais. Então o resultado dessa união é um nova lista.',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'code',
    content: `var compras = [
  "kit de primeiro socorros", 
  "radar", 
  "bateria",
]

var equipamentos = [
  "mochila",
  "lanterna",
  "aquecedor",
  "sinalizador"
]

var meusItens = equipamentos.concatenar(equipamentos)

escreva(meusItens)

// Resultado: 
// ['mochila', 'lanterna', 'aquecedor', 'sinalizador', 'mochila', 'lanterna', 'aquecedor', 'sinalizador']`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Veja que as listas *equipamentos* e *compras* ainda existem, mas não precisamos mais delas, todos os elementos presentes nos dois estão também na variável *meusItens*.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'alert',
    content:
      'Essa é uma boa técnica para adicionar vários elementos de uma vez em uma lista, só que a única desvantagem seria ter que criar uma nova variável caso quiséssemos manipular essa nova lista.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [1, 2, 3]

var novosNumeros = numeros.concatenar([4, 5, 6])

escreva(novosNumeros)

// Resultado: [1, 2, 3, 4, 5, 6]`,
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
    content: 'Não passeremos fome. Eu coloquei os alimentos em uma lista separadamente.',
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

var quantidadeParaCadaAlimento = [2, 7, 3, 4]

escreva(alimentos)
escreva(quantidadeParaCadaAlimento)

// Resultado: 
// ['garrafa d'água', 'barra de cereal', 'carne enlatada', 'fruta']
// [2, 7, 3, 4]`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Para que serve a variável *quantidadeParaCadaAlimento*?',
  },
  {
    type: 'default',
    content:
      'São as quantidades para cada item da lista *alimentos*, apenas para fins de organização e registro.',
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
    content: 'E como fazer isso? Claro, usando um método chamado *ordenar()*.',
    picture: 'panda-amando-bambu.jpg',
  },
  {
    type: 'quote',
    title: 'Método ordenar()',
    content:
      'O método *ordenar()* é usado para colocar os elementos de uma lista em ordem alfabética caso ele tenha textos, ou numérica, caso tenha números. Esse método já não cria uma nova lista, mas sim modifica a lista original.',
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

var quantidadeParaCadaAlimento = [2, 7, 3, 4]

escreva(alimentos.ordenar())
escreva(quantidadeParaCadaAlimento.ordenar())


// Resultado: 
// ['barra de cereal', 'carne enlatada', 'fruta', 'garrafa d'água']
// [2, 3, 4, 7]
`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'É possível definir a forma de ordenação do *ordenar()*. Por exemplo, e se quiséssemos colocar quantidades em ordem descrecente? Mas isso podemos deixar para outra hora.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'Você percebeu que alguns métodos de lista modificam a lista original, ou seja, se eu executar o método, a variável passará conter a lista modificada.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [3, 1, 2]

numeros.ordenar()

escreva(numeros)

// Resultado: [1, 2, 3]`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Porém alguns métodos retornam também a lista modificada, permitndo você colocá-la em uma outra variável.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [3, 1, 2]

var numerosOrdenados = numeros.ordenar()

escreva(numeros)
escreva(numerosOrdenados)

// Resultado: 
// [1, 2, 3]
// [1, 2, 3]`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Supimpa, Não?',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'default',
    content: 'Agora que temos tudo organizado, podemos partir para a exploração.',
    picture: 'panda-com-mochila.jpg',
  },
]
