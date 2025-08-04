import type { PropsWithChildren, ReactNode } from 'react'

import type { TextBlockType } from '@stardust/core/global/types'

import { TextBlockButtonView } from './TextBlockButtonView'
import { useTextBlockButton } from './useTextBlockButton'

type Props = {
  type: TextBlockType
  endContent: ReactNode
  hasPicture?: boolean
  textBlockProps?: string[][]
}

export const TextBlockButton = ({
  type,
  endContent,
  children,
  hasPicture = true,
  textBlockProps = [],
}: PropsWithChildren<Props>) => {
  const { handleTextBlockButtonClick, handlePictureInputChange } = useTextBlockButton(
    type,
    textBlockProps,
  )

  return (
    <TextBlockButtonView
      endContent={endContent}
      hasPicture={hasPicture}
      onClick={handleTextBlockButtonClick}
      onPictureInputChange={handlePictureInputChange}
    >
      {children}
    </TextBlockButtonView>
  )
}
