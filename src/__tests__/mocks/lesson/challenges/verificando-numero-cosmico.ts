import type { Challenge } from '@/@types/Challenge'

export const challenge: Challenge = {
  id: '68456',
  title: 'Verificando Número Cósmico',
  slug: 'verificando-numero-cosmico',
  difficulty: 'easy',
  userSlug: 'apollo',
  createdAt: '',
  starId: '',
  description: '',
  categories: [],
  isCompleted: false,
  downvotesCount: 0,
  upvotesCount: 0,
  totalCompletitions: 0,
  docId: 'f60a0e67-c0b9-401a-a652-c9d5f8042ff1',
  code: `funcao verifiqueNumero(numero) {

}`,
  functionName: null,
  testCases: [
    { id: 1, input: [0], isLocked: false, expectedOutput: 'verdadeiro' },
    { id: 2, input: [10], isLocked: false, expectedOutput: 'falso' },
    { id: 3, input: [-5.5], isLocked: false, expectedOutput: 'verdadeiro' },
  ],
  texts: [
    {
      content:
        'Em uma galáxia distante, existem criaturas místicas que residem em diferentes planetas. Cada criatura é identificada por um número único que representa sua essência cósmica.',
      type: 'default',
    },
    {
      content:
        'É fornecido a você uma função com o nome *verifiqueNumero*, que receberá um número cósmico como parâmetro.',
      type: 'default',
    },
    {
      content:
        'Sua tarefa é retornar *verdadeiro* se o número for menor ou igual a zero, e *falso* caso contrário.',
      type: 'list',
      title: 'Tarefa',
    },
    {
      content: 'Aqui está um exemplo para entender o desafio.',
      type: 'default',
    },
    {
      content:
        '\nEntrada: 5\nResultado: falso\n\nEntrada: 0\nResultado: verdadeiro\n\nEntrada: -2\nResultado: verdadeiro',
      type: 'code',
      isRunnable: false,
    },
    {
      content:
        'Você terá que retornar um número, então não esqueça de utilizar o comando *retorna* dentro da função.',
      type: 'alert',
    },
  ],
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
