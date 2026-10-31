import { useEffect, useMemo, useState } from 'react'

import { OrdinalNumber, Text } from '@stardust/core/global/structures'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

import type { SortableItem } from '@/ui/global/widgets/components/SortableList/types'
import type { TextBlockEditorItem } from '../types'

type Params = {
  textBlocks: TextBlockEditorItem[]
  sortableItems: SortableItem<TextBlockEditorItem>[]
  isGeneratingAudiosInBatch: boolean
  isGeneratingAudioByBlockId: (blockId: string) => boolean
  storageService: StorageService
}

const STORAGE_ITEMS_PER_PAGE = OrdinalNumber.create(1000)

export function useTextBlocks({
  textBlocks,
  sortableItems,
  isGeneratingAudiosInBatch,
  isGeneratingAudioByBlockId,
  storageService,
}: Params) {
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [search, setSearch] = useState('')
  const [audioFilesInStorage, setAudioFilesInStorage] = useState<Record<string, boolean>>(
    {},
  )

  const filteredSortableItems = useMemo(() => {
    if (!search.trim()) return sortableItems

    const normalizedSearch = search.toLowerCase().trim()

    return sortableItems.filter(({ data }) => {
      const searchable =
        `${data.type} ${data.content} ${data.picture ?? ''}`.toLowerCase()
      return searchable.includes(normalizedSearch)
    })
  }, [search, sortableItems])

  const hasAudioGenerationInProgress = useMemo(() => {
    return (
      isGeneratingAudiosInBatch ||
      textBlocks.some(
        (textBlock) =>
          isGeneratingAudioByBlockId(textBlock.id) ||
          textBlock.audio?.status === 'pending',
      )
    )
  }, [isGeneratingAudiosInBatch, isGeneratingAudioByBlockId, textBlocks])

  useEffect(() => {
    const audioFileNames = Array.from(
      new Set(
        textBlocks
          .map((textBlock) => textBlock.audio?.fileName?.trim())
          .filter((fileName) => Boolean(fileName)),
      ),
    ) as string[]

    if (audioFileNames.length === 0) {
      setAudioFilesInStorage({})
      return
    }

    let isMounted = true
    let retryTimeout: ReturnType<typeof setTimeout> | undefined

    async function checkAudioFilesInStorage() {
      const responses = await Promise.all(
        audioFileNames.map(async (fileName) => ({
          fileName,
          response: await storageService.listFiles({
            folder: FileStorageFolderPath.createAsAudiosStory(),
            search: Text.create(fileName),
            page: OrdinalNumber.create(1),
            itemsPerPage: STORAGE_ITEMS_PER_PAGE,
          }),
        })),
      )

      if (!isMounted) return

      const filesEntries = responses.map(({ fileName, response }) => {
        if (response.isFailure) return [fileName, false]

        return [fileName, response.body.items.includes(fileName)]
      })

      const nextAudioFilesInStorage = Object.fromEntries(filesEntries) as Record<
        string,
        boolean
      >

      setAudioFilesInStorage(nextAudioFilesInStorage)

      const hasMissingAudioFiles = audioFileNames.some(
        (fileName) => !nextAudioFilesInStorage[fileName],
      )

      if (hasMissingAudioFiles) {
        retryTimeout = setTimeout(checkAudioFilesInStorage, 3000)
      }
    }

    checkAudioFilesInStorage()

    return () => {
      isMounted = false
      if (retryTimeout) clearTimeout(retryTimeout)
    }
  }, [storageService, textBlocks])

  function handleSearchToggle() {
    setIsSearchVisible((current) => {
      const next = !current
      if (!next) setSearch('')
      return next
    })
  }

  function hasStoredAudioFile(blockId: string) {
    const fileName = textBlocks
      .find((textBlock) => textBlock.id === blockId)
      ?.audio?.fileName?.trim()

    if (!fileName) return false

    return audioFilesInStorage[fileName] ?? false
  }

  return {
    search,
    isSearchVisible,
    filteredSortableItems,
    hasAudioGenerationInProgress,
    hasStoredAudioFile,
    setSearch,
    handleSearchToggle,
  }
}
