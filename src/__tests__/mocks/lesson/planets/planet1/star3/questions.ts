import {
  CheckboxQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '@/@types/quiz'

type Questions = [
  OpenQuestion,
  CheckboxQuestion,
  SelectionQuestion,
  DragAndDropQuestion,
  SelectionQuestion,
]

export const questions: Questions = [
  {
    title:
      'Vamos declarar uma variável contendo o nome de um planeta que vamos explorar. Mas qual palavra eu devo escrever antes do nome de qualquer variável na hora de declará-la?',
    type: 'open',
    lines: [{ id: 1, texts: ['input-1', 'nomePlaneta'], indentation: 0 }],
    answers: ['var'],
    picture: 'panda.jpg',
  },
  {
    title:
      'Quais dos itens abaixo pode ser um nome válido de variável? (Você deve selecionar todos os itens que estão corretos)',
    type: 'checkbox',
    options: ['_planeta', '4planeta', 'planeta_alvo', 'planeta alvo'],
    correctOptions: ['_planeta', 'planeta_alvo'],
    picture: 'panda-piscando.jpg',
  },
  {
    title: 'Agora, como devo atribuir um valor a uma variável corretamente?',
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
    title: 'Atribua o nome do planeta à variável planeta',
    type: 'drag-and-drop',
    lines: [{ id: 1, texts: ['var planeta = ', 'dropZone'], indentation: 0 }],
    dragItems: [
      { id: 1, label: 'escreva' },
      { id: 2, label: '"Planeta Datahon"' },
      { id: 3, label: '333' },
    ],
    correctDragItemsIdsSequence: [2],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    title: 'Analisando tudo, qual será o resultado do seguinte código?',
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
