'use client'

import { useApi } from '@/ui/global/hooks/useApi'
import { Adornment } from './Adornment'

type ItemsProps = {
  rocket: {
    name: string
    image: string
  }
  tier: {
    name: string
    image: string
  }
}

export function AdornmentGroup({ tier, rocket }: ItemsProps) {
  const { fetchImage } = useApi()

  const tierImage = fetchImage('rankings', tier.image)
  const rocketImage = fetchImage('rockets', rocket.image)

  return (
    <>
      <span className='hidden w-[1px] rounded-md bg-gray-300 md:block' />
      <Adornment title='Tier atual' image={tierImage} value={tier.name} />
      <Adornment title='Foguete atual' image={rocketImage} value={rocket.name} />
    </>
  )
}
