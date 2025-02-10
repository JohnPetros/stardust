import type { TextBlockDto } from '@stardust/core/global/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    content:
      'Agora só falta inserir as coordenadas numéricas da nossa localização na mensagem.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'default',
    content: 'Temos uma lista com várias coordenadas diferentes:',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'code',
    content: `var coordenadas = [
  "x:12;y:6", 
  "x:70;y:32", 
  "x:25;y:18", 
  "x:8;y:40", 
]
escreva(coordenadas)`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'O nosso trabalho é achar a coordenada correta dentro desse lista, que no caso é "x:25;y:18", e colocá-la na mensagem para enviar ao foguete.',
    picture: 'panda-pensando.jpg',
  },
  {
    type: 'default',
    content: 'Para isso, podemos usar o poder dos laços.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'default',
    content:
      'Eu disse antes que a forma mais comum para trabalhar com listas é usando laços, então vamos aprender mais sobre isso.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'default',
    content: 'Para fazer a primeira tarefa, vamos começar por partes.',
    picture: 'panda-sorrindo-sentado.jpg',
  },
  {
    type: 'default',
    content:
      'Primeiramente, montamos um *para*, com a variável de controle (i) iniciando com 0, já que os índices de lista começam do zero e não do um.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'code',
    content: `para (var i = 0;) {

}`,
    isRunnable: false,
  },
  {
    type: 'default',
    content:
      'Depois colocamos a condição do laço como *i* menor que o tamanho da lista *coordenadas*, ou seja, indicamos ao *para* que execute algo até que a variável *i* seja igual ou maior que a quantidade de *coordenadas*.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'code',
    content: `para (var i = 0; i < coordenadas.tamanho();) {

}`,
    isRunnable: false,
  },
  {
    type: 'default',
    content: 'Por fim, incrementamos a variável *i* a cada nova iteração.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'code',
    content: `para (var i = 0; i < coordenadas.tamanho(); i++) {

}`,
    isRunnable: false,
  },
  {
    type: 'default',
    content:
      'Agora no bloco do `para` colocamos a variável `i` como índice da lista `coordenadas`.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'code',
    content: `var coordenadas = [
  "x:12;y:6", 
  "x:70;y:32", 
  "x:25;y:18", 
  "x:8;y:40", 
]

para (var i = 0; i < coordenadas.tamanho(); i++) {
  coordenadas[i]
}`,
    isRunnable: false,
  },
  {
    type: 'default',
    content: 'Se escrevermos *coordenadas[i]* em cada iteração:',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'code',
    content: `var coordenadas = [
  "x:12;y:6", 
  "x:70;y:32", 
  "x:25;y:18", 
  "x:8;y:40", 
]

para (var i = 0; i < coordenadas.tamanho(); i++) {
  escreva(coordenadas[i])
}

// Resultado:  
// x:12;y:6, 
// x:70;y:32, 
// x:25;y:18, 
// x:8;y:40`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Percebeu a mágica? A cada iteração o *i* é um número diferente. Dessa forma podemos pegar cada valor da lista usando essa variável como índice.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'default',
    content: 'Agora podemos verificar se o valor atual da lista é igual ao que buscamos.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var coordenadas = [
  "x:12;y:6", 
  "x:70;y:32", 
  "x:25;y:18", 
  "x:8;y:40", 
]

para (var i = 0; i < coordenadas.tamanho(); i++) {
  se (coordenadas[i] == "x:25;y:18") {
    escreva("Achei a coordenada certa: " + coordenadas[i])
  }
}
// Resultado: Achei a coordenada certa: x:25;y:18`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Aí sim! Agora, só colocar a coordenada certa em uma variável a parte e concatenar com a mensagem:',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'code',
    content: `var coordenadas = [
  "x:12;y:6", 
  "x:70;y:32", 
  "x:25;y:18", 
  "x:8;y:40", 
]

var coordenadaCerta = ""
para (var i = 0; i < coordenadas.tamanho(); i++) {
  se (coordenadas[i] == "x:25;y:18") {
    coordenadaCerta = coordenadas[i]
  }
}

var mensagem = "Essas são minhas coordenadas: \${coordenadaCerta}"
escreva(mensagem)
// Resultado: Essas são minhas coordenadas: x:25;y:18`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'A variável *coordenadaCerta* foi colocada para fora do laço porque senão ela seria reiniciada toda vez a cada iteração do laço.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'alert',
    content:
      'E também porque ela não poderia ser acessada de fora do *para* ou do *se*, pois uma vez sendo criada dentro de uma dessas estruturas, essa variável teria escopo local e não global, lembra?',
    picture: 'panda-sorrindo-sentado.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, e se quiséssemos adicionar todos os alimentos que adiquirimos na exploração na nossa mochila?',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["fruta", "ovo de Icelope", "amêndua"]

var mochila = []`,
    isRunnable: false,
  },
  {
    type: 'default',
    content: 'Será um trabalho bem mais fácil usando laço.',
    picture: 'panda-sentado-com-mochila.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["fruta", "ovo de Icelope", "amêndua"]

var mochila = []
para (var i = 0; i < alimentos.tamanho(); i++) {
  var alimentoAtual = alimentos[i]
  mochila.adicionar(alimentoAtual)
}

escreva(mochila)
// Resultado: ['fruta', 'ovo de Icelope', 'amêndua']`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Além disso, podemos não usar apenas o *para*, mas qualquer outro tipo de laço que já vimos, como o *enquanto*.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var minerais = ["cristal", "pirita"]
var i = 0
var mochila = []

enquanto (i < minerais.tamanho()) {
  var mineralAtual = minerais[i]
  mochila.adicionar(mineralAtual)
  i++
}
escreva(mochila);
// Resultado: ['cristal', 'pirita']`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'E o *fazer-enquanto*.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var exoticos = ["fóssil de urso anão", "meteorito congelado"]
var mochila = []
var i = 0

fazer {
  var exoticoAtual = exoticos[i]
  mochila.adicionar(exoticoAtual)
  i++
} enquanto (i < exoticos.tamanho())

escreva(mochila)
// Resultado: ['fóssil de urso anão', 'meteorito congelado']`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Agora só resta colocar o lista que conterá as quantidades de cada item.',
    picture: 'panda-sorrindo-sentado.jpg',
  },
  {
    type: 'code',
    content: `var mochila = [
  "fruta",
  "ovo de Icelope", 
  "amêndua",
  "cristal", 
  "pirita", 
  "bastão laser quebrado", 
  "fóssil de urso anão",
  "meteorito congelado"
]

var quantidadeDeItens = [9, 4, 20, 37, 12, 1, 2, 1]
mochila.adicionar(quantidadeDeItens)
escreva(mochila)`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Mas aí não estaríamos colocando uma lista dentro de outra lista?',
  },
  {
    type: 'default',
    content:
      'Sim! é possível colocar listas dentro de uma lista sem problema algum. Na verdade é possível colocar qualquer tipo de dado dentro uma lista, seja do tipo `texto`, `número` ou `lógico`.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content: 'Espera, tem algo vindo em nossa direção!',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'image',
    content: 'arghhh!!',
    picture: 'icelope.jpg',
  },
  {
    type: 'user',
    content: 'É um dinossauro roxo?',
  },
  {
    type: 'default',
    content: 'Aquilo é um pássaro Icelope!!',
    picture: 'panda-espantado.jpg',
  },
  {
    type: 'default',
    content: 'Nós tínhamos pegado 4 quatro ovos de Icelope durante a exploração, lembra?',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'default',
    content: 'Provavelmente essa seja a mãe deles.',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'image',
    content: 'Rápido, pegue aqueles ovos de volta da mochila.',
    picture: 'ovo-roxo.jpg',
  },
  {
    type: 'code',
    content: `var mochila = [
  "fruta",
  "ovo de Icelope", 
  "amêndua",
  "cristal", 
  "pirita", 
  "bastão laser quebrado", 
  "fóssil de urso anão",
  "meteorito congelado",
  [9, 4, 20, 37, 12, 1, 2, 1]
]

para cada item em mochila {
  se (item == "ovo de Icelope") {
    escreva(item)
  }
}

// Resultado: ovo de Icelope`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Mas que espécie de *para* é esse?',
  },
  {
    type: 'default',
    content: 'Apresento-lhe o *para-cada*',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'quote',
    title: 'Para cada',
    content:
      'O laço *para-cada* faz a mesma coisa que um simples *para* só que com um código mais bonito.',
    picture: 'panda-sorrindo-sentado.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [1, 2, 3, 4]

para cada numero em numeros {
  escreva(numero)
}

// Resultado: 
// 1
// 2
// 3
// 4`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Neste exemplo, `numeros` é a lista que está sendo usado no laço, e `numero` é a variável que assume um valor da lista `numeros` a cada iteração do laço.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'alert',
    content:
      'E detalhe, a variável que vai ao lado de `para cada` não precisa ser declarada antes e você pode dar o nome que você quiser a ela.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'alert',
    content: 'Veja mais alguns exemplos de `para-cada` para entender bem.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var valores = [falso, verdadeiro, falso]
  
para cada valor em valores {
  escreva(valor)
}

// Resultado: 
// falso
// verdadeiro
// falso
`,
    isRunnable: true,
  },
  {
    type: 'code',
    content: `var nomes = ['Petros', 'Kaue Cabessa', '0Thigs', 'Gui', 'Lipe', 'Suga']

para cada nome em nomes {
  escreva(nome)
}

// Resultado: 
// Petros
// Kaue Cabessa
// 0Thigs
// Gui
// Lipe
// Suga
  `,
    isRunnable: true,
  },
  {
    type: 'alert',
    content: 'Mas, voltando para o urgente: temos que devolver os ovos para a mãe deles.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'code',
    content: `var mochila = [
  "fruta",
  "ovo de Icelope", 
  "amêndua",
  "cristal", 
  "pirita", 
  "bastão laser quebrado", 
  "fóssil de urso anão",
  "meteorito congelado",
  [9, 4, 20, 37, 12, 1, 2, 1]
]

var ovos = []
para cada item em mochila {
  se (item == "ovo de Icelope") {
    var quantidadeDeOvos = mochila[-1][1]

    escreva('Quantidade de ovos: ' + quantidadeDeOvos)
  }
}
// Resultado: Quantidade de ovos: 4`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Espera, uma lista com dois índices?',
  },
  {
    type: 'default',
    content: 'Sim, escrever `mochila[-1][1]` quer dizer:',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'quote',
    content: '`[-1]` -> Pegar o último item de mochila, que no caso é uma lista.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'quote',
    content: '`[1]` -> Pegar o segundo valor desse lista interna, que no caso é quatro.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'alert',
    content: 'Agora que temos o número 4, multiplicamos com o item "ovo de Icelope"',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var mochila = [
  "fruta",
  "ovo de Icelope", 
  "amêndua",
  "cristal", 
  "pirita", 
  "bastão laser quebrado", 
  "fóssil de urso anão",
  "meteorito congelado",
  [9, 4, 20, 37, 12, 1, 2, 1]
]

var ovos = []
para cada item em mochila {
  se (item == "ovo de Icelope") {
    var quantidadeDeOvos = mochila[-1][1];
    para (var i = 0; i < quantidadeDeOvos; i++) {
      ovos.adicionar(item);
    }
  }
}

escreva(ovos)
// Resultado: ovo de Icelope, ovo de Icelope, ovo de Icelope, ovo de Icelope`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Não disse que é possível usar laço dentro de laço? Agora sim estamos começando a escrever códigos mais complexos.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'image',
    content: 'Agora a mãe icelope está feliz com seus ovos.',
    picture: 'icelope.jpg',
  },
  {
    type: 'default',
    content:
      'Agora que a mãe icelope está com seus ovos, resta apenas esperar o foguete chegar 😋.',
    picture: 'panda-rindo-deitado.jpg',
  },
]
