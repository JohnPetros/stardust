import Img from 'next/image'

import { Animation } from './Animation'
import { Content } from './Content'
import { useRest } from '@/ui/global/hooks/useRest'
import { REGEX } from '@/constants'

type ImageProps = {
  picture: string
  children: string[]
  hasAnimation?: boolean
}

export function Image({ picture, hasAnimation = true, children }: ImageProps) {
  const { storageService } = useRest()
  const image = storageService.fetchImage('theory', picture)
  const formattedImage = image.replace(REGEX.quotes, '')

  return (
    <Animation hasAnimation={hasAnimation}>
      <div className='not-prose flex w-full flex-col items-center justify-center'>
        <Img
          src={formattedImage}
          width={180}
          height={120}
          className='skeleton rounded-lg'
          onLoadingComplete={(image) => image.classList.remove('skeleton')}
          alt=''
        />
        <div>
          <Content hasAnimation={hasAnimation}>{children}</Content>
        </div>
      </div>
    </Animation>
  )
}
