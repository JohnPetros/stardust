import { useEffect, useState } from 'react'

import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import type { Id } from '@stardust/core/global/structures'
import type { LessonService } from '@stardust/core/lesson/interfaces'

import type { TextBlockEditorItem } from './types'

type Params = {
  starId: Id
  textBlocks: TextBlockEditorItem[]
  lessonService: LessonService
  onUpdate: (textBlocks: TextBlockDto[]) => void
  onError: (message: string) => void
}

export function useAudioGenerationPolling({
  starId,
  textBlocks,
  lessonService,
  onUpdate,
  onError,
}: Params): { isPolling: boolean } {
  const [isPolling, setIsPolling] = useState(false)

  useEffect(() => {
    const hasPending = textBlocks.some(
      (textBlock) => textBlock.audio?.status === 'pending',
    )

    if (!hasPending) {
      setIsPolling(false)
      return
    }

    setIsPolling(true)

    const interval = setInterval(async () => {
      const response = await lessonService.fetchTextsBlocks(starId)

      if (response.isFailure) {
        onError(response.errorMessage)
        return
      }

      onUpdate(response.body)
    }, 3000)

    return () => {
      clearInterval(interval)
      setIsPolling(false)
    }
  }, [lessonService, onError, onUpdate, starId, textBlocks])

  return { isPolling }
}
