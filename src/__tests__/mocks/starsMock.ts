import { Star } from '@/@types/Star'

export const starsMock: Star[] = [
  {
    id: '1',
    slug: 'star-slug-1',
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
    slug: 'star-slug-1',
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
  // Add more stars as needed
]
