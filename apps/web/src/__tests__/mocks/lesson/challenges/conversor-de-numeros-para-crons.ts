import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

export const challenge: Omit<ChallengeDto, 'author'> = {
  id: '68456',
  title: 'Conversor De Numeros Para Crons',
  slug: 'conversor-de-numeros-para-crons',
  difficultyLevel: 'easy',
  description: '',
  categories: [],
  code: `funcao convertaMinutosParaCrons(minutos) {
  
}`,
  function: {
    name: 'convertaMinutosParaCrons',
    params: [],
  },
  testCases: [
    { position: 1, inputs: [300], isLocked: false, expectedOutput: 5 },
    { position: 2, inputs: [180], isLocked: false, expectedOutput: 3 },
    { position: 3, inputs: [120], isLocked: false, expectedOutput: 2 },
  ],
  // texts: [
  //   {
  //     type: 'default',
  //     content:
  //       'Você é um engenheiro de nave espacial em uma missão para explorar uma galáxia distante. A tripulação da nave utiliza uma unidade de tempo espacial para medir o tempo, que é diferente da unidade de tempo terrestre.',
  //   },
  //   {
  //     type: 'default',
  //     content:
  //       'A unidade de tempo espacial é chamada de "cron". Um cron é igual a 60 minutos terrestres. Por exemplo, se a tripulação diz que um evento ocorrerá em 3 crons, isso significa que o evento ocorrerá em 3 x 60 = 180 minutos terrestres.',
  //   },
  //   {
  //     type: 'default',
  //     content:
  //       'Você precisa criar uma função chamada minutosParaCrons que converta uma quantidade de minutos terrestres em crons.',
  //   },
  //   {
  //     type: 'code',
  //     content: '\nEntrada: 240\nResultado: 4\n\nEntrada: 360\nResultado: 6',
  //   },
  //   {
  //     type: 'alert',
  //     content:
  //       'Não são se esqueça de usar o "retorna" na função e também não alterar o nome da função que colocamos',
  //   },
  //   {
  //     type: 'alert',
  //     content: 'Dica: Lembre-se de que um cron é igual a 60 minutos terrestres.',
  //   },
  // ],
}

/**
 * funcao converterMinutosParaCrons(minutos) {
  retorna minutos / 60
}
}
 */
