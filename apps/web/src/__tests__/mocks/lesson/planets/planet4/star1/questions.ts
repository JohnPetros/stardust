import type {
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Vamos verificar se o planeta "Ifthenia" é um planeta mesmo:',
    type: 'drag-and-drop-list',
    items: [
      { position: 1, label: 'var planeta = verdadeiro' },
      { position: 2, label: 'se (planeta) {' },
      { position: 3, label: '\t\tescreva("De fato, se trata de um planeta")' },
      { position: 4, label: '}' },
    ],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'drag-and-drop',
    stem: 'Complete o código para que o resultado seja igual a *planeta grande*.',
    lines: [
      { number: 1, texts: ['var planetaDiametro = 1800'], indentation: 0 },
      {
        number: 2,
        texts: ['se (planetaDiametro ', 'dropZone', ' 1500) {'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['escreva("planeta ', 'dropZone', ' ")'],
        indentation: 1,
      },
      { number: 4, texts: ['}'], indentation: 0 },
    ],
    items: [
      { index: 1, label: '>' },
      { index: 2, label: '<=' },
      { index: 3, label: 'pequeno' },
      { index: 4, label: 'grande' },
    ],
    correctItemsIndexesSequence: [1, 4],
    picture: 'panda-de-oculos.jpg',
  },
  {
    stem: 'Qual é a cor do planeta "Ifthenia"?',
    code: `var planetaCor = "bege"
var temAtmosferaAzul = falso

se (temAtmosferaAzul) {
  planetaCor = "marrom"
}

escreva(planetaCor)`,
    type: 'selection',
    answer: 'bege',
    options: ['bege', 'marrom', 'azul', 'indefinpositiono'],
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    stem: 'Qual é o status da população do planeta "Ifthenia"?',
    code: `var planetaPopulacao = 1000 * 1000
var status = "pouca gente"

se (planetaPopulacao > 1000) {
  var status = "muita gente"
}

escreva(status)`,
    type: 'selection',
    answer: 'muita gente',
    options: ['pouca gente', 'muita gente', 'gente', 'variável indefinpositiona'],
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'drag-and-drop',
    stem: 'Complete a estrutura *se* para que a variável *planetaAmigavel* seja igual a *verdadeiro*.',
    lines: [
      { number: 1, texts: ['se ( ', 'dropZone', ' ) {'], indentation: 0 },
      { number: 2, texts: ['var planetaAmigavel = verdadeiro'], indentation: 1 },
      { number: 3, texts: ['escreva(planetaAmigavel)'], indentation: 1 },
      { number: 3, texts: ['}'], indentation: 0 },
    ],
    items: [
      { index: 1, label: 'falso' },
      { index: 2, label: '1 > 2' },
      { index: 3, label: '!falso' },
      { index: 4, label: '!verdadeiro' },
    ],
    correctItemsIndexesSequence: [3],
    picture: 'panda-de-oculos.jpg',
  },
]
