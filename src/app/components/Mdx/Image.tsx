import Img from 'next/image'

import { TypeWriter } from '../Text/TypeWriter'

import { Animation } from './Animation'
import { Content } from './Content'

import { getImage } from '@/utils/helpers'

interface ImageProps {
  url: string
  content: string
  hasAnimation?: boolean
}

export function Image({ url, hasAnimation = true, content }: ImageProps) {
  const image = url ? getImage('theory', url) : ''

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
        <Content hasAnimation={hasAnimation}>{content}</Content>
      </div>
    </Animation>
  )
}
