import type {
  CheckboxQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  OpenQuestionDto,
  DragAndDropQuestionDto,
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  DragAndDropListQuestionDto,
]

export const questions: Questions = [
  {
    type: 'open',
    statement:
      'Chegaram mais caixas de tomate para reforço. Qual método utilizar para pegar essas caixas',
    lines: [
      {
        number: 1,
        indentation: 0,
        texts: ['var caixas = {'],
      },
      {
        number: 2,
        indentation: 2,
        texts: ['"caixa 1": ["tomate", "tomate", "tomate"]'],
      },
      {
        number: 3,
        indentation: 2,
        texts: ['"caixa 2": ["tomate", "tomate", "tomate"]'],
      },
      {
        number: 4,
        indentation: 2,
        texts: ['"caixa 3": ["tomate", "tomate", "tomate"]'],
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
    statement:
      'A princesa passou a lista dos salmonenses mais importantes: Complete o programa abaixo para que ele escreve os nomes dos salmonenses e suas patentes.',
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
        number: 2,
        texts: ['"Caco, o Imbatível": "Sargento"'],
        indentation: 2,
      },
      {
        number: 2,
        texts: ['"Zeca Casca-de-Banana": "Capitão"'],
        indentation: 2,
      },
      { number: 4, texts: ['}'], indentation: 0 },
      {
        number: 4,
        texts: ['var nomes = palavras[', 'dropZone', ']'],
        indentation: 0,
      },
      {
        number: 4,
        texts: ['var patentes = palavras[', 'dropZone', ']'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: 'valores' },
      { index: 2, label: 'patentes' },
      { index: 3, label: 'chaves' },
      { index: 4, label: 'nomes' },
    ],
    correctItemsIndexesSequence: [1, 4],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'checkbox',
    statement:
      'Ei, um desconhecido nos enviou os planos de ataque dos salmonenses, qual é o resultado do código?',
    code: `
planos = {
  "base secreta": "Lua Oculta", 
  "armas": {
    "tipo": "blaster 72",
    "tempo de recuo": 120,
  }, 
  "defesa": "campo energético",
  "duracao de ataque": 700
}
escreva(planos.valores())`,
    options: ['"Lua Oculta"', '120', '"campo energetico"', '72', '700'],
    correctOptions: ['"Lua Oculta"', '"campo energetico"', '700'],
    picture: 'panda-espantado.jpg',
  },
  {
    statement:
      'Monte um dicionario que dispare tomates com os seguintes atributos: munição: "tomate", alcance: 500, velocidade: 100, tipo de disparo: rápido',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var disparadorDeTomates = {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['"munição":', 'dropZone', ','],
        indentation: 2,
      },
      {
        number: 3,
        texts: ['"alcance":', 'dropZone', ','],
        indentation: 2,
      },
      {
        number: 4,
        texts: ['"velocidade":', 'dropZone', ','],
        indentation: 2,
      },
      {
        number: 5,
        texts: ['"tipo de disparo":', 'dropZone', ','],
        indentation: 2,
      },
      { number: 6, texts: ['}'], indentation: 0 },
    ],
    items: [
      { index: 1, label: '"munição"' },
      { index: 2, label: '"alcance"' },
      { index: 3, label: '"velocidade"' },
      { index: 4, label: 'velocidade' },
      { index: 5, label: '"tipo de disparo"' },
    ],
    correctItemsIndexesSequence: [1, 2, 3, 5],
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    statement:
      'Organize o código para que ele escreva nos nomes das naves que já finalizamos com tomates, nessa ordem: "Banana Cruiser", "Macacômica V", "Chimp Explorer", "Cascamóvel Espacial"',
    type: 'drag-and-drop-list',
    items: [
      { position: 1, label: 'var naves = {' },
      { position: 2, label: '\t"Banana Cruise": "finalizado",' },
      { position: 3, label: '\t"Macacômica V": "finalizado",' },
      { position: 4, label: '\t"Chimp Explorer": "finalizado",' },
      { position: 5, label: '\t"Cascamóvel Espacial": "finalizado",' },
      { position: 6, label: '}' },
      { position: 7, label: '}' },
      {
        position: 8,
        label: 'escreva(naves.chaves())',
      },
    ],
    picture: 'panda-piscando.jpg',
  },
]
