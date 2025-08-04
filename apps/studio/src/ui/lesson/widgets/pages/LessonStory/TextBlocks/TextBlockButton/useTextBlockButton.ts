import { useState } from 'react'

import type { TextBlockType } from '@stardust/core/global/types'
import { Image } from '@stardust/core/global/structures'

import { useTextEditorContext } from '@/ui/global/hooks/useTextEditorContext'

const DEFAULT_PICTURE_NAME = 'panda.jpg'

export function useTextBlockButton(type: TextBlockType, extraProps: string[][] = []) {
  const [picture, setPicture] = useState<Image>(Image.create(DEFAULT_PICTURE_NAME))
  const { insertWidget } = useTextEditorContext()

  function handleTextBlockButtonClick() {
    switch (type) {
      case 'default':
        insertWidget('textBlock', [['picture', `"${picture.value}"`]])
        break
      case 'alert':
        insertWidget('alertTextBlock', [['picture', `"${picture.value}"`]])
        break
      case 'quote':
        insertWidget('quoteTextBlock', [['picture', `"${picture.value}"`]])
        break
      case 'code':
        insertWidget('codeBlock', [['picture', `"${picture.value}"`], ...extraProps])
        break
      case 'user':
        insertWidget('userTextBlock')
        break
      case 'image':
        insertWidget('imageBlock', [['picture', `"${picture.value}"`]])
        break
      case 'code-line':
        insertWidget('codeLine')
        break
    }
  }

  function handlePictureInputChange(picture: Image) {
    setPicture(picture)
  }

  return {
    handleTextBlockButtonClick,
    handlePictureInputChange,
  }
}
