import Image from 'next/image'

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
      <div className='not-prose flex w-full flex-col'>
        {title && (
          <div className='mb-4'>
            <Title>{title}</Title>
          </div>
        )}
        <div>
          <div className='flex w-full flex-col gap-4 md:gap-2 md:items-center md:justify-center md:flex-row'>
            {picture && <Picture url={picture} />}
            <div className='flex w-full items-center'>
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
      </div>
    </Animation>
  )
}
