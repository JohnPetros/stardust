import Img from 'next/image'

import { Animation } from './Animation'
import { Content } from './Content'

import { useImage } from '@/hooks/useImage'

interface ImageProps {
  picture: string
  children: string
  hasAnimation?: boolean
}

export function Image({ picture, hasAnimation = true, children }: ImageProps) {
  const image = useImage('theory', picture)

  return (
    <Animation hasAnimation={hasAnimation}>
      <div className="flex w-full flex-col items-center justify-center">
        <Img
          src={image}
          width={180}
          height={120}
          className="rounded-lg"
          priority
          alt=""
        />
        <div>
          <Content hasAnimation={hasAnimation}>{children}</Content>
        </div>
      </div>
    </Animation>
  )
}
