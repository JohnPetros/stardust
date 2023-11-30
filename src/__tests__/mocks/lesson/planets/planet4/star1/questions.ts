export const questions = [
  {
    title: 'Vamos verificar se o planeta "Ifthenia" é um planeta mesmo:',
    type: 'drag-and-drop-list',
    items: [
      { id: 1, label: 'var planeta = verdadeiro' },
      { id: 2, label: 'se (planeta) {' },
      { id: 3, label: '  escreva("De fato, se trata de um planeta")' },
      { id: 4, label: '}' },
    ],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'drag-and-drop',
    title:
      'Complete o código para que o resultado seja igual a `planeta grande`',
    lines: [
      { id: 1, texts: ['var planetaDiametro = 1800'], identation: 0 },
      {
        id: 2,
        texts: ['se (planetaDiametro ', 'dropZone', ' 1500) {'],
        identation: 0,
      },
      {
        id: 3,
        texts: ['escreva("planeta ', 'dropZone', ' ")'],
        identation: 1,
      },
      { id: 4, texts: ['}'], identation: 0 },
    ],
    dragItems: [
      { id: 1, label: '>' },
      { id: 2, label: '<=' },
      { id: 3, label: 'pequeno' },
      { id: 4, label: 'grande' },
    ],
    correctDragItemsIdsSequence: [1, 4],
    picture: 'panda-de-oculos.jpg',
  },
  {
    title: 'Qual é a cor do planeta "Ifthenia":',
    code: `var planetaCor = "bege"
var temAtmosferaAzul = falso

se (temAtmosferaAzul) {
  planetaCor = "marrom"
}

escreva(planetaCor)`,
    type: 'selection',
    answer: 'bege',
    options: ['bege', 'marrom', 'azul', 'indefinido'],
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    title: 'Qual é o status da população do planeta "Ifthenia"?',
    code: `var planetaPopulacao = 1000 * 1000
var status = "pouca gente"

se (planetaPopulacao > 1000) {
  var status = "muita gente"
}

escreva(status)`,
    type: 'selection',
    answer: 'pouca gente',
    options: ['pouca gente', 'muita gente', 'gente', 'variável indefinida'],
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'drag-and-drop',
    title:
      'Complete a estrutura `se` para que a variável `planetaAmigavel` seja igual a `verdadeiro`',
    lines: [
      { id: 1, texts: ['se ( ', 'dropZone', ' ) {'], identation: 0 },
      { id: 2, texts: ['var planetaAmigavel = verdadeiro'], identation: 1 },
      { id: 3, texts: ['escreva(planetaAmigavel)'], identation: 1 },
      { id: 3, texts: ['}'], identation: 0 },
    ],
    dragItems: [
      { id: 1, label: 'falso' },
      { id: 2, label: '1 > 2' },
      { id: 3, label: '!falso' },
      { id: 4, label: '!verdadeiro' },
    ],
    correctDragItemsIdsSequence: [3],
    picture: 'panda-de-oculos.jpg',
  },
]
