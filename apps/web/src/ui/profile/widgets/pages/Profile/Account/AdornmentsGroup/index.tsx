'use client'

import { FileStorageFolderPath } from '@stardust/core/storage/structures'

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
  const tierImage = useFileStorage(
    FileStorageFolderPath.createAsImagesRankings(),
    tier.image,
  )
  const rocketImage = useFileStorage(
    FileStorageFolderPath.createAsImagesRockets(),
    rocket.image,
  )

  return (
    <>
      <span className='hidden w-[1px] rounded-md bg-gray-700 md:block' />
      <Adornment title='Tier atual' image={tierImage} value={tier.name} />
      <Adornment title='Foguete atual' image={rocketImage} value={rocket.name} />
    </>
  )
}
