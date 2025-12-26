import { useState } from 'react'

import type { Guide } from '@stardust/core/manual/entities'
import type { ManualService } from '@stardust/core/manual/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import { Text } from '@stardust/core/global/structures'

import { useActionButtonStore } from '@/ui/global/stores/ActionButtonStore'

type Params = {
  manualService: ManualService
  toastProvider: ToastProvider
  guide: Guide
}

export function useGuidePage({ manualService, toastProvider, guide }: Params) {
  const [content, setContent] = useState<Text>(guide.content)
  const { useIsExecuting, useIsSuccessful, useIsFailure, useCanExecute } =
    useActionButtonStore()
  const { setIsExecuting } = useIsExecuting()
  const { setIsSuccessful } = useIsSuccessful()
  const { setIsFailure } = useIsFailure()
  const { setCanExecute } = useCanExecute()

  function handleContentChange(value: string) {
    if (value) {
      setContent(Text.create(value))
      setCanExecute(true)
    } else {
      setCanExecute(false)
    }

    setIsFailure(false)
    setIsSuccessful(false)
  }

  async function handleSaveButtonClick() {
    if (!content) return
    setIsExecuting(true)

    guide.content = content

    const response = await manualService.editGuideContent(guide)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      setIsFailure(true)
    }

    if (response.isSuccessful) {
      setIsSuccessful(true)
      toastProvider.showSuccess('Conteúdo salvo com sucesso!')
    }

    setCanExecute(false)
    setIsExecuting(false)
  }

  return {
    content,
    handleSaveButtonClick,
    handleContentChange,
  }
}
