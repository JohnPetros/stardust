import { starsMock } from './starsMock'

import { Planet } from '@/@types/Planet'

export const planetsMock: Planet[] = [
  {
    id: '1',
    name: 'Mercury',
    icon: 'mercury-icon.png',
    image: 'mercury-image.jpg',
    position: 1,
    stars: starsMock,
  },
  {
    id: '2',
    name: 'Venus',
    icon: 'venus-icon.png',
    image: 'venus-image.jpg',
    position: 2,
    stars: [],
  },
  {
    id: '3',
    name: 'Earth',
    icon: 'earth-icon.png',
    image: 'earth-image.jpg',
    position: 3,
    stars: [],
  },
  // Add more planets as needed
]
