'use client'

import { StorageFolder } from '@stardust/core/storage/structures'

import { useFileStorage } from '@/ui/global/hooks/useFileStorage'
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
  const tierImage = useFileStorage(StorageFolder.createAsRankings(), tier.image)
  const rocketImage = useFileStorage(StorageFolder.createAsRockets(), rocket.image)

  return (
    <>
      <span className='hidden w-[1px] rounded-md bg-gray-700 md:block' />
      <Adornment title='Tier atual' image={tierImage} value={tier.name} />
      <Adornment title='Foguete atual' image={rocketImage} value={rocket.name} />
    </>
  )
}
