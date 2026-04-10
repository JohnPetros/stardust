import { type RefObject, useMemo, useState } from 'react'

import type { LessonService } from '@stardust/core/lesson/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import type { PlaygroundCodeEditorRef } from '../PlaygroundCodeEditor/types'
import { useClipboard } from '@/ui/global/hooks/useClipboard'
import type { LessonCodeExplanation } from './index'
import { STORAGE } from '@/constants/storage'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'

type UseCodeSnippetProps = {
  code: string
  isRunnable?: boolean
  codeEditorRef: RefObject<PlaygroundCodeEditorRef | null>
  lessonService: LessonService
  lessonCodeExplanation?: LessonCodeExplanation
}

type CodeExplanationAlertDialogMode = 'confirm' | 'blocked'

export function useCodeSnippet({
  codeEditorRef,
  code,
  isRunnable,
  lessonService,
  lessonCodeExplanation,
}: UseCodeSnippetProps) {
  const { copy } = useClipboard()
  const [isCodeExplanationDialogOpen, setIsCodeExplanationDialogOpen] = useState(false)
  const [isCodeExplanationAlertDialogOpen, setIsCodeExplanationAlertDialogOpen] =
    useState(false)
  const [codeExplanationAlertDialogMode, setCodeExplanationAlertDialogMode] =
    useState<CodeExplanationAlertDialogMode>('confirm')
  const [isGeneratingCodeExplanation, setIsGeneratingCodeExplanation] = useState(false)
  const [isConfirmingCodeExplanation, setIsConfirmingCodeExplanation] = useState(false)
  const [remainingUses, setRemainingUses] = useState<number | null>(null)
  const [explanation, setExplanation] = useState('')
  const [shouldFetchRemainingUsesOnRetry, setShouldFetchRemainingUsesOnRetry] =
    useState(false)

  const canExplainCode = Boolean(lessonCodeExplanation)
  const isStorySource = lessonCodeExplanation?.source === 'story'
  const storyChunkIndex = isStorySource ? lessonCodeExplanation.chunkIndex : null
  const storyExplanationStorage = useLocalStorage<string>(
    storyChunkIndex !== null
      ? STORAGE.keys.lessonCodeExplanation(storyChunkIndex)
      : `${STORAGE.keys.editorState}:code-explanation`,
  )

  async function handleRunCode() {
    codeEditorRef.current?.runCode()
  }

  function handleReloadCodeButtonClick() {
    codeEditorRef.current?.reloadValue()
  }

  async function handleCopyCodeButtonClick() {
    const codeValue = codeEditorRef.current?.getValue()
    if (codeValue) await copy(codeValue, 'Código copiado!')
  }

  async function fetchRemainingCodeExplanationUses() {
    const response = await lessonService.fetchRemainingCodeExplanationUses()

    if (response.isFailure) {
      response.throwError()
      return null
    }

    const fetchedRemainingUses = response.body.remainingUses
    setRemainingUses(fetchedRemainingUses)
    return fetchedRemainingUses
  }

  function openCodeExplanationAlertDialogByRemainingUses(uses: number) {
    if (uses <= 0) {
      setCodeExplanationAlertDialogMode('blocked')
    } else {
      setCodeExplanationAlertDialogMode('confirm')
    }

    setIsCodeExplanationAlertDialogOpen(true)
  }

  async function generateCodeExplanation() {
    const currentCode = codeEditorRef.current?.getValue() ?? code

    setIsCodeExplanationDialogOpen(true)
    setIsGeneratingCodeExplanation(true)

    try {
      const response = await lessonService.explainCode(currentCode)

      if (response.isFailure) {
        if (response.statusCode === HTTP_STATUS_CODE.forbidden) {
          setIsCodeExplanationDialogOpen(false)
          setCodeExplanationAlertDialogMode('blocked')
          setIsCodeExplanationAlertDialogOpen(true)
          setRemainingUses(0)
          return
        }

        response.throwError()
      }

      const generatedExplanation = response.body.explanation
      setExplanation(generatedExplanation)

      if (isStorySource) {
        storyExplanationStorage.set(generatedExplanation)
      }

      if (remainingUses !== null) {
        setRemainingUses(Math.max(0, remainingUses - 1))
      }

      setShouldFetchRemainingUsesOnRetry(false)
      setIsCodeExplanationDialogOpen(true)
    } finally {
      setIsGeneratingCodeExplanation(false)
    }
  }

  async function handleCodeExplanationButtonClick() {
    if (!lessonCodeExplanation) return

    if (isStorySource) {
      const cachedExplanation = storyExplanationStorage.get()

      if (cachedExplanation) {
        setExplanation(cachedExplanation)
        setIsCodeExplanationDialogOpen(true)
        setShouldFetchRemainingUsesOnRetry(true)
        return
      }
    }

    const fetchedRemainingUses = await fetchRemainingCodeExplanationUses()
    if (fetchedRemainingUses === null) return

    openCodeExplanationAlertDialogByRemainingUses(fetchedRemainingUses)
  }

  async function handleCodeExplanationRetry() {
    if (shouldFetchRemainingUsesOnRetry || remainingUses === null) {
      const fetchedRemainingUses = await fetchRemainingCodeExplanationUses()
      if (fetchedRemainingUses === null) return

      setShouldFetchRemainingUsesOnRetry(false)
      openCodeExplanationAlertDialogByRemainingUses(fetchedRemainingUses)
      return
    }

    openCodeExplanationAlertDialogByRemainingUses(remainingUses)
  }

  function handleCloseCodeExplanationDialog() {
    setIsCodeExplanationDialogOpen(false)
  }

  function handleCloseCodeExplanationAlertDialog() {
    setIsCodeExplanationAlertDialogOpen(false)
  }

  async function handleConfirmCodeExplanationAlertDialog() {
    setIsConfirmingCodeExplanation(true)

    try {
      if (codeExplanationAlertDialogMode === 'blocked') {
        setIsCodeExplanationAlertDialogOpen(false)
        return
      }

      setIsCodeExplanationAlertDialogOpen(false)
      await generateCodeExplanation()
    } finally {
      setIsConfirmingCodeExplanation(false)
    }
  }

  const editorHeight = useMemo(() => {
    if (!code) return 0
    const lines = code.split('\n').length

    if (isRunnable) return 100 + lines * (lines >= 10 ? 20 : 32)

    return lines * (lines >= 10 ? 24 : 32)
  }, [code, isRunnable])

  return {
    codeEditorRef,
    editorHeight,
    canExplainCode,
    explanation,
    remainingUses,
    isCodeExplanationDialogOpen,
    isCodeExplanationAlertDialogOpen,
    codeExplanationAlertDialogMode,
    isGeneratingCodeExplanation,
    isConfirmingCodeExplanation,
    handleRunCode,
    handleReloadCodeButtonClick,
    handleCopyCodeButtonClick,
    handleCodeExplanationButtonClick,
    handleCodeExplanationRetry,
    handleCloseCodeExplanationDialog,
    handleCloseCodeExplanationAlertDialog,
    handleConfirmCodeExplanationAlertDialog,
  }
}
