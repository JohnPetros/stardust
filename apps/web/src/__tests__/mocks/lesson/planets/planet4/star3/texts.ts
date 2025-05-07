import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    content: 'Enfim, pousamos com segurança!',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'user',
    content: 'Ufa!',
  },
  {
    content:
      'Opa! parece que várias pessoas desse planeta já começaram a rodear o foguete.',
    type: 'default',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'image',
    content: '$%@#%$%!',
    picture: 'alien-falando.jpg',
  },
  {
    type: 'user',
    content: 'Não entendo nada o que ele diz',
  },
  {
    content:
      'É bom dizer oi para eles, mas como eles não falam a nossa língua, será preciso usar um tradutor.',
    type: 'default',
    picture: 'panda-sorrindo.jpg',
  },
  {
    content:
      'Por padrão, o foguete traduz 2 línguas estrangeiras: Xanxiriano e Krynnishiano. Porém, caso não seja nenhuma das duas, o tradutor procurará outro idioma em seu banco de dados.',
    type: 'default',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    content:
      'Para montar um programa disso, utilizaremos a terceira variação da estrutura condicional: *senão-se*.',
    type: 'default',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'user',
    content: 'Mas não já vimos isso antes?',
  },
  {
    type: 'default',
    content:
      'Não confunda com um simples *senao*. Neste caso, o senão-se (escrito no código como *senao se*) sempre virá depois do primeiro *se* e antes de *senao* (caso tenha):',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'code',
    content: `var idioma = "Vortaxiano"

se (idioma == 'Xanxiriano') {
  escreva("Traduzir de Xanxiriano")
} senao se (idioma == 'Krynnishiano') { 
  escreva("Traduzir de Krynnishiano")
} senao {
  escreva("Traduzir de outro idioma")
}

// Resultado: Traduzir de outro idioma`,
    isRunnable: true,
  },
  {
    type: 'quote',
    title: 'Condicional aninhado',
    content:
      'Perceba que o *senao se* funciona como um *se* normal, exigindo que passemos uma condição, que caso seja verdadeira, seu bloco de código será executado em vez do bloco do *senao*.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Além disso, a estrutura *senão-se* é conhecido como *se aninhado*, justamente porque podemos colocar vários *senao se* dentro de uma estrura condicional.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Isso será convenientemente útil, pois para você abrir a saída do foguete, você precisará de uma senha correta.',
    picture: 'panda-amando-bambu.jpg',
  },
  {
    type: 'user',
    content: 'Como assim uma senha para abrir o foguete?',
  },
  {
    type: 'default',
    content:
      'A senha é composta por 4 números, e, dependendo da combinação, pode abrir um compartimento diferente do foguete, veja só:',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var senha = 9713

se (senha == 2222) {
  escreva("Abrir cozinha")
} senao se (senha == 4567) {
  escreva("Abrir banheiro")
} senao se (senha == 7568) {
  escreva("Abrir quarto de dormir") 
} senao se (senha == 9713) {
  escreva("Abrir saída") 
} senao {
  escreva("Senha inválida")
}

// Resultado: Abrir saída`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Existe uma forma mais fácil de fazer isso usando outro tipo de estrutura, mas podemos falar sobre ela depois.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'default',
    content:
      'Por enquanto, quero que você perceba que agora podemos construir estruturas complexas, colocando *se* dentro de *se*.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, você pode querer desconfiar se os alienígenas lá fora são verdadeiramente amigáveis.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content: 'Neste caso, podemos usar uma condição dentro de outra condição:',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `se (povoAmigavel == falso) {

  se (povoArmado == verdadeiro) {
    escreva('Fugir para longe') 
  } senao {
    escreva('Cair na porrada')
  }

} senao {
  escreva('Tentar conversar')
}`,
    isRunnable: false,
  },
  {
    type: 'user',
    content: 'Não entendi nada.',
  },
  {
    type: 'default',
    content:
      'Parece complexo? Calma. Vamos supor em um situação hipotetica que o povo alienígena não fosse amigável e estivesse armado de fato.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'image',
    content: 'Situação em que os alienígenas são uma ameaça.',
    picture: 'alien-armado.jpg',
  },
  {
    type: 'code',
    content: `var povoAmigavel = falso
var povoArmado = verdadeiro

se (povoAmigavel == falso) {

  se (povoArmado == verdadeiro) {
    escreva('Fugir para longe') 
  } senao {
    escreva('Cair na porrada')
  }

} senao {
  escreva('Tentar conversar')
}

// Resultado: Fugir para longe`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Perceba que o *se* dentro do primeiro *se* foi executado, mas só porque a condição do primeiro *se* resultou em *verdadeiro*.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Mas como eu disse, o povo desse planeta é amigável e educado, então vamos para situação real:',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'image',
    content: 'Situação em que os alienígenas são amigáveis.',
    picture: 'alien-dando-coracao.jpg',
  },
  {
    type: 'code',
    content: `var povoAmigavel = verdadeiro
var povoArmado = falso

se (povoAmigavel == falso) {

  se (povoArmado == verdadeiro) {
    escreva('Fugir para longe') 
  } senao {
    escreva('Cair na porrada')
  }

} senao {
  escreva('Tentar conversar')
}

// Resultado: Tentar conversar`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Agora sim, como a condição do primero *se* resultou em falso, apenas o bloco *senao* do primeiro *se* foi executado.',
    picture: 'panda-piscando.jpg',
  },
  {
    content: 'Entendi!',
    type: 'user',
  },
  {
    type: 'default',
    content: 'Muito bem, agora sim podemos conhecer melhor os seres desse planeta.',
    picture: 'panda-deslumbrado.jpg',
  },
]
