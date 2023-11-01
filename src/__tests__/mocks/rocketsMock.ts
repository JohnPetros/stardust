import { Rocket } from '@/@types/rocket'

export const rocketsMock: Rocket[] = [
  {
    id: '1',
    image: '/rocket1.jpg',
    name: 'Falcon 9',
    price: 1000000,
    isAcquired: true,
  },
  {
    id: '2',
    image: '/rocket2.jpg',
    name: 'Saturn V',
    price: 2000000,
    isAcquired: false,
  },
  {
    id: '3',
    image: '/rocket3.jpg',
    name: 'SpaceX Starship',
    price: 3000000,
    isAcquired: false,
  },
  // Add more rockets as needed
]
