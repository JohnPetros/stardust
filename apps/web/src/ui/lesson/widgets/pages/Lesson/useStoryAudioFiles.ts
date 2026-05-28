import { useEffect, useState } from 'react'

import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import { OrdinalNumber, Text } from '@stardust/core/global/structures'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

type Params = {
  storageService: StorageService
  textBlocksDto: TextBlockDto[]
}

type Response = {
  audioFiles: Record<string, boolean>
  isLoading: boolean
}

const STORAGE_ITEMS_PER_PAGE = OrdinalNumber.create(1000)

function getExpectedAudioFileNames(textBlocksDto: TextBlockDto[]) {
  return Array.from(
    new Set(
      textBlocksDto
        .filter((textBlockDto) => textBlockDto.audio?.status === 'done')
        .map((textBlockDto) => textBlockDto.audio?.fileName?.trim())
        .filter((fileName) => Boolean(fileName)),
    ),
  ) as string[]
}

export function useStoryAudioFiles({ storageService, textBlocksDto }: Params): Response {
  const [audioFiles, setAudioFiles] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(
    () => getExpectedAudioFileNames(textBlocksDto).length > 0,
  )

  useEffect(() => {
    const audioFileNames = getExpectedAudioFileNames(textBlocksDto)

    if (audioFileNames.length === 0) {
      setAudioFiles({})
      setIsLoading(false)
      return
    }

    let isMounted = true

    async function loadStoryAudioFiles() {
      setIsLoading(true)

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

      setAudioFiles(
        Object.fromEntries(
          responses.map(({ fileName, response }) => [
            fileName,
            !response.isFailure && response.body.items.includes(fileName),
          ]),
        ) as Record<string, boolean>,
      )
      setIsLoading(false)
    }

    loadStoryAudioFiles()

    return () => {
      isMounted = false
    }
  }, [storageService, textBlocksDto])

  return {
    audioFiles,
    isLoading,
  }
}
