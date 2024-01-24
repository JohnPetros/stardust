import { Animation } from './Animation'
import { Content } from './Content'
import { Picture } from './Picture'
import { Title } from './Title'

import { slugify } from '@/utils/helpers'

type QuoteProps = {
  title: string
  picture: string
  children: string[]
  hasAnimation?: boolean
}

export function Quote({
  title,
  picture,
  children,
  hasAnimation = true,
}: QuoteProps) {
  return (
    <Animation hasAnimation={hasAnimation}>
      <div className="not-prose flex w-full flex-col items-center">
        {title && (
          <section id={slugify(title)} className="mb-4">
            <Title>{title}</Title>
          </section>
        )}
        <div className="flex w-full items-center">
          {picture && <Picture url={picture} />}
          <Content type="quote" hasAnimation={hasAnimation}>
            {children}
          </Content>
        </div>
      </div>
    </Animation>
  )
}
