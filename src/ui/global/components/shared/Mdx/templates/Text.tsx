import { Animation } from './Animation'
import { Content } from './Content'
import { Picture } from './Picture'
import { Title } from './Title'

type TextProps = {
  title: string
  picture: string
  children: string[]
  hasAnimation?: boolean
}

export function Text({ title, picture, children, hasAnimation = false }: TextProps) {
  return (
    <Animation hasAnimation={hasAnimation}>
      <div className='not-prose flex w-full flex-col'>
        {title && (
          <div className='mb-4 h-max w-full'>
            <Title>{title}</Title>
          </div>
        )}
        <div className='flex w-full flex-col items-center justify-center md:flex-row'>
          {picture && <Picture url={picture} />}
          <Content type='default' hasAnimation={hasAnimation}>
            {children}
          </Content>
        </div>
      </div>
    </Animation>
  )
}
