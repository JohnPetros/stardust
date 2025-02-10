import type {
  CheckboxQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  SelectionQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  CheckboxQuestionDto,
  DragAndDropListQuestionDto,
]

export const questions: Questions = [
  {
    code: `var frase = ">>> +>>+> >> +++>"
var palavras = frase.dividir(" ")
var traducao = ""

dicionario[">>+"] = "não"
dicionario = {
  "+++>": "guerreiros",
  ">>>": "vocês",
  "+>>+>": "serão",
  ">>": "maus",
}
dicionario[">>"] = "meus"

para cada palavra de palavras {
  var palavraTraduzida = dicionario[palavra]
}
    `,
    stem: 'A princesa falou denovo. O que ela disse?',
    type: 'selection',
    answer: 'vocês serão meus guerreiros',
    options: [
      'vocês serão meus guerreiros',
      'vocês não serão meus guerreiros',
      'vocês serão maus guerreiros',
      'vocês não serão maus guerreiros',
    ],
    picture: 'panda-espantado.jpg',
  },
  {
    stem: 'Complete a função *mostreLancamento()*',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var palavras = {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['"palavra 1: "assim"'],
        indentation: 2,
      },
      {
        number: 2,
        texts: ['palavra 2: "como"'],
        indentation: 2,
      },
      {
        number: 3,
        texts: ['palavra 3: ', '"', 'dropZone', '"'],
        indentation: 2,
      },
      { number: 4, texts: ['}'], indentation: 0 },
      {
        number: 4,
        texts: [
          'var resposta = "${palavras[',
          'dropZone',
          ']',
          '${palavras [',
          'dropZone',
          ']}',
          '${palavras["palavra 3"]}?',
        ],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: 'palavra 1' },
      { index: 2, label: 'palavra 2' },
      { index: 3, label: 'guerreiros' },
      { index: 4, label: 'palavra 2' },
    ],
    correctItems: [3, 2, 1, 4],
    picture: 'panda-espantado.jpg',
  },
  {
    type: 'open',
    stem: 'Seus guerreiros?? Mande uma resposta dizendo: "Como assim guerreiros?"',
    lines: [
      {
        number: 1,
        indentation: 0,
        texts: ['var palavras = {'],
      },
      {
        number: 2,
        indentation: 2,
        texts: ['"palavra 1: "assim"'],
      },
      {
        number: 3,
        indentation: 2,
        texts: ['"palavra 2: "como"'],
      },
      {
        number: 4,
        indentation: 2,
        texts: ['"palavra 3: "', 'input-1', '"'],
      },
      {
        number: 5,
        indentation: 0,
        texts: ['}'],
      },
      {
        number: 6,
        indentation: 0,
        texts: [
          'var resposta = "${palavras["',
          'input-2',
          '"]',
          'palavras["',
          'input-3',
          '"]',
          '}?',
        ],
      },
    ],
    answers: ['guerreiros', 'palavra 2', 'palavra 1'],
    picture: 'panda-pensando.jpg',
  },
  {
    type: 'checkbox',
    stem: 'A princesa mandou uma resposta em dicionário. Qual possíveis chaves você pode utilizar para não deixar o resultado ser igual a `nulo`',
    code: `
var pergunta = 'Aceitam minha proposta'
var dicionario = {
  '1': pergunta,    
  '2': pergunta,    
  '4': pergunta,   
} 
    
var chave = ''
escreva(dicionario[chave])`,
    options: ['"1"', '"2"', '"3"', '"4"'],
    correctOptions: ['"1"', '"2"', '"4"'],
    picture: 'panda.jpg',
  },
  {
    stem: 'Mande uma resposta à princesa em duas frases utilizando dicionário: reorganize as linhas do código para fazer isso',
    type: 'drag-and-drop-list',
    items: [
      { position: 1, label: 'var frase2 = "Estamos curiosos"' },
      { position: 2, label: 'var resposta = {' },
      { position: 3, label: '\tfrase1: "Explique-se antes."' },
      { position: 4, label: 'resposta["frase2"] = frase2' },
      { position: 5, label: '}' },
      {
        position: 6,
        label: 'escreva(resposta["frase 1"] + " " + resposta["frase 2"])',
      },
    ],
    picture: 'panda-sorrindo-sentado.jpg',
  },
]
