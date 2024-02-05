import { useCallback, useEffect, useMemo, useState } from 'react'

import { useSaveButtonStore } from '@/stores/saveButtonStore'
import { waitFor } from '@/utils/helpers'

const variants = {
  default: 'bg-green-400 text-gray-900',
  red: 'border-red-700 bg-transparent text-red-700',
  yellow: 'border-yellow-400 bg-transparent text-yellow-400',
  green: 'border-green-400 bg-transparent text-green-400',
}

export function useSaveButton(onSave: () => Promise<void>) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [hasError, setHasError] = useState(false)

  const saveHandler = useSaveButtonStore((store) => store.state.saveHandler)
  const shouldSave = useSaveButtonStore((store) => store.state.shouldSave)

  const [variant, title] = useMemo(() => {
    if (isSaving) {
      return [variants.yellow, 'salvando...']
    } else if (isSaved) {
      return [variants.green, 'salvado']
    } else if (hasError) {
      return [variants.red, 'erro']
    } else {
      return [variants.default, 'salvar']
    }
  }, [isSaving, isSaved, hasError])

  const save = useCallback(async (saveHandler: () => Promise<void>) => {
    try {
      setIsSaving(true)

      await waitFor(1000)

      await saveHandler()

      setIsSaved(true)
    } catch (error) {
      setHasError(true)
    } finally {
      setIsSaving(false)
      await waitFor(1000)
      setIsSaved(false)
    }
  }, [])

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
    handleClick,
  }
}
