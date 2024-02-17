import type { Challenge } from '@/@types/Challenge'

export const challenge: Challenge = {
  id: '68456',
  title: 'Retornando o primeiro planeta destino',
  slug: 'retornando-o-primeiro-planeta-destino',
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
  code: `funcao obtenhaPrimeiroPlaneta(planetas) {
    
}`,
  functionName: 'obtenhaPrimeiroPlaneta',
  testCases: [
    {
      id: 1,
      input: [['Marte', 'Vênus', 'Terra', 'Júpiter']],
      isLocked: false,
      expectedOutput: 'Marte',
    },
    {
      id: 2,
      input: [['Pandora', 'Hoth', 'Terra', 'Dagobah']],
      isLocked: false,
      expectedOutput: 'Pandora',
    },
    {
      id: 3,
      input: [['Krypton', 'Tatooine', 'Asgard', 'Gallifrey']],
      isLocked: false,
      expectedOutput: 22.5,
    },
  ],
  texts: [
    {
      content:
        'Você é um comandante espacial em uma missão para explorar o universo em busca de planetas habitáveis.',
      type: 'default',
    },
    {
      content:
        'Para ajudá-lo em sua missão, sua equipe de cientistas coletou dados de vários planetas e armazenou-os em uma lista.',
      type: 'default',
    },
    {
      content:
        'Sua tarefa é retornar o primeiro elemento dessa lista, que será o próximo destino de sua equipe de exploração.',
      type: 'default',
    },
    {
      content:
        'Entrada: ["Tatooine", "Endor", "Naboo", "Alderaan"]\nResultado: Tatooine',
      type: 'code',
    },
    { content: 'Lembre-se sobre os índices de listas', type: 'alert' },
    {
      content:
        'Não são se esqueça de usar o *retorna* na função e também não alterar o nome da função que colocamos',
      type: 'alert',
    },
  ],
}

/**
 * funcao calculePerimetro(altura, largura) {
   retorna (altura * 2) + (largura * 2 )
}
}*/
