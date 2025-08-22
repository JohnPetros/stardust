import Img from 'next/image'

import { Speaker } from '../../Speaker'
import { Animation } from '../templates/Animation'
import { Content } from '../templates/Content'
import { useImage } from '@/ui/global/hooks/useImage'
import { REGEX } from '@/constants'

type ImageProps = {
  picture: string
  children: string | string[]
  hasAnimation?: boolean
}

export const ImageView = ({ picture, hasAnimation = true, children }: ImageProps) => {
  const image = useImage('story', picture)
  const formattedImage = image.replace(REGEX.quotes, '')

  return (
    <Animation hasAnimation={hasAnimation}>
      <div className='not-prose flex w-full flex-col items-center justify-center'>
        <Img
          src={formattedImage}
          width={180}
          height={120}
          className='skeleton rounded-lg'
          onLoadingComplete={(imgElement) => imgElement.classList.remove('skeleton')}
          alt=''
        />
        <div>
          <Content hasAnimation={hasAnimation}>{children}</Content>
        </div>
      </div>
    </Animation>
  )
}
