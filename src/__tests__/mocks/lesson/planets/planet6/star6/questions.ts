import {
  CheckboxQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
  SelectionQuestion,
} from '@/@types/Quiz'

type Questions = [
  SelectionQuestion,
  SelectionQuestion,
  CheckboxQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
]

export const questions: Questions = [
  {
    code: `var textos = [
  "Foguete",
  "você",
  "é", 
  "legal",
]
    
var frase = textos.juntar("/");
escreva(frase)`,
    title:
      'Vamos confirmar mandando outra mensagem ao nosso foguete. Que frase será escrita pelo código abaixo?',
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
    code: `var palavra = "galáxia"

var vetor = palavra.dividir("a")

escrever(vetor.tamanho())`,
    title:
      'Só por curiosidade: Quantos itens posso ter no vetor ao dividir a palavra "galáxia" usando a letra "a" como separador?',
    type: 'selection',
    answer: '3',
    options: ['1', '2', '3', '4'],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    code: `var palavras = "aí, Chega, favorzinho, por, cuidado"

var bancoDePalavras = dividir(", ", 3)

escreva(bancoDePalavras)`,
    title:
      'Tenho um banco de palavras para formar uma nova mensagem. Quais palavras estarão presentes no vetor `bancoDePalavras`?',
    type: 'checkbox',
    options: ['Chega', 'aí', 'por', 'favorzinho', 'cuidado'],
    correctOptions: ['Chega', 'aí', 'por', 'favorzinho'],
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    title:
      'Agora podemos mandar uma mensagem com mais educação. Reordene o código abaixo para que seja formada a frase "Chega aí por favorzinho".',
    type: 'drag-and-drop-list',
    items: [
      { id: 1, label: 'var bancoDePalavras = [' },
      { id: 2, label: "   'Chega'" },
      { id: 3, label: "    'aí'" },
      { id: 4, label: "    'por'" },
      { id: 5, label: "    'favorzinho'" },
      { id: 6, label: ']' },
      { id: 7, label: 'escreva(palavras.juntar(" "))' },
    ],
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    title:
      'Talvez enviando nossas coordenadas ajude. Use os métodos e os separadores corretos para que `coordenada` seja igual a "kepler-222-XYH"',
    type: 'drag-and-drop',
    lines: [
      {
        id: 1,
        texts: ['var dados = "kepler, 222, XYH"'],
        indentation: 0,
      },
      {
        id: 2,
        texts: [
          'var dadosVetor = ',
          'dados.',
          'dropZone',
          '(',
          'dropZone',
          ')',
        ],
        indentation: 0,
      },
      {
        id: 3,
        texts: [
          'var coordenadas = ',
          'dadosVetor.',
          'dropZone',
          '(',
          'dropZone',
          ')',
        ],
        indentation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: 'dividir' },
      { id: 2, label: 'juntar' },
      { id: 3, label: '", "' },
      { id: 4, label: '"-"' },
      { id: 6, label: '" "' },
    ],
    correctDragItemsIdsSequence: [1, 3, 1, 4],
    picture: 'panda-oferecendo-bambu.jpg',
  },
]
