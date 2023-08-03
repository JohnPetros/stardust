export type Podium = {
  position: number
  icon: string
  bgColor: string
  order: '1st' | '2nd' | '3rd'
}

export const PODIUM: Podium[] = [
  {
    position: 1,
    icon: 'first-place.svg',
    bgColor: 'bg-yellow-400',
    order: '1st',
  },
  {
    position: 2,
    icon: 'second-place.svg',
    bgColor: 'bg-gray-400',
    order: '2nd',
  },
  {
    position: 3,
    icon: 'third-place.svg',
    bgColor: 'bg-yellow-800',
    order: '3rd',
  },
]
