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
    statement:
      'Vamos arrumar nossos itens para a viagem de volta. Qual dos itens vão ser escritos no código a seguir?',
    code: `var itens = {
  "item1": "navegação", 
  "item2": "combustível", 
  "item3": "alimentos", 
  "item4": "trajeEspacial", 
}
var { Item1, item2, item3, iten4 } = itens
escreva(Item1, item2, item3, item 4)`,
    options: ['item1', 'item2', 'item3', 'item4'],
    correctOptions: ['item2', 'item3'],
    picture: 'panda-com-mochila.jpg',
  },
  {
    code: `var equipamentosDeEmergencia = {
    oxigênio: "sim",
    kitPrimeirosSocorros: "não",
    comunicação: "sim"
}
var equipamento1, equipamento3 = equipamentosDeEmergencia
escreva(equipamento1, equipamento3)`,
    statement:
      'Conferindo equipamentos de emergencia. Qual será o resultado do código abaixo?',
    type: 'selection',
    answer: 'sim não',
    options: ['sim não', 'sim não sim', 'não sim', 'sim sim'],
    picture: 'panda-meditando.jpg',
  },
  {
    statement:
      'Calculando a melhor rota para casa. Complete o código para que a distância percorrida seja igual a 6000.',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var distanciaParaPlanetas = {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['"Datahon":', 'dropZone'],
        indentation: 2,
      },
      {
        number: 3,
        texts: ['"Paravion": 4000'],
        indentation: 2,
      },
      {
        number: 4,
        texts: ['"Matrizion": 2000'],
        indentation: 2,
      },
      {
        number: 5,
        texts: ['"Ifthenia": 5000'],
        indentation: 2,
      },
      { number: 6, texts: ['}'], indentation: 0 },
      {
        number: 7,
        texts: ['var { Datahon, ', 'dropZone', '} = distanciaParaPlanetas'],
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
      { index: 5, label: 'Paravion' },
    ],
    correctItemsIndexesSequence: [4, 2],
    picture: 'panda-olhando-computador.jpg',
  },
  {
    statement:
      'A princesa nos ofereceu suprimentos médicos. Mas somente precisamos somente a lista que contém `antibióticos`. Conseque pegar essa lista pelo código abaixo?',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var suprimentosMedicos = {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['var kitDePrimeirosSocorros = {'],
        indentation: 2,
      },
      {
        number: 3,
        texts: ['"itens": ["bandagens", "antissépticos", "analgésicos"],'],
        indentation: 4,
      },
      {
        number: 4,
        texts: ['"uso": "tratamento de ferimentos e lesões"'],
        indentation: 4,
      },
      {
        number: 5,
        texts: ['var medicamentos = {'],
        indentation: 2,
      },
      {
        number: 6,
        texts: [
          '"tipos": ["antibióticos", "remédios para dor", "medicamentos para enjoo"],',
        ],
        indentation: 4,
      },
      { number: 7, texts: ['}'], indentation: 0 },
      {
        number: 8,
        texts: ['var {', 'dropZone', '} = suprimentosMedicos[', 'dropZone', ']'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: 'itens' },
      { index: 2, label: 'uso' },
      { index: 3, label: 'tipos' },
      { index: 4, label: 'medicamentos' },
      { index: 5, label: 'kitDePrimeirosSocorros' },
    ],
    correctItemsIndexesSequence: [3, 4],
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'open',
    statement:
      'Por fim, que tal enviar uma carta de despedida à princesa? Com saudação, agradecimento e assinatura.',
    lines: [
      {
        number: 1,
        indentation: 0,
        texts: ['var mensagem = {'],
      },
      {
        number: 2,
        indentation: 2,
        texts: ['"saudacao": "Olá, princesa!",'],
      },
      {
        number: 3,
        indentation: 2,
        texts: ['"corpo": {'],
      },
      {
        number: 4,
        indentation: 4,
        texts: ['"agradecimento": "Foi incrível. Obrigado(a) por tudo!",'],
      },
      {
        number: 5,
        indentation: 4,
        texts: [
          '"despedida": "Nos vemos em breve, quem sabe em uma nova jornada no espaço!"',
        ],
      },
      {
        number: 6,
        indentation: 0,
        texts: ['"assinatura": "Com carinho, Viajante espacial"'],
      },
      {
        number: 7,
        indentation: 0,
        texts: ['}'],
      },
      {
        number: 8,
        indentation: 0,
        texts: ['var ', 'input-1', ', corpo, assinatura = mensagem'],
      },
      {
        number: 9,
        indentation: 0,
        texts: [
          'escreva("${saudacao}, ${corpo[',
          'input-2',
          '][',
          'input-3',
          '], ${corpo["assinatura"]})',
        ],
      },
    ],
    answers: ['saudacao', 'corpo', 'agradecimento'],
    picture: 'panda-fazendo-coracao.jpg',
  },
]
