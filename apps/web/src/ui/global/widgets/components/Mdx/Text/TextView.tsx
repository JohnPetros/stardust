import { Animation } from '../Animation'
import { Content } from '../Content'
import { Picture } from '../Picture'
import { Title } from '../Title'

type TextProps = {
  title: string
  picture: string
  children: string | string[]
  hasAnimation?: boolean
}

export const TextView = ({
  title,
  picture,
  children,
  hasAnimation = false,
}: TextProps) => {
  return (
    <Animation hasAnimation={hasAnimation}>
      <div className='not-prose flex w-full flex-col'>
        {title && (
          <div className='mb-4 h-max w-full'>
            <Title>{title}</Title>
          </div>
        )}
        <div className='flex w-full flex-col gap-4 md:gap-2 md:items-center md:justify-center md:flex-row'>
          {picture && <Picture url={picture} />}
          <Content type='default' hasAnimation={hasAnimation}>
            {children}
          </Content>
        </div>
      </div>
    </Animation>
  )
}
