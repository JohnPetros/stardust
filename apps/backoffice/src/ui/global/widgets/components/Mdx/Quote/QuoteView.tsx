import { Content } from '../Content'
import { Picture } from '../Picture'
import { Title } from '../Title'

type Props = {
  title: string
  picture: string
  children: string[]
}

export const QuoteView = ({ title, picture, children }: Props) => {
  return (
    <div className='flex w-full flex-col'>
      {title && (
        <div className='mb-4'>
          <Title>{title}</Title>
        </div>
      )}
      <div className='flex w-full items-center'>
        {picture && <Picture url={picture} />}
        <Content type='quote'>{children}</Content>
      </div>
    </div>
  )
}
