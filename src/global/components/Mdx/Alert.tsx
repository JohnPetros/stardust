import Image from 'next/image'

import { Animation } from './Animation'
import { Content } from './Content'
import { Picture } from './Picture'
import { Title } from './Title'

import { slugify } from '@/global/helpers'

type TextProps = {
  title: string
  picture: string
  children: string[]
  hasAnimation?: boolean
}

export function Alert({
  title,
  picture,
  children,
  hasAnimation = false,
}: TextProps) {
  return (
    <Animation hasAnimation={hasAnimation}>
      <div className="not-prose flex w-full flex-col items-center">
        {title && (
          <div className="mb-4">
            <Title>{title}</Title>
          </div>
        )}
        <div className="flex w-full items-center">
          {picture && <Picture url={picture} />}
          <span className="mr-3 block">
            <Image
              src="/icons/alert.svg"
              width={32}
              height={32}
              alt=""
              className="skeleton"
              onLoadingComplete={(image) => image.classList.remove('skeleton')}
            />
          </span>
          <Content type="alert" hasAnimation={hasAnimation}>
            {children}
          </Content>
        </div>
      </div>
    </Animation>
  )
}
