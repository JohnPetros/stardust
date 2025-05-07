import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    content:
      'Agora que nós conseguimos visualizar o que temos de alimentos na nave, percebemos que temos poucos alimentos para uma viagem longa.',
    picture: 'panda-abracando-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Para a nossa sorte, estamos perto de um mercadão espacial, que é uma estação gigante onde é possível comprar qualquer tipo de coisa que você pode imaginar.',
    picture: 'panda-amando-bambu.jpg',
  },
  {
    type: 'image',
    content: 'No mercadao espacial.',
    picture: 'mercadao.jpg',
  },
  {
    type: 'default',
    title: '#PatiuMercadao',
    content: 'Agora que estamos no mercadão, podemos colocar os itens no carrinho.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'default',
    content:
      'E é claro que nosso carrinho se trata de uma lista, então vejamos o que temos por enquanto:',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'code',
    content: `var carrinho = []

escreva(carrinho)

// Resultado: Sem resultado`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Absolutamente nada, ou seja, temos uma lista completamente vazio.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content:
      'Anteriormente você aprendeu como adicionar um item em uma lista usando os números de índice.',
    picture: 'panda.jpg',
  },
  {
    type: 'user',
    content: 'Sim!',
  },
  {
    type: 'default',
    content:
      'Como prometido vou explicar outra maneira para adicionar itens, que é bem mais fácil na minha opinião.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content: 'Usaremos o método *adicionar()*.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'user',
    content: 'Método?',
  },
  {
    type: 'default',
    content:
      'Sim! Métodos são funções que servem para manipular listas, o que inclui adicionar ou remover elementos, classificar os itens em ordem crescente ou decrescente, pesquisar um elemento específico e muito mais!',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'user',
    content: 'Não sei se entendi direito.',
  },
  {
    type: 'quote',
    content:
      'Métodos, em programação, são ações que um objeto pode executar. Pense em um objeto do mundo real, como um carro. Um carro tem métodos, como "ligar", "acelerar" e "frear". Esses métodos permitem que o carro execute ações específicas.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'Da mesma forma, em programação, um objeto (no nosso caso uma lista) também tem métodos que podem ser executados para realizar tarefas específicas.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'quote',
    title: 'Método adicionar()',
    content:
      'Um desses métodos é o *adicionar()*, que permite, obviamente, adicionar um novo elemento a uma lista.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'default',
    content:
      'Para usá-lo, basta colocar o novo item entre os parâmetese do método, e para executá-lo, basta colocá-lo ao lado da lista separando por um ponto *.*.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content: 'Assim ó:',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var carrinho = []

carrinho.adicionar('castanhas do planeta Parávion')

escreva(carrinho)

// Resultado: castanhas do planeta Parávion`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'É sempre por meio do ponto *.* que você poderá usar os métodos, e alguns podem exigir que você passe alguns valores entre os seus parênteses.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'alert',
    content:
      'Como tinha dito, métodos são funções, e veremos mais sobre eles futuramente, não se preocupe :).',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'default',
    content:
      'Porém, é claro que algumas castanhas não serão suficiente para uma viagem longa, então vamos adicionar mais alguns itens.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var carrinho = []

carrinho.adicionar('castanhas do planeta Parávion')
carrinho.adicionar('carregador solar')
carrinho.adicionar('gorro')
carrinho.adicionar('barras de cereais')
carrinho.adicionar('canivete suíço')
carrinho.adicionar('lanterna')
carrinho.adicionar('casacos')
carrinho.adicionar('cobertores')
carrinho.adicionar('luvas')
carrinho.adicionar('botas')
carrinho.adicionar('cordas')
carrinho.adicionar('aquecedor')

escreva(carrinho)`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Tudo isso meu?',
  },
  {
    type: 'default',
    content:
      'Sim, tudo isso. O que acontece é que o próximo planeta é puramente glacial, então é bom você estar bem preparado.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content:
      'Podemos ver quantos itens já temos no carrinho, utilizando outro método de lista: *tamanho()*.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'quote',
    title: 'Método tamanho()',
    content:
      'O método *tamanho()* literalmente retorna o tamanho de uma lista, isto é, o número de itens que há atualmente nele.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var carrinho = []

carrinho.adicionar('castanhas do planeta Parávion')
carrinho.adicionar('carregador solar')
carrinho.adicionar('gorro')
carrinho.adicionar('barras de cereais')
carrinho.adicionar('canivete suíço')
carrinho.adicionar('lanterna')
carrinho.adicionar('casacos')
carrinho.adicionar('cobertores')
carrinho.adicionar('luvas')
carrinho.adicionar('botas')
carrinho.adicionar('cordas')
carrinho.adicionar('aquecedor')

var quantideDeItens = carrinho.tamanho()

escreva(quantideDeItens)
// Resultado: 12`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Como esperado, o carrinho atualmente tem 12 itens. Ao passar no caixa teremos que remover cada um.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content:
      'Para isso, é claro que utilizaremos um método para facilitar esse trabalho, no caso utilizaremos o método *remover()*.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    title: 'Método remover()',
    content:
      'Para remover um determinado item de uma lista, você terá que colocar o valor desse item entre os parênteses do *remover()*, veja o exemplo.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var carrinho = []

carrinho.adicionar('castanhas do planeta Parávion')
carrinho.adicionar('carregador solar')
carrinho.adicionar('gorro')
carrinho.adicionar('barras de cereais')
carrinho.adicionar('canivete suíço')
carrinho.adicionar('lanterna')
carrinho.adicionar('casacos')
carrinho.adicionar('cobertores')
carrinho.adicionar('luvas')
carrinho.adicionar('botas')
carrinho.adicionar('cordas')
carrinho.adicionar('aquecedor')

carrinho.remover('lanterna')
carrinho.remover('casacos')
carrinho.remover('cobertores')
carrinho.remover('luvas')

var quantideDeItens = carrinho.tamanho()

escreva(quantideDeItens)
// Resultado: 8`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Dica: existem outros métodos para remover um iten de uma lista, como o *removerPrimeiro()*, que como o nome implica, ele remove sempre o primeiro elemento de uma lista.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [1, 2, 3, 4];
    
numeros.removerPrimeiro()
escreva(numeros)

// Resultado: 2, 3, 4`,
    isRunnable: true,
  },
  {
    type: 'code',
    content: `var carrinho = [];
    
carrinho.adicionar('castanhas do planeta Parávion')
carrinho.adicionar('carregador solar')
carrinho.adicionar('gorro')
carrinho.adicionar('barras de cereais')
carrinho.adicionar('canivete suíço')
carrinho.adicionar('lanterna')
carrinho.adicionar('casacos')
carrinho.adicionar('cobertores')
carrinho.adicionar('luvas')
carrinho.adicionar('botas')
carrinho.adicionar('cordas')
carrinho.adicionar('aquecedor')

carrinho.remover('lanterna')
carrinho.remover('casacos')
carrinho.remover('cobertores')
carrinho.remover('luvas')

carrinho.removerPrimeiro()

var quantideDeItens = carrinho.tamanho()

escreva(quantideDeItens)

// Resultado: 7`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Você pode me perguntar: se existe *removerPrimeiro()*, então existe *removerUltimo()*. De fato, você está certo, e esse método sempre remove o último item de qualquer lista.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [1, 2, 3, 4]
    
numeros.removerUltimo()
escreva(numeros)

// Resultado: 1, 2, 3`,
    isRunnable: true,
  },
  {
    type: 'code',
    content: `var carrinho = [];
    
carrinho.adicionar('castanhas do planeta Parávion')
carrinho.adicionar('carregador solar')
carrinho.adicionar('gorro')
carrinho.adicionar('barras de cereais')
carrinho.adicionar('canivete suíço')
carrinho.adicionar('lanterna')
carrinho.adicionar('casacos')
carrinho.adicionar('cobertores')
carrinho.adicionar('luvas')
carrinho.adicionar('botas')
carrinho.adicionar('cordas')
carrinho.adicionar('aquecedor')

carrinho.remover('lanterna')
carrinho.remover('casacos')
carrinho.remover('cobertores')
carrinho.remover('luvas')

carrinho.removerPrimeiro()
carrinho.removerUltimo()

var quantideDeItens = carrinho.tamanho()

escreva(quantideDeItens)

// Resultado: 6`,
    isRunnable: true,
  },
  {
    type: 'user',
    content:
      'Será que não dá para usar laço para agilizar o trabalho de remover todos esses itens?',
  },
  {
    type: 'default',
    content:
      'Finalmente você percebeu. Sim, na maioria das vezes usamos laços para trabalhar com listas.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, para remover todos os itens de uma vez podemos usar o *removerUltimo()* e o tamanho da lista dentro de um laço enquanto, veja:',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, para remover todos os itens de uma vez podemos usar o *removerUltimo()* e o tamanho da lista dentro de um laço enquanto, veja:',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var carrinho = []

carrinho.adicionar('castanhas do planeta Parávion')
carrinho.adicionar('carregador solar')
carrinho.adicionar('gorro')
carrinho.adicionar('barras de cereais')
carrinho.adicionar('canivete suíço')
carrinho.adicionar('lanterna')
carrinho.adicionar('casacos')
carrinho.adicionar('cobertores')
carrinho.adicionar('luvas')
carrinho.adicionar('botas')
carrinho.adicionar('cordas')
carrinho.adicionar('aquecedor')

enquanto (carrinho.tamanho() > 0) {
  carrinho.removerUltimo()
}
  
var quantideDeItens = carrinho.tamanho()

escreva(quantideDeItens)
// Resultado: 0`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Neste exemplo, enquanto o tamanho da lista for maior que 0, continuaremos removendo o último item dele.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content:
      'Agora que já terminamos as compras, boa sorte tentando levar tudo isso ao foguete 😜.',
    picture: 'panda-rindo-deitado.jpg',
  },
]
