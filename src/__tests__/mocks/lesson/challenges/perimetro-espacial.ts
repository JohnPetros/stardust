import type { Challenge } from '@/@types/Challenge'

export const challenge: Challenge = {
  id: '68456',
  title: 'Perimetro Espacial',
  slug: 'perimetro-espacial',
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
  code: `funcao calculePerimetro(altura, largura) {
    
}`,
  functionName: 'calculePerimetro',
  testCases: [
    { id: 1, input: [10, 30], isLocked: false, expectedOutput: 80 },
    { id: 2, input: [20, 20], isLocked: false, expectedOutput: 80 },
    { id: 3, input: [5, 8], isLocked: false, expectedOutput: 26 },
  ],
  texts: [
    {
      content:
        'Você é um engenheiro espacial responsável por construir uma nave em forma de retângulo.',
      type: 'default',
    },
    {
      content:
        'Sua missão é calcular o perímetro desse retângulo em unidades espaciais, cosiderando sua largura e altura.',
      type: 'quote',
    },
    {
      content:
        '\nEntrada: 6, 7\nResultado: 26\n\nEntrada: 20, 10\nResultado: 60\n\nEntrada: 2, 9\nResultado: 22',
      type: 'code',
    },
    {
      content:
        'Não são se esqueça de usar o *retorna* na função e também não alterar o nome da função que colocamos.',
      type: 'alert',
    },
    {
      content:
        'Considere que o retângulo espacial não possui cantos arredondados e que as unidades espaciais são números inteiros.',
      type: 'alert',
    },
  ],
}

/**
 * funcao calculePerimetro(altura, largura) {
   retorna (altura * 2) + (largura * 2 )
}
}*/
