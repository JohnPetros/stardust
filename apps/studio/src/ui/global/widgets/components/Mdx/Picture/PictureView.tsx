import { StorageFolder } from '@stardust/core/storage/structures'

import { REGEX } from '@/constants'
import { useFileStorage } from '@/ui/global/hooks/useFileStorage'

type Props = {
  url: string
}

export const PictureView = ({ url }: Props) => {
  const image = useFileStorage(StorageFolder.createAsStory(), url)
  const formattedImage = image.replace(REGEX.quotes, '')

  return (
    <div className='relative mr-3 overflow-hidden'>
      <img src={formattedImage} alt='Panda' className='h-16 w-24 rounded-md' />
    </div>
  )
}
