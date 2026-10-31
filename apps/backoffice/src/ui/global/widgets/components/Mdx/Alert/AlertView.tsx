import { Content } from '../Content'
import { Picture } from '../Picture'
import { Title } from '../Title'

type Props = {
  title: string
  picture: string
  children: string[]
}

export const AlertView = ({ title, picture, children }: Props) => {
  return (
    <div className='not-prose flex w-full flex-col items-center'>
      {title && (
        <div className='mb-4'>
          <Title>{title}</Title>
        </div>
      )}
      <div className='flex w-full items-center'>
        {picture && <Picture url={picture} />}
        <span className='mr-3 block'>
          <img src='/images/alert.svg' width={24} height={24} alt='' />
        </span>
        <Content type='alert'>{children}</Content>
      </div>
    </div>
  )
}
