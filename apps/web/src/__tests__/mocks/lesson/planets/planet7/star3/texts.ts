import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'image',
    content: 'Pousamos no planeta são e salvos!',
    picture: 'apollo-caminhando.jpg',
  },
  {
    type: 'default',
    content: 'O que falta agora? Achar a pessoa que pediu nossa ajuda, é claro.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'E já que esse planeta não é nada pequeno, isso pode levar meses ou até anos.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content: 'Espera, há tubarão vindo em nossa direção, e ele parece ser bem grande!',
    picture: 'panda-espantado.jpg',
  },
  {
    type: 'image',
    content: 'Haha! Eu sei quem vocês estão procurando. Posso lever vocês até ela.',
    picture: 'tubarao.jpg',
  },
  {
    type: 'user',
    content: 'Confiamos nesse cara?',
  },
  {
    type: 'default',
    content:
      'Bom, parece ser melhor do que nada. Além disso, o que um tubarão desse tamanho fará com a gente se recusarmos?',
    picture: 'panda.jpg',
  },
  {
    type: 'image',
    content:
      'Ao longo do caminho eu passarei alguns desafios, e o primeiro começará agora.',
    picture: 'tubarao-malvado.jpg',
  },
  {
    type: 'user',
    content: 'Desafios?',
  },
  {
    type: 'image',
    content: 'O primeiro deles é trivial: adivinhar um número.',
    picture: 'tubarao-malvado.jpg',
  },
  {
    type: 'image',
    content: 'Vou gerar um número aleatório por meio de uma função nativa.',
    picture: 'tubarao-malvado.jpg',
  },
  {
    type: 'user',
    content: 'Função nativa?',
  },
  {
    type: 'default',
    content: 'Sim, também conhecida como funções internas.',
    picture: 'panda.jpg',
  },
  {
    type: 'quote',
    title: 'Função nativa',
    content:
      'São funções pré-criadas, ou seja, que já vem prontas para serem usadas em qualquer programa sem a necessidade de você mesmo criá-las.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'São como o *escreva()*, *leia()* e os métodos de lista, lembra? Em nenhum momento criamos essas funções. Não sei se tinha percebido, mas *escreva()* e *leia()* também são funções.',
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    type: 'default',
    content: 'Só que, há outras funções nativas, como o *aleatorio()*.',
    picture: 'panda.jpg',
  },
  {
    type: 'quote',
    title: 'Função aleatorio()',
    content:
      'A função *aleatorio()* apenas retorna um número aleatório. Mas não qualquer número aleatório, mas um entre 0 e 0.99999999999...',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var numeroAleatorio = aleatorio()
      
escreva(numeroAleatorio)
// Resultado: Um número aleatório entre 0 e 0.99999...`,
    isRunnable: true,
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Não importa quantas vezes você execute sempre será retornado um número aleatório entre esses dois números.',
    picture: 'panda-sorrindo-sentado.jpg',
  },
  {
    type: 'default',
    content:
      'Pode não parecer útil, de fato com certeza não é, mas existe uma função nativa que pode ser.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'quote',
    title: 'aleatorioEntre()',
    content:
      'a função *aleatorioEntre()* também gera um número aleatório. Porém, o número gerado estará sempre entre os valores passado para a função.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'quote',
    content:
      'O primeiro parâmetro é o número "mínimo" e o segundo é o "máximo". O número aleatório deverá estar entre esses dois números.',
    picture: 'panda-meditando.jpg',
  },
  {
    type: 'code',
    content: `var numeroAleatorio = aleatorioEntre(1, 9)
      
escreva(numeroAleatorio)
// Resultado: Um número aleatório entre 1 e 8`,
    isRunnable: true,
    picture: 'panda.jpg',
  },
  {
    type: 'user',
    content: 'Não era para ser um número aleatório entre 1 e 9?',
  },
  {
    type: 'default',
    content:
      'a função *aleatorioEntre(1, 9)* tem um porém: o valor gerado aleatoriamente nunca será igual ao número máximo passado para a função, mas pode ser igual ao mínimo.',
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    type: 'code',
    content: `var numero = aleatorioEntre(1, 2)
      
escreva(numero)

// Resultado: Sempre vai ser igual a 1, porque o máximo (2) nunca é incluído`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Agora vamos resolver o desafio do tubarão grandão.',
    picture: 'panda.jpg',
  },
  {
    type: 'image',
    content: 'Qual será o valor da variável *numero*?',
    picture: 'tubarao-malvado.jpg',
  },
  {
    type: 'code',
    content: `var maximo = 10
var minimo = 4 * 2 + 1

var numero = aleatorioEntre(minimo, maximo)
      
// Qual será o valor da variável numero?
escreva(numero)`,
    isRunnable: false,
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content: 'Se o máximo é *10* e o mínimo é *9*, então o resultado só pode ser *9*.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var maximo = 10
var minimo = 4 * 2 + 1

var numero = aleatorioEntre(minimo, maximo)
      
escreva(numero)
// Resultado: 9`,
    isRunnable: true,
    picture: 'panda.jpg',
  },
  {
    type: 'image',
    content: 'Essa foi muito fácil. Mas agora eu permito andarmos mais um pouco',
    picture: 'tubarao.jpg',
  },
  {
    type: 'image',
    content: 'Vamos nessa.',
    picture: 'apollo-caminhando.jpg',
  },
  {
    type: 'image',
    content: 'Já andamos um tanto, agora vou passar outro desafio.',
    picture: 'tubarao-malvado.jpg',
  },
  {
    type: 'image',
    content: 'E o desafio é: criar uma função que transforma um número em um texto!',
    picture: 'tubarao-malvado.jpg',
  },
  {
    type: 'code',
    content: `funcao transformeNumeroParaTexto(numero) {
  
}`,
    isRunnable: false,
  },
  {
    type: 'image',
    content:
      'E eu já armei uma função para vocês escreverem a resposta no *retorna* dela',
    picture: 'tubarao-malvado.jpg',
  },
  {
    type: 'user',
    content: 'Mas como transformar um número em texto?',
  },
  {
    type: 'default',
    content:
      'Essa vai ser fácil também, pois existem funções nativas que convertem um tipo de dado para outro tipo de dado.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'default',
    content: 'Essas funções nativas são 3:',
    picture: 'panda.jpg',
  },
  {
    type: 'quote',
    title: 'Função texto()',
    content:
      'A função *texto()* converte um número, sendo decimal ou inteiro, para texto, retornando esse novo texto gerado.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var numero = 42

var numeroComoTexto = texto(numero)

escreva(numeroComoTexto)

// Resultado: "42"`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Também há conversores para inteiro e decimal.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'quote',
    title: 'inteiro()',
    content:
      'Converte um número decimal ou um texto que não possui letras, em um número inteiro.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var numeroEmTexto = "111"

escreva(111 + inteiro(numeroEmTexto))

// Resultado: 222`,
    isRunnable: true,
  },
  {
    type: 'quote',
    title: 'real()',
    content:
      'Converte um número inteiro ou um texto que não possui letras, em um número decimal.',
    picture: 'panda-oferecendo-bambu.jpg',
  },
  {
    type: 'code',
    content: `var numeroComoTexto = "504.69"

escreva(0.01 + real(numeroComoTexto))

// Resultado: 504.7`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'A função se chama *real*, porém tanto os inteiros e quanto os decimais fazem da parte do conjunto dos números reais.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'alert',
    content: 'O motivo disso? Boa pergunta.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'alert',
    content:
      'Só que, como eu disse, para converter para número, seja inteiro ou decimal, o texto precisa necessariamente conter apenas números. Caso contrário vai dar erro.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'code',
    content: `escreva(inteiro("fff"))

// Resultado: Valor não parece ser um número. Somente números ou textos com números podem ser convertidos para inteiro.`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Então, para resolver o desafio do tubarão:',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `funcao transformeNumeroParaTexto(numero) {
  retorna texto(numero)
}

escreva(transformeNumeroParaTexto(999))
// Resultado: 999`,
    isRunnable: true,
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Sim, estamos retornando o retorno de outra função. Então, acabamos de criar uma função de alta ordem 😀!',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'user',
    content: 'Alta o que?',
  },
  {
    type: 'image',
    content:
      'Esses últimos dois desafios foram só um aperitivo, os verdadeiros desafios começam agora',
    picture: 'tubarao.jpg',
  },
  {
    type: 'user',
    content: 'Vish...',
  },
  {
    type: 'default',
    content: ':)',
    picture: 'panda-sorrindo-sentado.jpg',
  },
]
