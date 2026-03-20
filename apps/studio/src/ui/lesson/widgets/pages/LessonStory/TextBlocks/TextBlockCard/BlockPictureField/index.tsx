import { Image } from '@stardust/core/global/structures'

import { BlockPictureFieldView } from './BlockPictureFieldView'

type Props = {
  picture?: string
  isRequired?: boolean
  onChange: (picture?: string) => void
}

export const BlockPictureField = ({ picture, isRequired, onChange }: Props) => {
  return (
    <BlockPictureFieldView
      picture={picture ? Image.create(picture) : undefined}
      isRequired={isRequired}
      onChange={onChange}
    />
  )
}
