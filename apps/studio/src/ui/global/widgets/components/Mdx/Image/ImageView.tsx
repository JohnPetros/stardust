import { StorageFolder } from '@stardust/core/storage/structures'

import { REGEX } from '@/constants'
import { useStorageImage } from '@/ui/global/hooks/useStorageImage'

type Props = {
  picture: string
  children: string[]
}

export const ImageView = ({ picture, children }: Props) => {
  const image = useStorageImage(StorageFolder.createAsStory(), picture)
  const formattedImage = image.replace(REGEX.quotes, '')

  return (
    <div className='not-prose flex w-full flex-col items-center justify-center gap-3'>
      <img src={formattedImage} width={180} height={120} className='rounded-lg' alt='' />
      <div>{children}</div>
    </div>
  )
}
