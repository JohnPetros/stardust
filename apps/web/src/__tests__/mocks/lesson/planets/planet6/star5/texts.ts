import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    content: 'Até agora tudo ok, mas ainda temos um problema.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content:
      'Eu disse que o método `fatiar()` não altera a lista original, mas sim gera um novo.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'user',
    content: 'E agora?',
  },
  {
    type: 'default',
    content:
      'A nossa sorte que é existe um método que pode fazer a mesma coisa que o `fatiar()` faz, mas alterando a lista original.',
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    type: 'default',
    content: 'O método `encaixar()`.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'quote',
    title: 'Método encaixar()',
    content:
      'O método `encaixar()` pode ser utilizado para vários objetivos, mas o principal é remover elementos de uma lista.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'list',
    content:
      'Nos parênteses do `encaixar()` é necessário colocar 2 números obrigatórios:',
    picture: 'panda-de-oculos.jpg',
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

itens.encaixar(0, 3)

escreva(itens)
escreva(itens.tamanho())`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Percebeu? A lista `itens` foi modificado, restando apenas 5 itens.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'user',
    content: 'Mas e quanto aos alimentos?',
  },
  {
    type: 'default',
    content:
      'É que método `encaixar()` retorna os elementos removidos por ele. Então, para pegar os alimentos removidos pelo `encaixar()` será preciso criar uma nova varíavel.',
    picture: 'panda-olhando-de-lado.jpg',
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

// encaixar(0, 3) = Começar a partir da posição 0 e remove 3 elementos
var alimentos = itens.encaixar(0, 3)
escreva(alimentos)

// Resultado: ['fruta', 'ovo de Icelope', 'amêndua']`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Agora sim! Conseguimos remover os alimentos da lista principal e colocamos em uma lista separada.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'default',
    content: 'Agora vamos fazer com os demais itens.',
    picture: 'panda-dando-risadinha.jpg',
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

var alimentos = itens.encaixar(0, 3)
var minerais = itens.encaixar(3, 5)
var ferramentas = itens.encaixar(5, 6)
var exoticos = itens.encaixar(6)

escreva(alimentos)
escreva(minerais)
escreva(ferramentas)
escreva(exoticos)

// Aperte em executar para ver o resultado catastrófico`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Pera aí, mas agora deu tudo errado!',
  },
  {
    type: 'default',
    content:
      'Sim. Acontece que toda vez que o `encaixar()` é executado, os itens são removidos da lista original, correto? Então na próxima execução, a lista `itens` terá menos elementos do que o esperado.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content:
      'Isso é para mostrar que o `encaixar()` não fuciona da mesma maneira que o `fatiar()`.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'alert',
    content:
      'Lembre-se: A diferença entre os dois é que o segundo número do `encaixar()` indica a QUANTIDADE de elementos que serão removidos, enquanto o do `fatiar()` indica o ponto de parada da fatia. E apenas o `encaixar()` consegue alterar a lista original.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'default',
    content:
      'Agora vamos fazer do jeito certo. Nesse caso, basta começarmos sempre da posição zero, já que estamos sempre removendo os primeiros itens da lista `itens`.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
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

var alimentos = itens.encaixar(0, 3)
var minerais = itens.encaixar(0, 2)
var ferramentas = itens.encaixar(0, 1)
var exoticos = itens.encaixar(0)

escreva(alimentos)
escreva(minerais)
escreva(ferramentas)
escreva(exoticos)
escreva(itens)`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Agora sim!',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'default',
    content:
      'Veja que no último foi colocado apenas um número. Isso quer dizer que se você passar apenas um número no `encaixar()` ele vai remover todo os itens da lista a partir desse número índice.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'default',
    content:
      'Veja também que agora a lista `itens` está vazia, então nos livramos completamente dele.',
    picture: 'panda-sentado-com-mochila.jpg',
  },
  {
    type: 'image',
    content: 'Agora sim podemos continuar nossa exploração.',
    picture: 'panda-acenando-com-mochila.jpg',
  },
  {
    type: 'image',
    content: 'Algum tempo de exploração depois...',
    picture: 'relogio-e-mochila.jpg',
  },
  {
    type: 'image',
    content:
      'Já estamos andando faz algum tempo, mas ainda não encontramos mais nada interessante.',
    picture: 'panda-com-mapa.jpg',
  },
  {
    type: 'default',
    content: 'Pera aí! Acabamos de receber uma mensagem no nosso radar:',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = ["Saia", 1, "planeta", 0, 2]
var textos = ["é", "daí", "perigoso"]`,
    isRunnable: false,
  },
  {
    type: 'default',
    content:
      'Parece que compramos um radar bem vagabundo. A messagem veio toda em pedaços.',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'default',
    content: 'Para nossa sorte acabamos de conhecer o método `encaixar()`.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'user',
    content: 'E daí?',
  },
  {
    type: 'default',
    content:
      'Lembra que eu disse que o `encaixar()` é usada para várias finalidades? Você deve ter se perguntado, por que "encaixar" tem esse nome? É porque com ele podemos remontar qualquer lista, removendo ou adicionando itens.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'default',
    content:
      'O que eu quero dizer é que podemos adicionar itens usando `encaixar()`. Para isso, deve-se passar um terceiro valor, mas não um número e sim o item que você quer adicionar.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'default',
    content:
      'É possível ver que na lista `mensagem`, há números indicando onde os itens da lista `textos` devem ser colocados para completar a mensagem.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'default',
    content:
      'Então faremos isso: primeiro encaixaremos a palavra `daí` onde está o índice 1',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = ["Saia", 1, "planeta", 3]
var textos = ["perigoso", "daí"]

// A partir do índice 1 da lista mensagem removeremos um elemento e adicionaremos o texto "daí"
mensagem.encaixar(1, 1, "daí")

escreva(mensagem)
// Resultado: ['Saia', 'daí', 'planeta', 3]`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Se o número do meio fosse zero, nenhum elemento seria removido, ou seja, o resultado seria: `["Saia", 1, "daí", "planeta", 3]`.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'alert',
    content:
      'Mas ao colocar 1, o método `encaixar()` se torna uma boa maneira também de substituir um valor de uma lista por outro.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'default',
    content: 'Agora colocaremos a outra palavra.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = ["Saia", "daí", "planeta", 3]
    
var textos = ["perigoso", "daí"]
    
// A partir do índice 3 remover um elemento e colocar o texto "perigoso  
mensagem.encaixar(3, 1, "perigoso")
    
escreva(mensagem)
// Resultado: ['Saia', 'daí', 'planeta', 'perigoso']`,
    isRunnable: false,
  },
  {
    type: 'default',
    content: 'Agora temos um resultado: "Saia, daí, planeta, perigoso"',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content:
      'Ok... Então esse planeta deve ser mais perigoso do que eu pensava. Mas agora eu me pergunto:',
    picture: 'panda-pensando.jpg',
  },
  {
    type: 'default',
    content: 'Quem será que mandou essa mensagem?',
    picture: 'panda-espantado.jpg',
  },
]
