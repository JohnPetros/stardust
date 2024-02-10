import { Text } from '@/@types/Text'

export const texts: Text[] = [
  {
    type: 'image',
    content: 'Sério?!',
    picture: 'alien-confuso.jpg',
  },
  {
    type: 'default',
    content:
      'Pela conversa que estamos tendo com esse povo, parece que não estão muito felizes.',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'user',
    content: 'Como assim?',
  },
  {
    type: 'default',
    content:
      'Estão zangados porque acabamos de pousar em um jardim importante para eles.',
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    type: 'image',
    content: 'Venham conosco imediatamente!',
    picture: 'alien-armado-correndo.jpg',
  },
  {
    type: 'user',
    content: 'Espera, mas eles não estavam desarmados?',
  },
  {
    type: 'default',
    content: 'As aparências enganam.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'default',
    content:
      'Eles querem nos levar para seu rei para termos uma conversa, então só resta obedecer.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'image',
    content: 'Chegando ao palácio...',
    picture: 'castelo-alien.jpg',
  },
  {
    type: 'image',
    content: 'Estou furioso!',
    picture: 'rei-alien.jpg',
  },
  {
    type: 'image',
    content:
      'Como punição escolham uma entre quatro pílulas: verde, amarelo, azul ou vermelho.',
    picture: 'pilulas.jpg',
  },
  {
    type: 'user',
    content: 'O que é isso?',
  },
  {
    type: 'default',
    content: 'Envolve escolher o tipo de morte que desejamos ter 😨.',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'user',
    content: 'Putz! Cada pílula tem um efeito diferente? É isso?',
  },
  {
    type: 'default',
    content:
      'Sim! Inclusice podemos fazer um programa a partir disso, colocando a cor da pílula escolhida em uma variável e verificando qual tipo de morte ela corresponde.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var cor = 'verde'

var morte = ''

se (cor == 'branco') {
  morte = 'Morrer asfixiado'
} senao se (cor == 'vermelho') {
  morte = 'Morrer queimado'
} senao se (cor == 'amarelo') {
  morte = 'Morrer de fome'
} senao se (cor == 'verde') {
  morte = 'Morrer de diarreia'
} senao {
  morte = 'ão morrer'
}

escreva(morte)

// Resultado: Morrer de diarreia`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Veja que é bem parecido com o programa de verificar a senha correta para abrir a saída do foguete.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'user',
    content: 'Verdade.',
  },
  {
    type: 'default',
    content:
      'Tanto nesse caso quanto no outro é melhor usar outro tipo de estrutura condicional, que é chamado de *escolha-caso*.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'user',
    content: 'Queeê?',
  },
  {
    type: 'quote',
    title: 'Estrutura condicional (escolha-caso)',
    content:
      'Essa é uma estrutura condicional bastante diferenciada. Nela, em vez de usar instruções que já vimos (*se*, *senao se* e *senao*), devemos utilizar outras 3: *escolha*, *caso*, *padrao*',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'user',
    content: 'Não entendi.',
  },
  {
    type: 'default',
    content:
      'Preste atenção, a estrutura *escolha caso* permite que você execute diferentes blocos de código com base no valor de uma variável.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'O valor dessa variável é avaliado uma vez e, em seguida, é comparado com cada um dos casos no bloco escolha, veja:',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var cor = 'verde'
var morte = ''

escolha (cor) {
  caso 'branco':
    morte = 'Morrer asfixiado'
  caso 'vermelho':
    morte = 'Morrer queimado'
  caso 'amarelo':
    morte = 'Morrer de fome'
  caso 'verde': 
    morte = 'Morrer de diarreia'
  padrao:
    morte = 'Não morrer'
}

escreva(morte)

// Resultado: Morrer de diarreia`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Veja que o resultado é o mesmo que antes.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content:
      'Só que usando o *escolha-caso* o valor da variável *cor* é comparado com os valores de cada *caso*.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Se corresponder com um, então será executado tudo que estiver dentro do bloco deste *caso*, não precisando mais comparar com os *casos* restantes, ou seja, o programa para de executar o "escolha caso" a partir do momento em que é encontrado um *caso* correspondente.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'user',
    content: 'Interessante.',
  },
  {
    type: 'default',
    content:
      'Agora se o valor de cor não corresponder a nenhum *caso*, então será executado o que estiver no bloco *padrao*, ou seja, se o valor de cor não for igual a nenhum *caso* específico, execute o que for padrão.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'Ou seja, se o valor da variável cor não for igual a nenhum *caso* específico, execute o que for padrão.',
    picture: 'panda-amando-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Porém, é claro que não queremos morrer de diarreia, então é melhor saírmos correndo em direção ao foguete para fujirmos.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'image',
    content: '#Partiu',
    picture: 'apollo-fungindo-no-foguete.jpg',
  },
  {
    type: 'default',
    content: 'Os guardas estão na nossa cola!',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'image',
    content: 'Não vão escapar tão fácil!',
    picture: 'alien-armado-em-uma-nave.jpg',
  },
  {
    content: 'Precisamos despistá-los de alguma forma.',
    type: 'default',
    picture: 'panda.jpg',
  },
  {
    type: 'image',
    content: 'Ali há uma caverna, vamos entrar nela!',
    picture: 'apollo-apontando-no-foguete.jpg',
  },
  {
    content: 'Dentro da caverna é possível ver portais se abrindo e fechando.',
    type: 'default',
    picture: 'panda-confuso.jpg',
  },
  {
    content:
      'Eu ouvi falar que se você entrar em um portal roxo você pode parar em um lugar fantástico, mas caso seja vermelho ou azul, ele te pode levar a um limbo sem fim, e se for de qualquer outra cor ele não leva para lugar nenhum.',
    type: 'default',
    picture: 'panda-de-oculos.jpg',
  },
  {
    content:
      'Essa é mais uma situação para usarmos a estrutura de *escolha caso*.',
    type: 'default',
    picture: 'panda-comemorando.jpg',
  },
  {
    content: `var cor = 'roxo'
var destino = ''

escolha (cor) {
  caso 'azul':
  caso 'vermelho':
    destino = 'Limbo'
  caso 'roxo':
    destino = 'Lugar fantástico'
  padrao:
    destino = 'nenhum'
}

escreva(destino)
// Resultado: Lugar fantástico
    `,
    type: 'code',
    isRunnable: true,
  },
  {
    content:
      'Não expliquei antes, porém dois ou mais casos podem ter o mesmo bloco, isto é, podem excutar um mesmo bloco de código.',
    type: 'alert',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content:
      'Ou seja, nesta situação se um portal for tanto azul ou vermelho, o destino será o limbo do mesmo jeito.',
    type: 'alert',
    picture: 'panda-triste.jpg',
  },
  {
    content:
      'Mas como encontramos um portal roxo, resta entrar nele e ver o que nos aguarda.',
    type: 'default',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'image',
    content: 'Ao infinito e além!',
    picture: 'foguete-entrando-no-portal.jpg',
  },
]
