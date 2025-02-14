import type {
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  OpenQuestionDto,
  DragAndDropQuestionDto,
  CheckboxQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    type: 'open',
    stem: 'Chegaram mais caixas de tomate para reforço. Qual método utilizar para pegar essas caixas? Quero dizer os tomates e não os nomes das caixas.',
    lines: [
      {
        number: 1,
        indentation: 0,
        texts: ['var caixas = {'],
      },
      {
        number: 2,
        indentation: 2,
        texts: ['"caixa 1": ["tomate", "tomate", "tomate"],'],
      },
      {
        number: 3,
        indentation: 2,
        texts: ['"caixa 2": ["tomate", "tomate", "tomate"],'],
      },
      {
        number: 4,
        indentation: 2,
        texts: ['"caixa 3": ["tomate", "tomate", "tomate"],'],
      },
      {
        number: 5,
        indentation: 0,
        texts: ['}'],
      },
      {
        number: 6,
        indentation: 0,
        texts: ['var listasDetomates.', 'input-1', '( )'],
      },
    ],
    answers: ['valores'],
    picture: 'panda-pulando-de-alegria.jpg',
  },
  {
    stem: 'A princesa passou a lista dos salmonenses mais importantes do exército deles. Complete o programa abaixo para que ele escreve os nomes dos salmonenses e suas patentes.',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var salmonenses = {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['"Orangotron": "General"'],
        indentation: 2,
      },
      {
        number: 3,
        texts: ['"Caco, o Imbatível": "Sargento"'],
        indentation: 2,
      },
      {
        number: 4,
        texts: ['"Zeca Casca-de-Banana": "Capitão"'],
        indentation: 2,
      },
      { number: 5, texts: ['}'], indentation: 0 },
      {
        number: 6,
        texts: ['var nomes = palavras.', 'dropZone', '()'],
        indentation: 0,
      },
      {
        number: 7,
        texts: ['var patentes = palavras.', 'dropZone', '()'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: 'valores' },
      { index: 2, label: 'patentes' },
      { index: 3, label: 'chaves' },
      { index: 4, label: 'nomes' },
    ],
    correctItems: ['chaves', 'valores'],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'checkbox',
    stem: 'Ei, um desconhecido nos enviou os planos de ataque dos salmonenses. Quais elementos estão incluidos na lista *dados*',
    code: `
var planos = {
  "base secreta": "Lua Oculta", 
  "armas": {
    "tipo": "blaster 72",
    "tempo de recuo": 120,
  }, 
  "defesa": "campo energético",
  "duracao de ataque": 700
}
var dados = planos["armas"].valores()`,
    options: ['"Lua Oculta"', '120', '"campo energetico"', '"blaster 72"', '120'],
    correctOptions: ['"blaster 72"', '120'],
    picture: 'panda-espantado.jpg',
  },
  {
    type: 'selection',
    stem: 'temos parte de um dicionário contendo as frotas deles. Qual é o tipo de dado que está sendo acessado pelo dicionário *frotas*?',
    code: `var frotas = {
  "FrotaExploradora": {
    "naves": {
      "Pioneira": {
        "tripulacao": "50",
          "armamento": "canhões laser",
          "velocidade": 20000
      },
      "Galáxia": {
          "tripulacao": 100,
          "armamento": ["raios de plasma", "escudos defletores"],
          "velocidade": "15.000 km/h"
      }
    },
    "missao": "Explorar novos sistemas estelares"
}
var dado = frotas["FrotaExploradora"]["naves"]["Galáxia"]["velocidade"]`,
    answer: 'texto',
    options: ['texto', 'lista', 'número', 'lógico'],
    picture: 'panda-pensando.jpg',
  },
  {
    stem: 'Precisamos saber o quanto nosso disparador de tomates tem de munição. Consegue capturar essa informação pelo dicionário abaixo?',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var disparadores = {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['"BlasterLX": {'],
        indentation: 2,
      },
      {
        number: 3,
        texts: ['"potencia": "alta",'],
        indentation: 4,
      },
      {
        number: 4,
        texts: ['"munição": {'],
        indentation: 4,
      },
      {
        number: 5,
        texts: ['"tipo": "energia",'],
        indentation: 6,
      },
      {
        number: 6,
        texts: ['"quantidade": 100'],
        indentation: 6,
      },
      {
        number: 7,
        texts: ['"munição": {'],
        indentation: 0,
      },
      {
        number: 8,
        texts: ['var disparador = disparadores[', 'dropZone', '][', 'dropZone', ']'],
        indentation: 0,
      },
      {
        number: 9,
        texts: ['var municao = disparador[', 'dropZone', ']'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: '"tipo"' },
      { index: 2, label: '"munição"' },
      { index: 3, label: '"BlasterLX"' },
      { index: 4, label: '"quantidade"' },
      { index: 5, label: '"potencia"' },
    ],
    correctItems: ['"BlasterLX"', '"munição"', '"quantidade"'],
    picture: 'panda-olhando-de-lado.jpg',
  },
]
