import * as Avatar from '@radix-ui/react-avatar'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

import { useFileStorage } from '@/ui/global/hooks/useFileStorage'

type Props = {
  avatarImage: string
  avatarName: string
  size: number
}

export const UserAvatarView = ({ avatarImage, avatarName, size }: Props) => {
  const avatarImageSrc = useFileStorage(
    FileStorageFolderPath.createAsImagesAvatars(),
    avatarImage,
  )

  return (
    <Avatar.Root>
      <Avatar.Image
        src={avatarImageSrc}
        style={{ width: size, height: size, borderRadius: '50%' }}
        onLoad={(element) => element.currentTarget.classList.remove('skeleton')}
        alt={`Avatar ${avatarName}`}
        loading='eager'
        className='skeleton relative grid place-content-center overflow-hidden border border-green-700 bg-gray-300 shrink-0 rounded-full'
      />
    </Avatar.Root>
  )
}
