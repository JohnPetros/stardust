import type {
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/entities/dtos'

type Questions = [
  OpenQuestionDto,
  DragAndDropQuestionDto,
  CheckboxQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Chegaram mais caixas de tomate para reforço. Qual método utilizar para pegar essas caixas? Quero dizer os tomates e não os nomes das caixas.',
    type: 'open',
    lines: [
      { texts: ['var caixas = {'], number: 1, indentation: 0 },
      {
        texts: ['"caixa 1": ["tomate", "tomate", "tomate"],'],
        number: 2,
        indentation: 2,
      },
      {
        texts: ['"caixa 2": ["tomate", "tomate", "tomate"],'],
        number: 3,
        indentation: 2,
      },
      {
        texts: ['"caixa 3": ["tomate", "tomate", "tomate"],'],
        number: 4,
        indentation: 2,
      },
      { texts: ['}'], number: 5, indentation: 0 },
      { texts: ['var listasDetomates.', 'input-1', '( )'], number: 6, indentation: 0 },
    ],
    answers: ['valores'],
    picture: 'panda-pulando-de-alegria.jpg',
  },
  {
    stem: 'A princesa passou a lista dos salmonenses mais importantes do exército deles. Complete o programa abaixo para que ele escreva os nomes dos salmonenses e suas patentes.',
    type: 'drag-and-drop',
    items: [
      { index: 1, label: 'valores' },
      { index: 2, label: 'patentes' },
      { index: 3, label: 'chaves' },
      { index: 4, label: 'nomes' },
    ],
    lines: [
      { texts: ['var salmonenses = {'], number: 1, indentation: 0 },
      { texts: ['"Orangotron": "General"'], number: 2, indentation: 2 },
      { texts: ['"Caco, o Imbatível": "Sargento"'], number: 3, indentation: 2 },
      { texts: ['"Zeca Casca-de-Banana": "Capitão"'], number: 4, indentation: 2 },
      { texts: ['}'], number: 5, indentation: 0 },
      { texts: ['var nomes = palavras.', 'dropZone', '()'], number: 6, indentation: 0 },
      {
        texts: ['var patentes = palavras.', 'dropZone', '()'],
        number: 7,
        indentation: 0,
      },
    ],
    picture: 'panda-segurando-bambu-de-pe.jpg',
    correctItems: ['chaves', 'valores'],
  },
  {
    code: '\nvar planos = {\n  "base secreta": "Lua Oculta", \n  "armas": {\n    "tipo": "blaster 72",\n    "tempo de recuo": 120,\n  }, \n  "defesa": "campo energético",\n  "duracao de ataque": 700\n}\nvar dados = planos.valores()',
    stem: 'Ei, um desconhecido nos enviou os planos de ataque dos salmonenses. Quais elementos estão incluidos na lista *dados*?',
    type: 'checkbox',
    options: ['"Lua Oculta"', '120', '"campo energetico"', '72', '700'],
    picture: 'panda-espantado.jpg',
    correctOptions: ['"Lua Oculta"', '"campo energetico"', '700'],
  },
  {
    code: 'var frotas = {\n  "FrotaExploradora": {\n    "naves": {\n      "Pioneira": {\n        "tripulacao": "50",\n          "armamento": "canhões laser",\n          "velocidade": 20000\n      },\n      "Galáxia": {\n          "tripulacao": 100,\n         "armamento": ["raios de plasma", "escudos defletores"],\n         "velocidade": "15.000 km/h"\n      }\n    },\n    "missao": "Explorar novos sistemas estelares"\n}\nvar dado = frotas["FrotaExploradora"]["naves"]["Galáxia"]["velocidade"]',
    stem: 'Temos parte de um dicionário contendo as frotas deles. Qual é o tipo de dado que está sendo acessado pelo dicionário *frotas*?',
    type: 'selection',
    answer: 'texto',
    options: ['texto', 'lista', 'número', 'lógico'],
    picture: 'panda-pensando.jpg',
  },
  {
    stem: 'Precisamos saber quanta munição nosso disparador de tomates tem. Consegue obter essa informação no dicionário abaixo?',
    type: 'drag-and-drop',
    items: [
      { index: 1, label: '"tipo"' },
      { index: 2, label: '"munição"' },
      { index: 3, label: '"BlasterLX"' },
      { index: 4, label: '"quantidade"' },
      { index: 5, label: '"potencia"' },
    ],
    lines: [
      { texts: ['var disparadores = {'], number: 1, indentation: 0 },
      { texts: ['"BlasterLX": {'], number: 2, indentation: 2 },
      { texts: ['"potencia": "alta",'], number: 3, indentation: 4 },
      { texts: ['"munição": {'], number: 4, indentation: 4 },
      { texts: ['"tipo": "energia",'], number: 5, indentation: 6 },
      { texts: ['"quantidade": 100'], number: 6, indentation: 6 },
      { texts: ['}'], number: 7, indentation: 4 },
      { texts: ['}'], number: 8, indentation: 2 },
      { texts: ['}'], number: 9, indentation: 0 },
      {
        texts: ['var disparador = disparadores[', 'dropZone', ']'],
        number: 10,
        indentation: 0,
      },
      {
        texts: ['var municao = disparador[', 'dropZone', ']'],
        number: 11,
        indentation: 0,
      },
      {
        texts: ['var qtd = municao[', 'dropZone', ']'],
        number: 12,
        indentation: 0,
      },
    ],
    picture: 'panda-olhando-de-lado.jpg',
    correctItems: ['"BlasterLX"', '"munição"', '"quantidade"'],
  },
]
