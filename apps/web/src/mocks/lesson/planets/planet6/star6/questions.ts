import type {
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  DragAndDropListQuestionDto,
  CheckboxQuestionDto,
} from '@stardust/core/lesson/entities/dtos'

type Questions = [
  SelectionQuestionDto,
  SelectionQuestionDto,
  CheckboxQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    code: `var textos = ["Foguete", "você", "é", "legal"]
    
var frase = textos.juntar("/");
escreva(frase)`,
    stem: 'Vamos confirmar mandando outra mensagem ao nosso foguete. Que frase será escrita pelo código abaixo?',
    type: 'selection',
    answer: 'Foguete/você/é/legal',
    options: [
      'Foguete você é legal',
      'Foguete/você/é/legal',
      'Foguete-você-é-legal',
      'Foguetevocêélegal',
    ],
    picture: 'panda-olhando-computador.jpg',
  },
  {
    code: `var palavra = "galactico"

var lista = palavra.dividir("a")

escreva(lista.tamanho())`,
    stem: 'Só por curiosidade: Quantos itens posso ter em uma lista ao dividir a palavra "galactico" (sem acento) usando a letra "a" como separador?',
    type: 'selection',
    answer: '3',
    options: ['1', '2', '3', '4'],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    code: `var palavras = "aí, Chega, favorzinho, por, cuidado"

var bancoDePalavras = palavras.dividir(", ", 3)

escreva(bancoDePalavras)`,
    stem: 'Tenho um banco de palavras para formar uma nova mensagem. Quais palavras estarão presentes na lista *bancoDePalavras*?',
    type: 'checkbox',
    options: ['Chega', 'aí', 'por', 'favorzinho', 'cuidado'],
    correctOptions: ['Chega', 'aí', 'favorzinho'],
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    stem: 'Agora podemos mandar uma mensagem com mais educação. Reordene o código abaixo para que seja formada a frase "Chega aí por favorzinho".',
    type: 'drag-and-drop-list',
    items: [
      { position: 1, label: 'var bancoDePalavras = [' },
      { position: 2, label: "\t'Chega'," },
      { position: 3, label: "\t'aí'," },
      { position: 4, label: "\t'por'," },
      { position: 5, label: "\t'favorzinho'," },
      { position: 6, label: ']' },
      { position: 7, label: 'escreva(palavras.juntar(" "))' },
    ],
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    stem: 'Talvez enviando nossas coordenadas ajude. Use os métodos e os separadores corretos para que *coordenada* seja igual a "kepler-222-XYH"',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var dados = "kepler, 222, XYH"'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['var lista = ', 'dados.', 'dropZone', '(', 'dropZone', ')'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['var coordenadas = ', 'lista.', 'dropZone', '(', 'dropZone', ')'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: 'dividir' },
      { index: 2, label: 'juntar' },
      { index: 3, label: '", "' },
      { index: 4, label: '"-"' },
      { index: 6, label: '" "' },
    ],
    correctItems: ['dividir', '", "', 'juntar', '"-"'],
    picture: 'panda-oferecendo-bambu.jpg',
  },
]

// c81c136a-879a-4548-a019-174b2dfe05d7
