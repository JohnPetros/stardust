import * as Avatar from '@radix-ui/react-avatar'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

import { useFileStorage } from '@/ui/global/hooks/useFileStorage'

type Props = {
  avatarImage: string
  avatarName: string
  size: number
}

export const UserAvatarView = ({ avatarImage, avatarName, size }: Props) => {
  const normalizedAvatarImage =
    avatarImage === '/images/profile.svg' ? '/icons/profile.svg' : avatarImage
  const storageAvatarImageSrc = useFileStorage(
    FileStorageFolderPath.createAsImagesAvatars(),
    normalizedAvatarImage,
  )
  const avatarImageSrc =
    /^https?:\/\//.test(normalizedAvatarImage) || normalizedAvatarImage.startsWith('/')
      ? normalizedAvatarImage
      : storageAvatarImageSrc

  return (
    <Avatar.Root
      style={{ width: size, height: size }}
      className='relative grid shrink-0 place-content-center overflow-hidden rounded-full border border-green-700 bg-gray-800'
    >
      <Avatar.Image
        src={avatarImageSrc}
        style={{ width: size, height: size, borderRadius: '50%' }}
        onLoad={(element) => element.currentTarget.classList.remove('skeleton')}
        alt={`Avatar ${avatarName}`}
        loading='eager'
        className='skeleton relative grid place-content-center overflow-hidden rounded-full border border-green-700 bg-gray-300'
      />
    </Avatar.Root>
  )
}
