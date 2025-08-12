import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    content:
      'Tenho más notícias. De acordo com a análise das amostras, estamos em um planeta com o núcleo bastante instável.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'user',
    content: 'E o que isso quer dizer?',
  },
  {
    type: 'default',
    content:
      'O que acontece é que esse planeta não tem mais vida longa, o que quer dizer que é bom sairmos desse lugar imediatamente!',
    picture: 'panda-com-mochila.jpg',
  },
  {
    type: 'default',
    content:
      'Para começar, podemos logo aumentar a potência dos motores até chegarem ao máximo da sua capacidade limite.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Para fazer isso, podemos criar um programa que, enquanto os motores não chegarem ao seu limte (que é *100*), continuaremos a aumentar sua potência em 10.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Porém, ao começar aumentar a potência, é ligado a vetoinha para evitar superaquecimento, mas apenas depois que a potência é aumentada por pelo menos uma vez.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'E só podemos desligar a ventoinha depois que a potência for igual ao limite.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'default',
    content: 'Então temos uma situação complicada.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'code',
    content: `var potencia = 20
var limite = 100
var ventoinhaEstaLigada = falso

enquanto (ventoinhaEstaLigada) {
  potencia += 10

  se (potencia == limite) {
    ventoinhaEstaLigada = falso
  } senao {
    ventoinhaEstaLigada = verdadeiro
  }
}

escreva(potencia)
// Resultado: 20`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Percebeu que a conta não fecha? ',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'O processo de aumentar a potência só para quando *ventoinhaEstaLigada* for *verdadeiro*, mas o valor dela, que começa em *falso*, só muda a partir do momento em que eu começo aumentar a potência 🤨.',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'default',
    content:
      'Para resolver esse problema podemos usar o terceiro tipo de laço: o *fazer enquanto*.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'quote',
    title: 'Laço Fazer Enquanto',
    content:
      'O *fazer enquanto* é um laço que permite executar um bloco de código pelo menos uma vez e depois repetir a execução desse bloco enquanto uma condição especificada for verdadeira.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'No nosso caso vai cair com uma luva, pois a condição do laço é verificada apenas após seu bloco de código ser executado pelo menos uma vez, permitindo que a condição (*ventoinhaEstaLigada*) seja falsa em um primeiro momento, veja:',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'code',
    content: `var potencia = 20
var limite = 100
var ventoinhaEstaLigada = falso

fazer {
  potencia += 10

  se (potencia == limite) {
    ventoinhaEstaLigada = falso
  } senao {
    ventoinhaEstaLigada = verdadeiro
  }
} enquanto (ventoinhaEstaLigada)

escreva(potencia)
// Resultado: 100`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Então essa é a diferença entre *enquanto* e *fazer enquanto*: o *fazer enquanto* garante que o bloco de código seja executado pelo menos uma vez, mesmo se a condição do laço inicialmente for *falso*, o que pode ser bastante últil em algumas situações como essa foi agora.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content:
      'Em contrapartida, o *enquanto* não executa o bloco de código se a condição especificada for falsa desde o início.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'user',
    content: 'É cada uma meu.',
  },
  {
    type: 'image',
    content: 'Chegando à atmosfera...',
    picture: 'foguete-decolando-perto-de-uma-montanha.jpg',
  },
  {
    type: 'default',
    content:
      'À medida que subimos, estamos aumentando de velocidade e diminuindo a distância até o espaço.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var velocidade = 0
var distanciaAteEspaco = 1500
var comprimentoDaOrbita = 500

enquanto (distanciaAteEspaco > 0) {
  velocidade++
  distanciaAteEspaco--
}`,
    isRunnable: false,
  },
  {
    type: 'default',
    content:
      'Porém, no momento que conseguirmos sairmos da atmosfera, temos que estabilizar a velocidade em um valor fixo para entrar em órbita com o planeta e então acelerar de novo para pegar mais impulso para conseguirmos ir ainda mais longe.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'default',
    content: 'Saberia como resolver isso?',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'user',
    content: 'Usando `se senao`?',
  },
  {
    type: 'default',
    content: 'Pode ser uma boa, mas tem um jeito mais elegante de fazer isso em um laço.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content: 'Usando outra instrução especial chamado de *continua*',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'quote',
    title: 'Continua',
    content:
      'O *continua* é um comando usada dentro de laços, como o *pausa*, só que ele permite pular a interação atual e ir para a próxima imediatamente.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'user',
    content: 'Como assim?',
  },
  {
    type: 'quote',
    content:
      'Quando o *continua* é executado dentro de um laço, o código abaixo desse comando não é executado e a próxima iteração do laço é iniciada.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'Isso pode ser útil em situações em que você deseja que parte de um bloco de código seja ignorada em uma determinada situação.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, no nosso caso queremos que a variável *velocidade* pare de ser incrementada enquanto estivermos em órbita com o planeta, o que ocorre enquanto *distanciaAteEspaco* for menor ou igual 1000 e *comprimentoDaOrbita* for maior que 0',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var velocidade = 50 
var distanciaAteEspaco = 1500
var comprimentoDaOrbita = 500
    
enquanto (distanciaAteEspaco > 0) {
  se (distanciaAteEspaco <= 1000 e comprimentoDaOrbita > 0) {
      comprimentoDaOrbita--
      continua
  }

  velocidade++
  distanciaAteEspaco--
}
    
escreva("distanciaAteEspaco: " + distanciaAteEspaco)
escreva("comprimentoDaOrbita: " + comprimentoDaOrbita)
escreva("velocidade: " + velocidade)


// Resultado: 
// distanciaAteEspaco: 0
// comprimentoDaOrbita: 0
// velocidade: 1550`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Dessa forma, sempre que `distanciaAteEspaco` for menor ou igual que 1000 e `comprimentoDaOrbita` for maior que 0, tudo o que estiver após isso, no caso `velocidade++` e `distanciaAteEspaco--` não é executado.',
    picture: 'panda-meditando.jpg',
  },
  {
    type: 'default',
    content: 'Caso contrário, `comprimentoDaOrbita` ficaria com `-1000` no final 😯.',
    picture: 'panda-espantado.jpg',
  },
  {
    type: 'code',
    content: `var velocidade = 50 
var distanciaAteEspaco = 1500
var comprimentoDaOrbita = 500
    
enquanto (distanciaAteEspaco > 0) {
  comprimentoDaOrbita--

  velocidade++
  distanciaAteEspaco--
}
    
escreva("distanciaAteEspaco: " + distanciaAteEspaco)
escreva("comprimentoDaOrbita: " + comprimentoDaOrbita)
escreva("velocidade: " + velocidade)


// Resultado: 
// distanciaAteEspaco: 0
// comprimentoDaOrbita: -1000
// velocidade: 1550`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Muito complicado para mim',
  },
  {
    type: 'default',
    content:
      'Vou colocar uma variável `vezes` para ajudar você a entender melhor o que está acontecendo.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var velocidade = 50 
var distanciaAteEspaco = 1500
var comprimentoDaOrbita = 500
var vezes = 0
    
enquanto (distanciaAteEspaco > 0) {
  vezes++

  se (distanciaAteEspaco <= 1000 e comprimentoDaOrbita > 0) {
      comprimentoDaOrbita--
      continua
  }

  velocidade++
  distanciaAteEspaco--
}
    
escreva("distanciaAteEspaco: " + distanciaAteEspaco)
escreva("comprimentoDaOrbita: " + comprimentoDaOrbita)
escreva("velocidade: " + velocidade)
escreva("vezes: " + vezes)


// Resultado: 
// distanciaAteEspaco: 0
// comprimentoDaOrbita: 0
// velocidade: 1550
// vezes: 2000`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Veja que a variável *vezes* indica que o laço *enquanto* foi executado 2000 vezes, porém a velocidade só foi aumentada em 1500 vezes.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'default',
    content:
      'Ou seja, nas vezes em que *continua* foi executado, *velocidade++* não foi, justamente porque esse comando fez com que o laço começasse outra iteração antes que ela fosse incrementada.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'default',
    content:
      'Então, resumidamente, o *continua* serve para pular uma repetição do laço em um dado ponto do seu bloco de código.',
    picture: 'panda-amando-bambu.jpg',
  },
  {
    type: 'user',
    content: 'Acho que entendi, talvez...',
  },
  {
    type: 'default',
    content: 'Com o tempo você pega o jeito, agora é hora de se concentrar na fuga.',
    picture: 'panda.jpg',
  },
]
