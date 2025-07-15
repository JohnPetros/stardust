'use client'

import Image from 'next/image'

import { useRest } from '@/ui/global/hooks/useRest'
import { REGEX } from '@/constants'

type PictureProps = {
  picture: string
}

export function Picture({ picture }: PictureProps) {
  const { storageService } = useRest()
  const image = storageService.fetchImage('theory', picture)
  const formattedImage = image.replace(REGEX.quotes, '')

  return (
    <div className='relative mr-3 overflow-hidden rounded-md h-16 md:w-24 '>
      <Image
        src={formattedImage}
        alt='Panda'
        className='skeleton h-auto w-auto'
        sizes='(min-width: 375px) 5rem, (min-width: 769px) 6rem'
        priority
        fill
        loading='eager'
        style={{ objectFit: 'cover' }}
        onLoadingComplete={(image) => image.classList.remove('skeleton')}
      />
    </div>
  )
}
