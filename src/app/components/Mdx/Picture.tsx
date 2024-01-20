import Image from 'next/image'

import { getImage } from '@/utils/helpers'

type PictureProps = {
  url: string
}

export function Picture({ url }: PictureProps) {
  const image = getImage('theory', url)

  return (
    <div className="relative mr-3 overflow-hidden rounded-md md:h-16 md:w-24 ">
      <Image
        src={image}
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
