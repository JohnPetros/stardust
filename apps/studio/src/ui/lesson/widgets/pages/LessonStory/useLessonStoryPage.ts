import { useEffect, useMemo, useRef, useState } from 'react'

import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import { type Id, TextBlock } from '@stardust/core/global/structures'
import type { LessonService } from '@stardust/core/lesson/interfaces'

import { CACHE } from '@/constants'
import { useFetch } from '@/ui/global/hooks/useFetch'
import { useActionButtonStore } from '@/ui/global/stores/ActionButtonStore'
import { useMdx } from '@/ui/global/widgets/components/Mdx/useMdx'
import type { SortableItem } from '@/ui/global/widgets/components/SortableList/types'
import type { SupportedTextBlockType, TextBlockEditorItem } from './types'

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

  const isLoading = textBlocksFetch.isLoading || storyFetch.isLoading
  const fetchError = fetchErrorMessage || textBlocksFetch.error || storyFetch.error || ''
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
      currentTextBlocks.map((textBlock, index) => ({
        ...textBlock,
        ...responseTextBlocks[index],
        type: responseTextBlocks[index].type as SupportedTextBlockType,
      })),
    )
    setIsSuccessful(true)
    setIsExecuting(false)
  }

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
    onReorder: handleReorder,
    onSave: handleSaveButtonClick,
    onTextBlocksScrollToTop: handleTextBlocksScrollToTop,
    onTextBlocksScrollToBottom: handleTextBlocksScrollToBottom,
    onPreviewScrollToTop: handlePreviewScrollToTop,
    onPreviewScrollToBottom: handlePreviewScrollToBottom,
  }
}
