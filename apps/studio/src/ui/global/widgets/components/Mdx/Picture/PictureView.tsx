import { StorageFolder } from '@stardust/core/storage/structures'

import { REGEX } from '@/constants'
import { useStorageImage } from '@/ui/global/hooks/useStorageImage'

type Props = {
  url: string
}

export const PictureView = ({ url }: Props) => {
  const image = useStorageImage(StorageFolder.createAsStory(), url)
  const formattedImage = image.replace(REGEX.quotes, '')

  return (
    <div className='relative mr-3 overflow-hidden'>
      <img src={formattedImage} alt='Panda' className='h-16 w-24 rounded-md' />
    </div>
  )
}
