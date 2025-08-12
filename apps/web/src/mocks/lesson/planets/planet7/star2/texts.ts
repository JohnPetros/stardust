import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    content:
      'Agora que temos as coordenadas certas, podemos saber para qual planeta temos que ir.',
    picture: 'panda-oferecendo-bambu.jpg',
  },
  {
    type: 'default',
    content: 'Porém, antes, precisamos reabastecer nosso foguete né?',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content: 'Por sorte temos um posto espacial aqui perto.',
    picture: 'panda-sorrindo-sentado.jpg',
  },
  {
    type: 'default',
    content:
      'No posto, ele disponibilizam uma função para calcular o preço do combustível com base em quantos litros queremos.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `funcao calculePreco(litros) {
  var preco = 2
  var precoTotal = litros * preco
  retorna precoTotal
}`,
    isRunnable: false,
    picture: 'panda.jpg',
  },
  {
    type: 'user',
    content: 'O que é esse retorna?',
  },
  {
    type: 'default',
    content:
      'Você se lembra que eu falava que ao executar um método de lista é retornado determinado valor?',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'default',
    content:
      'Isso porque métodos também são funções. E agora que você aprendeu a criar suas próprias funções, você precisa saber usar a palavra-chave *retorna*.',
    picture: 'panda.jpg',
  },
  {
    type: 'quote',
    title: 'Retorna',
    content:
      'O *retorna* é um comando usada em funções para retornar um determinado valor.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content: 'E esse valor retornado pode ser usado fora da função.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'user',
    content: 'Como?',
  },
  {
    type: 'code',
    content: `funcao calculePreco(litros) {
  var preco = 2
  var precoTotal = preco * litros
  retorna precoTotal
}

var preco = calculePreco(24)
escreva(preco)

// Resultado: 48
`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Viu só? O valor de *precoTotal* foi retornado pela função, e esse valor retornado foi colocado na variável *preco*.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'alert',
    content:
      'ATENÇÃO: No código, há duas variáveis *preco*, porém elas não são iguais, porque possuem escopo diferente.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'Contudo, podemos melhorar a escrita dessa função. Está vendo que a variável *precoTotal* é igual a multiplicação de *preco* e *litros*?',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content:
      'Podemos retornar diretamente essa multiplicação sem a necessidade de colocar o resultado final em uma variável.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'code',
    content: `funcao calculePreco(litros) {
  var preco = 2
  retorna preco * litros
}

escreva(calculePreco(24))
// Resultado: 48
`,
    isRunnable: true,
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Parece mágica, mas não é. Além disso, é possível retornar qualquer valor que é resultado de uma expressão, seja um cálculo ou uma comparação, como no código abaixo.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'code',
    content: `funcao confiraMaiorNumero(numero1, numero2) {
  retorna numero1 > numero2
}

var resultado = confiraMaiorNumero(2, 8)
escreva(resultado)
// Resultado: falso
`,
    isRunnable: true,
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Porém, voltando... O preço desse combustível está bem salgado, mas é o que temos para hoje, né?',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'image',
    content: 'Com o combustível comprado, temos que colocá-lo no tanque.',
    picture: 'tanque-de-combustivel.jpg',
  },
  {
    type: 'default',
    content:
      'Na verdade eu criei uma função que faz isso para gente. Basta colocar o novo combustível e ele retorna quantos litros tem agora.',
    picture: 'panda-com-bola-de-boliche.jpg',
  },
  {
    type: 'code',
    content: `var reabastecer = funcao (litros) {
  // Reabastecendo
  var totalLitros = 4 + litros
  escreva("Agora há \${totalLitros} litros.")
}

reabastecer(48)
// Resultado: Agora há 52 litros`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Mas que espécie de função é essa?',
  },
  {
    type: 'default',
    content: 'Isso se trata de uma *função anônima*.',
    picture: 'panda-amando-bambu.jpg',
  },
  {
    type: 'quote',
    title: 'Função anônima',
    content:
      '*funções anônimas* são o que o nome indica, funções que não tem um nome, simplesmente isso.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'quote',
    content:
      'Geralmente elas são usadas para serem colocadas em varíaveis. Elas não tem diferença com funções com nomes, e podem ser usadas como uma função qualquer, ou seja, elas também podem usar parâmetros e retornar valores.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var reabastecer = funcao (litros) {
  // Reabastecendo
  var totalLitros = 4 + litros
  escreva("Agora há \${totalLitros} litros.")
  retorna litros
}

escreva(reabastecer(48))
// Resultado: 
// Agora há 52 litros
// 48`,
    isRunnable: true,
    picture: 'panda.jpg',
  },
  {
    type: 'alert',
    content:
      'Caso a `função anônima` seja associada a uma variável, para chamar essa função, deverá ser usado o nome dessa variável.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var calculeArea = funcao(base, altura) {
  retorna base * altura
}

escreva(calculeArea(2, 5))
// Resultado: 10`,
    isRunnable: true,
    picture: 'panda.jpg',
  },
  {
    type: 'user',
    content: 'Então, porque usar funções anônimas, já que não há diferença?',
  },
  {
    type: 'default',
    content:
      'Embora também seja possível com funções nomeadas, as funções anônimas permitem que elas sejam usadas como parâmetros em outras funções.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'Sim, usar função dentro de uma outra função. Mas, isso é assunto para outra hora.',
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    type: 'default',
    content: 'Agora com o tanque cheio, falta localizar o planeta pelas coordenadas.',
    picture: 'panda-com-mochila.jpg',
  },
  {
    type: 'image',
    content:
      'Nas redondezas, há apenas 3 planetas diferentes, podemos achar o correto por meio de uma função.',
    picture: 'apollo-envolto-de-planetas.jpg',
  },
  {
    type: 'code',
    content: `funcao achePlaneta(coordenadas) {
  se (coordenadas == "x:20;y:10") {
      retorna "Planeta Xalax"
  } senao se (coordenadas == "x:42;y:84") {
      retorna "Planeta Haskell"
  } senao {
      retorna "Planeta Kyron"
  }
}

escreva('O \${achePlaneta("x:42;y:84")} é para onde temos que ir!')
// Resultado "O Planeta Haskell é para onde temos que ir!"`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Nessa função, colocamos três *retorna* diferentes, o que também é totalmente possível.',
    picture: 'panda-sorrindo-sentado.jpg',
  },
  {
    type: 'alert',
    content:
      'Quando um *retorna* é executado, a função para de executar o resto do código dentro dela.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `funcao mostreAlgo() {
  retorna
  escreva("Escrevendo algo.")
}

mostreAlgo()
// Resultado: Sem saída`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Veja que também é possível uma função não retornar nada. Isso pode ser útil em uma estrutura condicional, por exemplo.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `funcao verifiqueIdade(idade) {
  se (idade > 18) {
      escreva("Pode pilotar um foguete")
      retorna
  } 

  // Não será executado de jeito nenhum
  escreva("Não pode pilotar um foguete")
}

verifiqueIdade(999)
// Resultado Pode pilotar um foguete`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Além disso, uma função que não retorna nada está, na verdade, retornando valor `nulo`.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `funcao retorneAlgo() {
  retorna
}

escreva(retorneAlgo(retorneAlgo()))

// Resultado: nulo`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Voltando ao nosso código.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `funcao achePlaneta(coordenadas) {
  se (coordenadas == "x:20;y:10") {
      retorna "Planeta Xalax"
  } senao se (coordenadas == "x:42;y:84") {
      retorna "Planeta Haskell"
  } senao {
      retorna "Planeta Kyron"
  }
}

escreva('O \${achePlaneta("x:42;y:84")} é para onde temos que ir!')
// Resultado "O Planeta Haskell é para onde temos que ir!"`,
    isRunnable: true,
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Viu que usei a função `achePlaneta` como se fosse uma variável? Esse é mais um poder do *retorna*.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'default',
    content:
      'já que a função está tendo um valor, você não precisa necessariamente colocar esse valor em uma variável para usá-lo.',
    picture: 'panda-oferecendo-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'A mesma coisa que fazíamos com os métodos de lista, lembra? Às vezes colocávamos o valor retornado do método em uma variável ou usávamos-o diretamente.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var letras = ['a', 'b', 'c']
var numeros = [1, 2, 3]
      
var quantidadeDeLetras = letras.tamanho()

escreva(quantidadeDeLetras)
escreva(numeros.tamanho())

// Resultado: 
// 3
// 3`,
    isRunnable: true,
    picture: 'panda.jpg',
  },

  {
    type: 'default',
    content: 'Agora tudo está se encaixando!!',
    picture: 'panda-pulando-de-alegria.jpg',
  },
  {
    type: 'default',
    content: 'Ok, Com as coordenadas definidas, chegaremos ao planeta rapidinho!',
    picture: 'panda-sentado-com-mochila.jpg',
  },
]
