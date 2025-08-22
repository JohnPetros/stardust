import Image from 'next/image'

import { Speaker } from '../../Speaker'
import { Animation } from '../Animation'
import { Content } from '../Content'
import { Picture } from '../Picture'
import { Title } from '../Title'

type AlertProps = {
  title: string
  picture: string
  children: string | string[]
  hasAnimation?: boolean
}

export const AlertView = ({
  title,
  picture,
  children,
  hasAnimation = false,
}: AlertProps) => {
  return (
    <Animation hasAnimation={hasAnimation}>
      <div className='not-prose flex w-full flex-col items-center'>
        {title && (
          <div className='mb-4'>
            <Title>{title}</Title>
          </div>
        )}
        <div>
          <Speaker text={Array.isArray(children) ? children.join('') : children} />
          <div className='flex w-full items-center'>
            {picture && <Picture url={picture} />}
            <span className='mr-3 block'>
              <Image
                src='/icons/alert.svg'
                width={32}
                height={32}
                alt=''
                className='skeleton'
                onLoadingComplete={(image) => image.classList.remove('skeleton')}
              />
            </span>
            <Content type='alert' hasAnimation={hasAnimation}>
              {children}
            </Content>
          </div>
        </div>
      </div>
    </Animation>
  )
}
