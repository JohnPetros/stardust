import { Content } from '../Content'
import { Picture } from '../Picture'
import { Title } from '../Title'

type Props = {
  title: string
  picture: string
  children: string[]
}

export const TextView = ({ title, picture, children }: Props) => {
  return (
    <div className='not-prose flex w-full flex-col'>
      {title && (
        <div className='mb-4 h-max w-full'>
          <Title>{title}</Title>
        </div>
      )}
      <div className='flex w-full flex-row items-start'>
        {picture && <Picture url={picture} />}
        <Content type='default'>{children}</Content>
      </div>
    </div>
  )
}
