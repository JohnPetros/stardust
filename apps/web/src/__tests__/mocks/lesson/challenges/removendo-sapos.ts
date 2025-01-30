import type { ChallengeDto } from '@stardust/core/challenging/dtos'

export const challenge: Omit<ChallengeDto, 'author'> = {
  id: '68456',
  title: 'Removendo sapos',
  slug: 'removendo-sapos',
  difficultyLevel: 'easy',
  description: '',
  categories: [],
  code: `var alimentos = leia()

var alimentosSaudaveis = []

para cada alimento em alimentos {

}

escreva(alimentosSaudaveis)`,
  testCases: [
    {
      position: 1,
      inputs: [['"manga"', '"sapo gasoso"', '"berinjela"']],
      expectedOutput: ['"manga"', '"berinjela"'],
      isLocked: false,
    },
    {
      position: 2,
      inputs: [
        [
          '"sapo condensado"',
          '"cebola doce"',
          '"camarão de batata"',
          '"sapo de morango"',
        ],
      ],
      expectedOutput: ['"cebola doce"', '"camarão de batata"'],
      isLocked: false,
    },
    {
      position: 3,
      inputs: [['"sorvete de sapo"', '"requeijão"']],
      expectedOutput: ['"requeijão"'],
      isLocked: true,
    },
  ],
  //   texts: [
  //     {
  //       type: 'default',
  //       content: 'Enfim, são e salvos em nosso foguete. Está com fome?',
  //       picture: 'panda-andando-com-bambu.jpg',
  //     },
  //     {
  //       type: 'user',
  //       content: 'Sim!',
  //     },
  //     {
  //       type: 'default',
  //       content:
  //         'O foguete no caminho ao resgate pegou vários alimentos para fazer nosso jantar, veja alguns:',
  //       picture: 'panda-sentado-com-mochila.jpg',
  //     },
  //     {
  //       type: 'code',
  //       content: `var alimentos = [
  //   "lentilha lunar"
  //   "sapo lunar"
  //   "iogurte de gelo"
  //   "sapo lácteo"
  // ]`,
  //       picture: 'panda-andando-com-bambu.jpg',
  //       isRunnable: false,
  //     },
  //     {
  //       type: 'user',
  //       content: 'Sapo?',
  //     },
  //     {
  //       type: 'default',
  //       content: 'Por algum motivo o foguete incluiu sapos entre os alimentos, eca!',
  //       picture: 'panda-espantado.jpg',
  //     },
  //     {
  //       type: 'quote',
  //       title: 'Desafio:',
  //       content:
  //         'Seu papel é remover todos os itens da lista alimentos que incluam a palavra "sapo" no nome.',
  //       picture: 'panda-sorrindo.jpg',
  //     },
  //     {
  //       type: 'code',
  //       content: `
  // // Entrada: ["pimentão", "sapo de só", "melancia"]
  // // Resultado: ["pimentão", "melancia"]

  // // Entrada: ["sapo de caju, sapo kiwi", "milho de ricota"]
  // // Resultado: ["milho de ricota"]

  // // Entrada: ["cevada", "tamarindo", "sapo coalhado"]
  // // Resultado: ["cevada", "tamarindo"]`,
  //       isRunnable: false,
  //     },
  //     {
  //       type: 'alert',
  //       content:
  //         'Para facilitar seu trabalho já coloquei um laço *para-cada* no seu código, mas você pode usar outro laço se preferir.',
  //       picture: 'panda-oferecendo-bambu.jpg',
  //     },
  //     {
  //       type: 'alert',
  //       content:
  //         'Lembre-se dos métodos de lista, caso esqueça algum você pode conferir na *documentação* na barra acima do editor de código.',
  //       picture: 'panda-fazendo-coracao.jpg',
  //     },
  //   ],
}

/**
 * var alimentos = leia()

var alimentosSaudaveis = []

para cada alimento em alimentos {
  se (!alimento.inclui("sapo")) {
    alimentosSaudaveis.adicionar(alimento)
  }
}

escreva(alimentosSaudaveis)
 */
