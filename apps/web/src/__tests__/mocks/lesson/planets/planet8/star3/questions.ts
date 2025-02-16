import type {
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  CheckboxQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
]

export const questions: Questions = [
  {
    type: 'checkbox',
    stem: 'Vamos arrumar nossos itens para a viagem de volta. Qual dos itens vão ser escritos no código a seguir?',
    code: `var itens = {
  "item1": "navegação", 
  "item2": "combustível", 
  "item3": "alimentos", 
  "item4": "trajeEspacial", 
}
var { ITEM1, item2, item3, item5 } = itens
escreva(ITEM1, item2, item3, item5)`,
    options: ['item1', 'item2', 'item3', 'item4'],
    correctOptions: ['item2', 'item3'],
    picture: 'panda-com-mochila.jpg',
  },
  {
    code: `var equipamentosDeEmergencia = {
  "oxigênio": "sim",
  "kitPrimeirosSocorros": "não",
  "comunicação": "sim"
}
var equipamento1, equipamento3 = equipamentosDeEmergencia
escreva(equipamento1, equipamento3)`,
    stem: 'Conferindo equipamentos de emergencia. O que será escrito pelo código abaixo?',
    type: 'selection',
    answer: 'sim não',
    options: ['sim não', 'sim não sim', 'não sim', 'sim sim'],
    picture: 'panda-meditando.jpg',
  },
  {
    stem: 'Calculando a melhor rota para casa. Complete o código para que a distância percorrida seja igual a 6000.',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var distancias = {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['"Datahon":', 'dropZone'],
        indentation: 1,
      },
      {
        number: 3,
        texts: ['"Paravion": 4000'],
        indentation: 1,
      },
      {
        number: 4,
        texts: ['"Matrizion": 2000'],
        indentation: 1,
      },
      {
        number: 5,
        texts: ['"Ifthenia": 5000'],
        indentation: 1,
      },
      { number: 6, texts: ['}'], indentation: 0 },
      {
        number: 7,
        texts: ['var { Datahon, ', 'dropZone', '} = distancias'],
        indentation: 0,
      },
      {
        number: 8,
        texts: ['var distancia = [Datahon, Matrizion].somar()'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: '5000' },
      { index: 2, label: '4000' },
      { index: 3, label: 'Ifthenia' },
      { index: 4, label: 'Matrizion' },
      { index: 5, label: 'Looporia' },
    ],
    correctItems: ['4000', 'Matrizion'],
    picture: 'panda-olhando-computador.jpg',
  },
  {
    stem: 'A princesa nos ofereceu suprimentos médicos. Mas somente precisamos a lista que contém `antibióticos`. Conseque pegar essa lista pelo código abaixo?',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var suprimentos = {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['"kit" = {'],
        indentation: 1,
      },
      {
        number: 3,
        texts: ['"itens": ["bandagens", "álcool"],'],
        indentation: 2,
      },
      {
        number: 4,
        texts: ['"uso": "tratamento de ferimentos"'],
        indentation: 2,
      },
      {
        number: 5,
        texts: ['"remedios" = ["antibióticos", "aspirinas"]'],
        indentation: 2,
      },
      { number: 6, texts: ['}'], indentation: 1 },
      { number: 7, texts: ['}'], indentation: 0 },
      {
        number: 8,
        texts: ['var {', 'dropZone', '} = suprimentos["', 'dropZone', '"]'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: 'itens' },
      { index: 2, label: 'uso' },
      { index: 3, label: 'tipos' },
      { index: 4, label: 'remedios' },
      { index: 5, label: 'kit' },
    ],
    correctItems: ['remedios', 'kit'],
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'open',
    stem: 'Por fim, que tal enviar uma carta de despedida à princesa? Com saudação, agradecimento e assinatura.',
    lines: [
      {
        number: 1,
        indentation: 0,
        texts: ['var mensagem = {'],
      },
      {
        number: 2,
        indentation: 1,
        texts: ['"saudacao": "Olá, princesa!",'],
      },
      {
        number: 3,
        indentation: 1,
        texts: ['"corpo": {'],
      },
      {
        number: 4,
        indentation: 2,
        texts: ['"agradecimento": "Obrigado(a) por tudo!",'],
      },
      {
        number: 5,
        indentation: 2,
        texts: ['"despedida": "Nos vemos em breve!"'],
      },
      {
        number: 6,
        indentation: 1,
        texts: ['}'],
      },
      {
        number: 7,
        indentation: 1,
        texts: ['"assinatura": "Com carinho, Viajante espacial"'],
      },
      {
        number: 8,
        indentation: 0,
        texts: ['}'],
      },
      {
        number: 9,
        indentation: 0,
        texts: ['var ', 'input-1', ', corpo, assinatura = mensagem'],
      },
      {
        number: 10,
        indentation: 0,
        texts: ['escreva(saudacao)'],
      },
      {
        number: 10,
        indentation: 0,
        texts: ['escreva(corpo["', 'input-2', '"])'],
      },
      {
        number: 11,
        indentation: 0,
        texts: ['escreva(corpo["assinatura"])'],
      },
    ],
    answers: ['saudacao', 'agradecimento'],
    picture: 'panda-fazendo-coracao.jpg',
  },
]
