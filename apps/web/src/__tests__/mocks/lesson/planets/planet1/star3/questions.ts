import type {
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  OpenQuestionDto,
  CheckboxQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
  SelectionQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Vamos declarar uma variável contendo o nome de um planeta que vamos explorar. Mas qual palavra eu devo escrever antes do nome de qualquer variável na hora de declará-la?',
    type: 'open',
    lines: [{ number: 1, texts: ['input-1', 'nomePlaneta'], indentation: 0 }],
    answers: ['var'],
    picture: 'panda.jpg',
  },
  {
    stem: 'Quais dos itens abaixo pode ser um nome válido de variável? (Você deve selecionar todos os itens que estão corretos)',
    type: 'checkbox',
    options: ['_planeta', '4planeta', 'planeta_alvo', 'planeta alvo'],
    correctOptions: ['_planeta', 'planeta_alvo'],
    picture: 'panda-piscando.jpg',
  },
  {
    stem: 'Agora, como devo atribuir um valor a uma variável corretamente?',
    type: 'selection',
    answer: 'nomeDaVariavel = valor',
    options: [
      'nomeDaVariavel <- valor',
      'nomeDaVariavel = valor',
      'nomeDavariavel < valor',
      'nomeDavariavel == valor',
    ],
    picture: 'panda-piscando.jpg',
  },
  {
    stem: 'Atribua o nome do planeta à variável planeta',
    type: 'drag-and-drop',
    lines: [{ number: 1, texts: ['var planeta = ', 'dropZone'], indentation: 0 }],
    items: [
      { index: 1, label: 'escreva' },
      { index: 2, label: '"Planeta Datahon"' },
      { index: 3, label: '333' },
    ],
    correctItemsIndexesSequence: [2],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    stem: 'Analisando tudo, qual será o resultado do seguinte código?',
    code: `var nomePlaneta = "Planeta 0thigs"
var nome = "Planeta Datahon"

nomePlaneta = nome
escreva("planeta encontrado: ", nomePlaneta)`,
    type: 'selection',
    answer: 'planeta encontrado: Datahon',
    options: [
      'planeta encontrado: Planeta Datahon',
      'planeta encontrado: Planeta 0thigs',
      'planeta encontrado: Planeta nomePlaneta',
      'planeta encontrado: Planeta "Datanhon"',
    ],
    picture: 'panda-sorrindo.jpg',
  },
]
