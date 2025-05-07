import type {
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  OpenQuestionDto,
  DragAndDropListQuestionDto,
} from '@stardust/core/lesson/entities/dtos'

type Questions = [
  SelectionQuestionDto,
  OpenQuestionDto,
  SelectionQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Vamos verificar se está tudo bem com as peças do foguete. Primeiro, Qual será o resultado da variável *energia*?',
    code: `var energia = 100

fazer { 
  energia -= 10
} enquanto(energia > 0)

escreva(energia)`,
    type: 'selection',
    answer: '0',
    options: ['0', '90', '100', '1000'],
    picture: 'panda-comemorando.jpg',
  },
  {
    stem: 'Quero verificar apenas as peças com códigos ímpares. Qual o nome da instrução que permite pular uma iteração?',
    type: 'open',
    lines: [
      {
        number: 1,
        texts: ['enquanto', '(totalPecas > 0) {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['se (codigo % 2 == 0) {'],
        indentation: 2,
      },
      {
        number: 2,
        texts: ['input-1'],
        indentation: 4,
      },
      {
        number: 3,
        texts: ['}'],
        indentation: 2,
      },
      {
        number: 4,
        texts: ['totalPecas--'],
        indentation: 2,
      },
      {
        number: 5,
        texts: ['}'],
        indentation: 0,
      },
    ],
    answers: ['continua'],
    picture: 'panda-triste.jpg',
  },
  {
    stem: 'Agora o nível de oxigênio. Quantas vezes esse laço será executado?',
    code: `var nivelDeOxigenio = 100

fazer {
  escreva("O oxigênio está em " + nivelDeOxigenio + "%")

} enquanto (nivelDeOxigenio < 100)`,
    type: 'selection',
    answer: '1',
    options: ['10', '100', '1', 'infinitamente'],
    picture: 'panda-de-oculos.jpg',
  },
  {
    stem: 'Reordene o laço *fazer enquanto* corretamente, de modo que a primeira mensagem escrita seja "Esse foguete tem 2 turbinas funcionando." e a última seja "Esse foguete tem 4 turbinas funcionando.".',
    type: 'drag-and-drop-list',
    items: [
      { position: 1, label: 'var numero = 2' },
      { position: 2, label: 'fazer {' },
      {
        position: 3,
        label: '\tescreva("Esse foguete tem ${numero} turbinas funcionando.")',
      },
      { position: 4, label: '\tnum++' },
      { position: 5, label: '} enquanto (numero <= 4)' },
    ],
    picture: 'panda-exercitando.jpg',
  },
  {
    stem: 'Complete o laço, de modo que a temperatura do foguete seja igual a 25',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var temperatura = 50'], indentation: 0 },
      { number: 2, texts: ['dropZone', '{'], indentation: 0 },
      {
        number: 3,
        texts: ['se (temperatura == ', 'dropZone', ') {'],
        indentation: 2,
      },
      { number: 4, texts: ['dropZone'], indentation: 4 },
      { number: 5, texts: ['}'], indentation: 2 },
      { number: 6, texts: ['temperatura -= 5'], indentation: 2 },
      { number: 7, texts: ['} enquanto (temperatura != 25)'], indentation: 0 },
      {
        number: 8,
        texts: ['escreva("A temperatura está no nível ideal, que é 25")'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: 'fazer' },
      { index: 2, label: 'enquanto' },
      { index: 3, label: 'pausa' },
      { index: 4, label: 'continua' },
      { index: 5, label: '50' },
      { index: 6, label: '25' },
    ],
    correctItems: ['fazer', '25', 'pausa'],
    picture: 'panda-abracando-bambu.jpg',
  },
]
