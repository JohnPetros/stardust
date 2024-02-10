'use client'

import Image from 'next/image'

import { useApi } from '@/services/api'
import { REGEX } from '@/global/constants'

type PictureProps = {
  url: string
}

export function Picture({ url }: PictureProps) {
  const api = useApi()
  const image = api.getImage('theory', url)
  const formattedImage = image.replace(REGEX.quotes, '')

  return (
    <div className="relative mr-3 overflow-hidden rounded-md md:h-16 md:w-24 ">
      <Image
        src={formattedImage}
        alt="Panda"
        className="skeleton h-auto w-auto"
        sizes="(min-width: 375px) 5rem, (min-width: 769px) 6rem"
        priority
        fill
        style={{ objectFit: 'cover' }}
        onLoadingComplete={(image) => image.classList.remove('skeleton')}
      />
    </div>
  )
}
