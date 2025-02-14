import type {
  CheckboxQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  OpenQuestionDto,
  CheckboxQuestionDto,
  DragAndDropListQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Crie um dicionário chamado "dicionario" (sem criatividade agora) com *valor* igual a "como é, princesa?" cuja *chave* seja "mensagem".',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var dicionario = {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['dropZone', ':', 'dropZone'],
        indentation: 1,
      },
      { number: 5, texts: ['}'], indentation: 0 },
      {
        number: 6,
        texts: ['var mensagem =', 'dropZone', '["mensagem"]'],
        indentation: 0,
      },
      {
        number: 7,
        texts: ['escreva(mensagem)'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: '"como é, princesa?"' },
      { index: 2, label: '"mensagem"' },
      { index: 3, label: 'dicionario' },
    ],
    correctItems: ['"mensagem"', '"como é, princesa?"', 'dicionario'],
    picture: 'panda.jpg',
  },
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
    type: 'open',
    stem: 'Seus guerreiros?? Mande uma resposta dizendo: "Como assim guerreiros?".',
    lines: [
      {
        number: 1,
        indentation: 0,
        texts: ['var dicionario = {'],
      },
      {
        number: 2,
        indentation: 2,
        texts: ['"palavra 1": "assim",'],
      },
      {
        number: 3,
        indentation: 2,
        texts: ['"palavra 2": "como",'],
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
        texts: ['var palavra1 = palavras["', 'input-2', '"]'],
        indentation: 0,
      },
      {
        number: 7,
        texts: ['var palavra2 = palavras["', 'input-3', '"]'],
        indentation: 0,
      },
      {
        number: 8,
        texts: ['var palavra3 = palavras["palavra 3"]'],
        indentation: 0,
      },
      {
        number: 6,
        indentation: 0,
        texts: ['var resposta = "${palavra1} ${palavra2} ${palavra3}?"'],
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
    stem: 'Mande uma resposta à princesa em duas frases utilizando dicionário: reorganize as linhas do código para fazer isso.',
    type: 'drag-and-drop-list',
    items: [
      { position: 1, label: 'var resposta = {' },
      { position: 2, label: '\t"frase1": "Explique-se antes."' },
      { position: 3, label: '}' },
      { position: 4, label: 'resposta["frase2"] = "Estamos curiosos"' },
      {
        position: 5,
        label: 'escreva(resposta["frase 1"] + " " + resposta["frase 2"])',
      },
    ],
    picture: 'panda-sorrindo-sentado.jpg',
  },
]
