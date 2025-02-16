import type { ChallengeDto } from '@stardust/core/challenging/dtos'

export const challenge: Omit<ChallengeDto, 'author'> = {
  id: '68456',
  title: 'Retornando o primeiro planeta destino',
  slug: 'retornando-o-primeiro-planeta-destino',
  difficultyLevel: 'easy',
  description: '',
  categories: [],
  code: `funcao obtenhaPrimeiroPlaneta(planetas) {
    
}`,
  testCases: [
    {
      position: 1,
      inputs: [['Marte', 'Vênus', 'Terra', 'Júpiter']],
      isLocked: false,
      expectedOutput: 'Marte',
    },
    {
      position: 2,
      inputs: [['Pandora', 'Hoth', 'Terra', 'Dagobah']],
      isLocked: false,
      expectedOutput: 'Pandora',
    },
    {
      position: 3,
      inputs: [['Krypton', 'Tatooine', 'Asgard', 'Gallifrey']],
      isLocked: false,
      expectedOutput: 22.5,
    },
  ],
  // texts: [
  //   {
  //     content:
  //       'Você é um comandante espacial em uma missão para explorar o universo em busca de planetas habitáveis.',
  //     type: 'default',
  //   },
  //   {
  //     content:
  //       'Para ajudá-lo em sua missão, sua equipe de cientistas coletou dados de vários planetas e armazenou-os em uma lista.',
  //     type: 'default',
  //   },
  //   {
  //     content:
  //       'Sua tarefa é retornar o primeiro elemento dessa lista, que será o próximo destino de sua equipe de exploração.',
  //     type: 'default',
  //   },
  //   {
  //     content: 'Entrada: ["Tatooine", "Endor", "Naboo", "Alderaan"]\nResultado: Tatooine',
  //     type: 'code',
  //   },
  //   { content: 'Lembre-se sobre os índices de listas', type: 'alert' },
  //   {
  //     content:
  //       'Não são se esqueça de usar o *retorna* na função e também não alterar o nome da função que colocamos',
  //     type: 'alert',
  //   },
  // ],
}

/**
 * funcao calculePerimetro(altura, largura) {
   retorna (altura * 2) + (largura * 2 )
}
}*/
