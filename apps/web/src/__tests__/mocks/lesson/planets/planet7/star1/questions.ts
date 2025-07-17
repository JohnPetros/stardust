import type {
  CheckboxQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/entities/dtos'

type Questions = [
  DragAndDropListQuestionDto,
  CheckboxQuestionDto,
  SelectionQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Vamos treinar funções. Coloque o código na ordem para que a função *escrevaMensagem* seja executada corretamente',
    type: 'drag-and-drop-list',
    items: [
      { position: 1, label: 'funcao escrevaMensagem() {' },
      { position: 2, label: "\tescreva('Sonhe com as estrelas.')" },
      { position: 3, label: '}' },
      { position: 4, label: 'escrevaMensagem()' },
    ],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    code: `funcao mostrePeso(massa, gravidade)
  var peso = massa * gravidade
  escreva("Seu peso é \${peso}.")
}

mostrePeso(72,  9.8)`,
    stem: 'Quais são os parâmetros da função *mostrePeso()*?',
    type: 'checkbox',
    options: ['massa', 'gravidade', 'peso', 'mostrePeso'],
    correctOptions: ['massa', 'gravidade'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    code: `funcao mostrePlanetaGrande(diametro)
  se (diametro > 25000) {
    escreva(\"Planeta grande\")
  }
}
mostrePlanetaGrande(400000)
mostrePlanetaGrande(100)
mostrePlanetaGrande(8000000)`,
    stem: 'Quantas vezes será escrito "Planeta grande"?',
    type: 'selection',
    answer: '2',
    options: ['2', '3', '4', '1'],
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    code: `funcao mostreDistancia(velocidade, tempo) {
  var distancia = velocidade * tempo
  escreva("Foguete percorreu \${distancia}km")
}

var velocidade =  180
var tempo =  200
mostreDistancia(velocidade, tempo)`,
    stem: 'Com exceção dos parâmetros de função, qual variável no código abaixo tem escopo local?',
    type: 'selection',
    answer: 'distancia',
    options: ['velocidade', 'tempo', 'distancia', 'mostreDistancia'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    stem: 'Complete a função *mostreLancamento()*',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['dropZone', 'mostreLancamento(', 'data', ',', 'dropZone', ') {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['escreva("O foguete será lançado em ${', 'dropZone', '}")'],
        indentation: 2,
      },
      { number: 3, texts: ['escreva("Em direção ao ${destino}")'], indentation: 2 },
      { number: 4, texts: ['}'], indentation: 0 },
      {
        number: 5,
        texts: ['dropZone', '("21/12/2012", "Planeta Kobos")'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: 'data' },
      { index: 2, label: 'destino' },
      { index: 3, label: 'funcao' },
      { index: 4, label: 'mostreLancamento' },
    ],
    correctItems: ['funcao', 'destino', 'data', 'mostreLancamento'],
    picture: 'panda-olhando-de-lado.jpg',
  },
]
