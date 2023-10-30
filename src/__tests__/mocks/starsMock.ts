import { Star } from '@/@types/star'

export const starsMock: Star[] = [
  {
    id: '1',
    isChallenge: false,
    name: 'Alpha Centauri',
    number: 1,
    planet_id: 'A1',
    texts: [
      { type: 'default', content: 'Lorem ipsum dolor sit amet.' },
      { type: 'alert', content: 'Consectetur adipiscing elit.' },
    ],
    isUnlocked: true,
    questions: [],
  },
  {
    id: '2',
    isChallenge: true,
    name: 'Sirius',
    number: 2,
    planet_id: 'B1',
    texts: [
      { type: 'default', content: 'Lorem ipsum dolor sit amet.' },
      { type: 'alert', content: 'Consectetur adipiscing elit.' },
    ],
    isUnlocked: false,
    questions: [],
  },
  // Adicione mais estrelas conforme necessário
]
