'use client'

import Image from 'next/image'

import { useImage } from '@/ui/global/hooks/useImage'
import { REGEX } from '@/constants'

type Props = {
  url: string
}

export const PictureView = ({ url }: Props) => {
  const image = useImage('story', url)
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
        onLoadingComplete={(imgElement) => imgElement.classList.remove('skeleton')}
      />
    </div>
  )
}
