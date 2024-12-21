import type { Challenge } from '@/@types/Challenge'

export const challenge: Challenge = {
  id: '68456',
  title: 'Area do Escudo Protetor',
  slug: 'area-do-escudo-protetor',
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
  code: `funcao calculeAreaDoEscudo(base, altura) {
  
}`,
  functionName: 'calculeAreaDoEscudo',
  testCases: [
    { id: 1, input: [10, 5], isLocked: false, expectedOutput: [25] },
    { id: 2, input: [8, 12], isLocked: false, expectedOutput: [48] },
    { id: 3, input: [15, 3], isLocked: false, expectedOutput: [22.5] },
  ],
  texts: [
    {
      type: 'default',
      content:
        'Em um planeta distante da galáxia, os habitantes da Terra foram desafiados a calcular a área de um triângulo que representa o escudo protetor da cidade espacial.',
    },
    {
      type: 'default',
      content:
        'Sua tarefa é calcular a área desse triângulo analisando sua base e altura.',
    },
    {
      type: 'code',
      content: ` 
// Entrada: (3, 2)
// Resultado: 3

// Entrada: (7, 4)
// Resultado: 14

// Entrada: (10, 10)
// Resultado: 50`,
    },
    {
      type: 'alert',
      content:
        'Lembre-se: a área de um triângulo é base vezes a altura dividido por 2.',
    },
    {
      type: 'alert',
      content:
        'Não são se esqueça de usar o "retorna" na função e também não alterar o nome e os parâmetros da função que colocamos 😁.',
    },
  ],
}

/**
 * funcao calculeAreaDoEscudo(base, altura) {
  retorna (base * altura) / 2
}
 */
