import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import { type Id, Integer, TextBlock } from '@stardust/core/global/structures'
import type { LessonService } from '@stardust/core/lesson/interfaces'
import { AudioVoice } from '@stardust/core/lesson/structures'
import type { AudioVoiceDto } from '@stardust/core/lesson/structures/dtos'

import { CACHE } from '@/constants'
import { useFetch } from '@/ui/global/hooks/useFetch'
import { useActionButtonStore } from '@/ui/global/stores/ActionButtonStore'
import { useMdx } from '@/ui/global/widgets/components/Mdx/useMdx'
import type { SortableItem } from '@/ui/global/widgets/components/SortableList/types'
import type { SupportedTextBlockType, TextBlockEditorItem } from './types'
import { useAudioGenerationPolling } from './useAudioGenerationPolling'

const SUPPORTED_TEXT_BLOCK_TYPES: SupportedTextBlockType[] = [
  'default',
  'user',
  'alert',
  'quote',
  'code',
  'image',
]

const DEFAULT_BLOCK_CONTENT: Record<SupportedTextBlockType, string> = {
  default: 'Insira seu texto aqui',
  alert: 'Insira seu texto de alerta aqui',
  quote: 'Insira seu texto de reflexão aqui',
  user: 'Insira a fala do usuário aqui',
  code: 'Insira seu código aqui',
  image: 'Chegando ao palácio...',
}

type Params = {
  lessonService: LessonService
  toastProvider: ToastProvider
  starId: Id
}

function createEditorId() {
  return crypto.randomUUID()
}

function isSupportedType(type: string): type is SupportedTextBlockType {
  return SUPPORTED_TEXT_BLOCK_TYPES.includes(type as SupportedTextBlockType)
}

function toEditorItem(textBlock: TextBlockDto): TextBlockEditorItem {
  return {
    id: createEditorId(),
    type: textBlock.type as SupportedTextBlockType,
    content: textBlock.content,
    title: textBlock.title,
    picture: textBlock.picture,
    isRunnable: textBlock.isRunnable,
    audio: textBlock.audio,
  }
}

function toPersistedTextBlock(textBlock: TextBlockEditorItem): TextBlockDto {
  return {
    type: textBlock.type,
    content: textBlock.content,
    title: textBlock.title,
    picture: ['default', 'alert', 'quote', 'image'].includes(textBlock.type)
      ? textBlock.picture
      : undefined,
    isRunnable: textBlock.type === 'code' ? Boolean(textBlock.isRunnable) : undefined,
    audio: textBlock.audio,
  }
}

function serializeTextBlocks(textBlocks: TextBlockDto[]) {
  return JSON.stringify(textBlocks)
}

export function useLessonStoryPage({ lessonService, toastProvider, starId }: Params) {
  const [textBlocks, setTextBlocks] = useState<TextBlockEditorItem[]>([])
  const [baselineTextBlocks, setBaselineTextBlocks] = useState<TextBlockDto[]>([])
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null)
  const [fetchErrorMessage, setFetchErrorMessage] = useState('')
  const [audioVoices, setAudioVoices] = useState<AudioVoiceDto[]>([])
  const [isGeneratingAudiosInBatch, setIsGeneratingAudiosInBatch] = useState(false)
  const [generatingAudioBlockIds, setGeneratingAudioBlockIds] = useState<string[]>([])
  const textBlocksScrollRef = useRef<HTMLDivElement>(null)
  const previewScrollRef = useRef<HTMLDivElement>(null)
  const previousLengthRef = useRef(textBlocks.length)
  const { parseTextBlocksToMdx } = useMdx()
  const { useIsExecuting, useIsSuccessful, useIsFailure, useCanExecute } =
    useActionButtonStore()
  const { setIsExecuting } = useIsExecuting()
  const { setIsSuccessful } = useIsSuccessful()
  const { setIsFailure } = useIsFailure()
  const { setCanExecute } = useCanExecute()

  const textBlocksFetch = useFetch<TextBlockDto[]>({
    key: CACHE.lessonStoryTextBlocks.key,
    dependencies: [starId.value],
    shouldRefetchOnFocus: false,
    fetcher: async () => await lessonService.fetchTextsBlocks(starId),
    onError: setFetchErrorMessage,
  })

  const storyFetch = useFetch<{ story?: string }>({
    key: `${CACHE.lessonStoryTextBlocks.key}-legacy-story`,
    dependencies: [starId.value],
    shouldRefetchOnFocus: false,
    fetcher: async () => await lessonService.fetchStarStory(starId),
    onError: setFetchErrorMessage,
  })

  const audioVoicesFetch = useFetch<AudioVoiceDto[]>({
    key: `${CACHE.lessonStoryTextBlocks.key}-audio-voices`,
    shouldRefetchOnFocus: false,
    fetcher: async () => await lessonService.fetchAudioVoices(),
    onError: setFetchErrorMessage,
  })

  const loadedTextBlocks = textBlocksFetch.data ?? []
  const legacyStory = storyFetch.data?.story ?? ''
  const unsupportedTextBlocks = useMemo(() => {
    return loadedTextBlocks.filter((textBlock) => !isSupportedType(textBlock.type))
  }, [loadedTextBlocks])

  useEffect(() => {
    if (!textBlocksFetch.data || !storyFetch.data) return

    const supportedTextBlocks = textBlocksFetch.data.filter((textBlock) =>
      isSupportedType(textBlock.type),
    )
    const editorItems = supportedTextBlocks.map(toEditorItem)

    setTextBlocks(editorItems)
    setBaselineTextBlocks(supportedTextBlocks)
    setExpandedBlockId(null)
    setFetchErrorMessage('')
    setIsSuccessful(false)
    setIsFailure(false)
    setCanExecute(false)
  }, [
    textBlocksFetch.data,
    storyFetch.data,
    setCanExecute,
    setIsFailure,
    setIsSuccessful,
  ])

  useEffect(() => {
    if (!audioVoicesFetch.data) return
    setAudioVoices(audioVoicesFetch.data)
  }, [audioVoicesFetch.data])

  const persistedTextBlocks = useMemo(() => {
    return textBlocks.map(toPersistedTextBlock)
  }, [textBlocks])

  const areTextBlocksValid = useMemo(() => {
    return persistedTextBlocks.every((textBlock) => {
      if (!isSupportedType(textBlock.type)) return false
      if (textBlock.content.trim().length < 3) return false
      if (
        !['default', 'alert', 'quote', 'image'].includes(textBlock.type) &&
        textBlock.picture
      ) {
        return false
      }
      if (textBlock.type === 'image' && !textBlock.picture) return false
      if (textBlock.type !== 'code' && textBlock.isRunnable !== undefined) return false
      return true
    })
  }, [persistedTextBlocks])

  const hasChanges = useMemo(() => {
    return (
      serializeTextBlocks(persistedTextBlocks) !== serializeTextBlocks(baselineTextBlocks)
    )
  }, [baselineTextBlocks, persistedTextBlocks])
  const baselineSerializedTextBlocks = useMemo(() => {
    return serializeTextBlocks(baselineTextBlocks)
  }, [baselineTextBlocks])

  const isLoading =
    textBlocksFetch.isLoading || storyFetch.isLoading || audioVoicesFetch.isLoading
  const fetchError =
    fetchErrorMessage ||
    textBlocksFetch.error ||
    storyFetch.error ||
    audioVoicesFetch.error ||
    ''
  const isBlockedBecauseOfLegacyStory = Boolean(
    legacyStory && loadedTextBlocks.length === 0,
  )
  const isBlockedBecauseOfUnsupportedBlocks = unsupportedTextBlocks.length > 0
  const isBlocked = isBlockedBecauseOfLegacyStory || isBlockedBecauseOfUnsupportedBlocks
  const blockingReason = isBlockedBecauseOfLegacyStory
    ? 'Esta estrela ainda usa story legado sem texts migrados. Faça a migração antes de usar esta aba.'
    : isBlockedBecauseOfUnsupportedBlocks
      ? `Esta estrela possui blocos legados incompatíveis com a aba (${unsupportedTextBlocks
          .map((textBlock) => textBlock.type)
          .join(', ')}).`
      : ''
  const isSaveDisabled =
    isLoading ||
    Boolean(fetchError) ||
    isBlocked ||
    textBlocks.length === 0 ||
    !areTextBlocksValid ||
    !hasChanges
  const hasAudioPending = useMemo(() => {
    return textBlocks.some((textBlock) => textBlock.audio?.status === 'pending')
  }, [textBlocks])

  useEffect(() => {
    setCanExecute(!isSaveDisabled)
  }, [isSaveDisabled, setCanExecute])

  useEffect(() => {
    if (textBlocks.length > previousLengthRef.current) {
      const timer = setTimeout(() => {
        textBlocksScrollRef.current?.scrollTo({
          top: textBlocksScrollRef.current.scrollHeight,
          behavior: 'smooth',
        })

        previewScrollRef.current?.scrollTo({
          top: previewScrollRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }, 120)

      previousLengthRef.current = textBlocks.length

      return () => clearTimeout(timer)
    }

    previousLengthRef.current = textBlocks.length
  }, [textBlocks.length])

  const sortableItems = useMemo<SortableItem<TextBlockEditorItem>[]>(() => {
    return textBlocks.map((textBlock) => ({ id: textBlock.id, data: textBlock }))
  }, [textBlocks])

  const previewContent = useMemo(() => {
    if (isLoading || isBlocked || textBlocks.length === 0) return ''

    return parseTextBlocksToMdx(persistedTextBlocks.map(TextBlock.create)).join('\n')
  }, [isBlocked, isLoading, parseTextBlocksToMdx, persistedTextBlocks, textBlocks.length])

  function clearActionState() {
    setIsFailure(false)
    setIsSuccessful(false)
  }

  function updateLocalTextBlocks(nextTextBlocks: TextBlockEditorItem[]) {
    setTextBlocks(nextTextBlocks)
    clearActionState()
  }

  function toEditorItemsFromPersisted(
    currentTextBlocks: TextBlockEditorItem[],
    persistedBlocks: TextBlockDto[],
  ) {
    return currentTextBlocks.map((textBlock, index) => ({
      ...textBlock,
      ...persistedBlocks[index],
      type: persistedBlocks[index].type as SupportedTextBlockType,
    }))
  }

  function handleAddBlock(type: SupportedTextBlockType) {
    const newTextBlock: TextBlockEditorItem = {
      id: createEditorId(),
      type,
      content: DEFAULT_BLOCK_CONTENT[type],
      title: undefined,
      picture: type === 'image' ? 'castelo-alien.jpg' : undefined,
      isRunnable: type === 'code' ? false : undefined,
    }

    updateLocalTextBlocks([...textBlocks, newTextBlock])
    setExpandedBlockId(newTextBlock.id)
  }

  function handleExpand(blockId: string) {
    setExpandedBlockId((current) => (current === blockId ? null : blockId))
  }

  function handleRemove(blockId: string) {
    const nextTextBlocks = textBlocks.filter((textBlock) => textBlock.id !== blockId)
    updateLocalTextBlocks(nextTextBlocks)

    if (expandedBlockId === blockId) {
      setExpandedBlockId(nextTextBlocks[0]?.id ?? null)
    }
  }

  function handleContentChange(blockId: string, content: string) {
    updateLocalTextBlocks(
      textBlocks.map((textBlock) =>
        textBlock.id === blockId ? { ...textBlock, content } : textBlock,
      ),
    )
  }

  function handlePictureChange(blockId: string, picture?: string) {
    updateLocalTextBlocks(
      textBlocks.map((textBlock) =>
        textBlock.id === blockId ? { ...textBlock, picture } : textBlock,
      ),
    )
  }

  function handleRunnableChange(blockId: string, isRunnable: boolean) {
    updateLocalTextBlocks(
      textBlocks.map((textBlock) =>
        textBlock.id === blockId ? { ...textBlock, isRunnable } : textBlock,
      ),
    )
  }

  function handleReorder(reorderedTextBlocks: TextBlockEditorItem[]) {
    const isSameOrder =
      reorderedTextBlocks.length === textBlocks.length &&
      reorderedTextBlocks.every(
        (textBlock, index) => textBlock.id === textBlocks[index]?.id,
      )

    if (isSameOrder) return

    updateLocalTextBlocks(reorderedTextBlocks)
  }

  async function handleSaveButtonClick() {
    if (isSaveDisabled) return

    setIsExecuting(true)
    const response = await lessonService.updateTextBlocks(starId, persistedTextBlocks)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      setIsFailure(true)
      setIsExecuting(false)
      return
    }

    const responseTextBlocks = response.body
    setBaselineTextBlocks(responseTextBlocks)
    setTextBlocks((currentTextBlocks) =>
      toEditorItemsFromPersisted(currentTextBlocks, responseTextBlocks),
    )
    setIsSuccessful(true)
    setIsExecuting(false)
  }

  async function syncTextBlocksBeforeAudioAction(): Promise<boolean> {
    if (!hasChanges) return true

    const response = await lessonService.updateTextBlocks(starId, persistedTextBlocks)
    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return false
    }

    setBaselineTextBlocks(response.body)
    setTextBlocks((currentTextBlocks) =>
      toEditorItemsFromPersisted(currentTextBlocks, response.body),
    )
    return true
  }

  function findBlockIndexById(blockId: string): number {
    return textBlocks.findIndex((textBlock) => textBlock.id === blockId)
  }

  function handleAudioVoiceChange(blockId: string, voice: AudioVoiceDto['value']) {
    updateLocalTextBlocks(
      textBlocks.map((textBlock) => {
        if (textBlock.id !== blockId) return textBlock

        return {
          ...textBlock,
          audio: {
            fileName: textBlock.audio?.fileName ?? '',
            status: textBlock.audio?.status ?? 'idle',
            voice,
          },
        }
      }),
    )
  }

  async function handleGenerateTextBlockAudio(blockId: string) {
    const blockIndex = findBlockIndexById(blockId)
    if (blockIndex < 0) return

    setGeneratingAudioBlockIds((current) =>
      current.includes(blockId) ? current : [...current, blockId],
    )

    const shouldContinue = await syncTextBlocksBeforeAudioAction()
    if (!shouldContinue) {
      setGeneratingAudioBlockIds((current) => current.filter((id) => id !== blockId))
      return
    }

    const currentBlock = textBlocks[blockIndex]
    const response = await lessonService.triggerTextBlockAudioGeneration(
      starId,
      Integer.create(blockIndex),
      AudioVoice.create(currentBlock.audio?.voice ?? 'panda'),
    )

    setGeneratingAudioBlockIds((current) => current.filter((id) => id !== blockId))

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    setBaselineTextBlocks(response.body)
    setTextBlocks((currentTextBlocks) =>
      toEditorItemsFromPersisted(currentTextBlocks, response.body),
    )
  }

  async function handleGenerateAllTextBlocksAudios() {
    setIsGeneratingAudiosInBatch(true)
    const shouldContinue = await syncTextBlocksBeforeAudioAction()
    if (!shouldContinue) {
      setIsGeneratingAudiosInBatch(false)
      return
    }

    const response = await lessonService.triggerTextBlocksAudioGenerationInBatch(starId)
    setIsGeneratingAudiosInBatch(false)
    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    setBaselineTextBlocks(response.body)
    setTextBlocks((currentTextBlocks) =>
      toEditorItemsFromPersisted(currentTextBlocks, response.body),
    )
  }

  async function handleCancelTextBlockAudio(blockId: string) {
    const blockIndex = findBlockIndexById(blockId)
    if (blockIndex < 0) return

    const response = await lessonService.cancelTextBlockAudioGeneration(
      starId,
      Integer.create(blockIndex),
    )

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    setBaselineTextBlocks(response.body)
    setTextBlocks((currentTextBlocks) =>
      toEditorItemsFromPersisted(currentTextBlocks, response.body),
    )
  }

  function isGeneratingAudioByBlockId(blockId: string) {
    return generatingAudioBlockIds.includes(blockId)
  }

  const handlePollingUpdate = useCallback(
    (updatedTextBlocks: TextBlockDto[]) => {
      if (serializeTextBlocks(updatedTextBlocks) === baselineSerializedTextBlocks) return

      setBaselineTextBlocks(updatedTextBlocks)
      setTextBlocks((currentTextBlocks) =>
        toEditorItemsFromPersisted(currentTextBlocks, updatedTextBlocks),
      )
    },
    [baselineSerializedTextBlocks, setBaselineTextBlocks, setTextBlocks],
  )

  const handlePollingError = useCallback(
    (message: string) => {
      toastProvider.showError(message)
    },
    [toastProvider],
  )

  const { isPolling: isAudioPolling } = useAudioGenerationPolling({
    starId,
    textBlocks,
    lessonService,
    onUpdate: handlePollingUpdate,
    onError: handlePollingError,
  })

  function handleRetry() {
    setFetchErrorMessage('')
    textBlocksFetch.refetch()
    storyFetch.refetch()
  }

  function handleTextBlocksScrollToTop() {
    textBlocksScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleTextBlocksScrollToBottom() {
    textBlocksScrollRef.current?.scrollTo({
      top: textBlocksScrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  function handlePreviewScrollToTop() {
    previewScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handlePreviewScrollToBottom() {
    previewScrollRef.current?.scrollTo({
      top: previewScrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  return {
    textBlocks,
    textBlocksScrollRef,
    previewScrollRef,
    expandedBlockId,
    sortableItems,
    previewContent,
    isLoading,
    isBlocked,
    blockingReason,
    isEmpty: !isLoading && !fetchError && !isBlocked && textBlocks.length === 0,
    isSaveDisabled,
    errorMessage: fetchError,
    onRetry: handleRetry,
    onAddBlock: handleAddBlock,
    onExpandBlock: handleExpand,
    onRemoveBlock: handleRemove,
    onContentChange: handleContentChange,
    onPictureChange: handlePictureChange,
    onRunnableChange: handleRunnableChange,
    audioVoices,
    hasAudioPending,
    isAudioPolling,
    isGeneratingAudiosInBatch,
    isGeneratingAudioByBlockId,
    onAudioVoiceChange: handleAudioVoiceChange,
    onGenerateAudio: handleGenerateTextBlockAudio,
    onCancelAudio: handleCancelTextBlockAudio,
    onGenerateAudiosInBatch: handleGenerateAllTextBlocksAudios,
    onReorder: handleReorder,
    onSave: handleSaveButtonClick,
    onTextBlocksScrollToTop: handleTextBlocksScrollToTop,
    onTextBlocksScrollToBottom: handleTextBlocksScrollToBottom,
    onPreviewScrollToTop: handlePreviewScrollToTop,
    onPreviewScrollToBottom: handlePreviewScrollToBottom,
  }
}
