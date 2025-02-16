import type { ChallengeDto } from '@stardust/core/challenging/dtos'

export const challenge: Omit<ChallengeDto, 'author'> = {
  id: '68456',
  title: 'Verificando Número Cósmico',
  slug: 'verificando-numero-cosmico',
  difficultyLevel: 'easy',
  description: '',
  categories: [],
  code: `funcao verifiqueNumero(numero) {

}`,
  function: {
    name: 'verifiqueNumero',
    params: [],
  },
  testCases: [
    { position: 1, inputs: [0], isLocked: false, expectedOutput: 'verdadeiro' },
    { position: 2, inputs: [10], isLocked: false, expectedOutput: 'falso' },
    { position: 3, inputs: [-5.5], isLocked: false, expectedOutput: 'verdadeiro' },
  ],
  // texts: [
  //   {
  //     content:
  //       'Em uma galáxia distante, existem criaturas místicas que residem em diferentes planetas. Cada criatura é identificada por um número único que representa sua essência cósmica.',
  //     type: 'default',
  //   },
  //   {
  //     content:
  //       'É fornecido a você uma função com o nome *verifiqueNumero*, que receberá um número cósmico como parâmetro.',
  //     type: 'default',
  //   },
  //   {
  //     content:
  //       'Sua tarefa é retornar *verdadeiro* se o número for menor ou igual a zero, e *falso* caso contrário.',
  //     type: 'list',
  //     title: 'Tarefa',
  //   },
  //   {
  //     content: 'Aqui está um exemplo para entender o desafio.',
  //     type: 'default',
  //   },
  //   {
  //     content:
  //       '\nEntrada: 5\nResultado: falso\n\nEntrada: 0\nResultado: verdadeiro\n\nEntrada: -2\nResultado: verdadeiro',
  //     type: 'code',
  //     isRunnable: false,
  //   },
  //   {
  //     content:
  //       'Você terá que retornar um número, então não esqueça de utilizar o comando *retorna* dentro da função.',
  //     type: 'alert',
  //   },
  // ],
}

/**
 * funcao verifiqueNumero(numero) {
  se (numero <= 0) {
    retorna verdadeiro
  } senao {
    retorna falso
  }
}
 */
