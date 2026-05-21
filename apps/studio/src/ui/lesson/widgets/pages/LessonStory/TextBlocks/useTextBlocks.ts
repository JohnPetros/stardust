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

const STORAGE_ITEMS_PER_PAGE = OrdinalNumber.create(10)

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

    async function checkAudioFilesInStorage() {
      const filesEntries = await Promise.all(
        audioFileNames.map(async (fileName) => {
          const response = await storageService.listFiles({
            folder: FileStorageFolderPath.createAsAudiosStory(),
            search: Text.create(fileName),
            page: OrdinalNumber.create(1),
            itemsPerPage: STORAGE_ITEMS_PER_PAGE,
          })

          if (response.isFailure) return [fileName, false] as const

          return [fileName, response.body.items.includes(fileName)] as const
        }),
      )

      if (!isMounted) return

      console.log(Object.fromEntries(filesEntries))

      setAudioFilesInStorage(Object.fromEntries(filesEntries) as Record<string, boolean>)
    }

    checkAudioFilesInStorage()

    return () => {
      isMounted = false
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
