export const questions = [
  {
    title: 'Agora, Como devo atribuir um valor a uma variável corretamente?',
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
    title:
      'Quais dos itens abaixo pode ser um nome válido de variável? (Você pode escolher mais de um que seja válido)',
    type: 'checkbox',
    options: ['_planeta', '4planeta', 'planeta_alvo', 'planeta alvo'],
    correctOptions: ['_idade', 'altura_em_cm'],
    picture: 'panda-piscando.jpg',
  },
  {
    title: 'Atribua o nome do planeta à variável planeta',
    type: 'drag-and-drop',
    lines: [{ id: 1, texts: ['var planeta = ', 'dropZone'], indentLevel: 0 }],
    dropItems: [
      { id: 1, label: 'escreva' },
      { id: 2, label: '"Planeta Datahon"' },
      { id: 3, label: '333' },
    ],
    correctItemsIdsSequence: [2],
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
  {
    title:
      'Vamos declarar uma variável contendo o nome de um planeta que vamos explorar. Mas qual palavra eu devo escrever antes do nome de qualquer variável?',
    type: 'open',
    lines: [{ id: 1, texts: ['input', 'nomePlaneta'], indentLevel: 0 }],
    answers: ['var'],
    picture: 'panda.jpg',
  },
]
