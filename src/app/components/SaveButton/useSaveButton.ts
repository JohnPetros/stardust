import { useCallback, useEffect, useMemo, useState } from 'react'

import { useSaveButtonStore } from '@/stores/saveButtonStore'
import { waitFor } from '@/global/helpers'

const STATE_DELAY = 1000

const variants = {
  default: 'bg-green-400 text-gray-900',
  canSave: 'animate-pulse',
  saving: 'border-yellow-400 bg-transparent text-yellow-400',
  saved: 'border-green-400 bg-transparent text-green-400',
  error: 'border-red-700 bg-transparent text-red-700',
}

export function useSaveButton(onSave: () => Promise<void>) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [hasError, setHasError] = useState(false)

  const {
    state: { canSave, saveHandler, shouldSave },
    actions: { setCanSave },
  } = useSaveButtonStore()

  const [variant, title] = useMemo(() => {
    if (canSave) {
      return [variants.canSave, 'salvar?']
    } else if (isSaving) {
      return [variants.saving, 'salvando...']
    } else if (isSaved) {
      return [variants.saved, 'salvado']
    } else if (hasError) {
      return [variants.error, 'erro']
    } else {
      return [variants.default, 'salvar']
    }
  }, [canSave, isSaving, isSaved, hasError])

  const save = useCallback(
    async (saveHandler: () => Promise<void>) => {
      try {
        setCanSave(false)
        setIsSaving(true)

        await waitFor(STATE_DELAY)

        await saveHandler()

        setIsSaved(true)
      } catch (error) {
        setHasError(true)
        await waitFor(STATE_DELAY)
        throw new Error(error)
      } finally {
        setIsSaving(false)
        await waitFor(STATE_DELAY)
        setIsSaved(false)
      }
    },
    [setCanSave]
  )

  async function handleClick() {
    save(onSave)
  }

  useEffect(() => {
    async function handleSave() {
      if (!saveHandler) return

      save(saveHandler)
    }

    if (shouldSave) handleSave()
  }, [shouldSave, saveHandler, save])

  return {
    variant,
    title,
    isDisabled: isSaving || isSaved,
    handleClick,
  }
}
