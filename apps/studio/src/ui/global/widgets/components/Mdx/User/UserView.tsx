import { Content } from '../Content'
import { useFileStorage } from '@/ui/global/hooks/useFileStorage'
import { Avatar, AvatarImage } from '@/ui/shadcn/components/avatar'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

type Props = {
  title: string
  children: string[]
}

export const UserView = ({ children }: Props) => {
  const image = useFileStorage(FileStorageFolderPath.createAsStory(), 'apollo.png')
  return (
    <div className='not-prose flex w-full flex-col'>
      <div className='flex w-full items-center'>
        <Content type='user'>{children}</Content>
        <Avatar>
          <AvatarImage src={image} />
        </Avatar>
      </div>
    </div>
  )
}
