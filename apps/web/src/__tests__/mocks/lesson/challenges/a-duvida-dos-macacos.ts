import type { ChallengeDto } from '@stardust/core/challenging/dtos'

export const challenge: ChallengeDto = {
  title: 'A dúvida dos macacos',
  slug: 'a-duvida-dos-macacos',
  difficultyLevel: 'easy',
  categories: [],
  description: '',
  author: {
    id: '',
  },
  code: `var alimentos = leia()

var macacos = {
  "Joe": 0,
  "Milo": 0,
  "Kiko": 0,
}

escreva()`,
  testCases: [
    {
      position: 1,
      inputs: [
        [
          ['Joe', 'banana'],
          ['Milo', 'banana'],
          ['Kiko', 'banana'],
        ],
      ],
      isLocked: false,
      expectedOutput: '{"Joe":1,"Milo":1,"Kiko":1}',
    },
    {
      position: 2,
      inputs: [
        [
          ['Joe', 'banana'],
          ['Milo', 'tomate'],
          ['Kiko', 'banana'],
        ],
      ],
      isLocked: true,
      expectedOutput: '{"Joe":1,"Milo":0,"Kiko":1}',
    },
    {
      position: 3,
      inputs: [
        [
          ['Joe', 'banana'],
          ['Joe', 'banana'],
          ['Milo', 'tomate'],
          ['Joe', 'banana'],
        ],
      ],
      isLocked: true,
      expectedOutput: '{"Joe":3,"Milo":2,"Kiko":0}',
    },
    {
      position: 3,
      inputs: [
        [
          ['Joe', 'tomate'],
          ['Joe', 'tomate'],
          ['Milo', 'tomate'],
          ['Kiko', 'banana'],
        ],
      ],
      isLocked: true,
      expectedOutput: '{"Joe":0,"Milo":0,"Kiko":1}',
    },
    {
      position: 4,
      inputs: [
        [
          ['Joe', 'tomate'],
          ['Milo', 'tomate'],
          ['Kiko', 'tomate'],
        ],
      ],
      isLocked: true,
      expectedOutput: '{"Joe":0,"Milo":0,"Kiko":0}',
    },
  ],
}
