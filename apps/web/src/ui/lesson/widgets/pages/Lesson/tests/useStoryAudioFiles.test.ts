import { renderHook, waitFor } from '@testing-library/react'

import { PaginationResponse, RestResponse } from '@stardust/core/global/responses'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'
import { TextBlocksFaker } from '@stardust/core/lesson/entities/fakers'

import { useStoryAudioFiles } from '../useStoryAudioFiles'

describe('useStoryAudioFiles', () => {
  const storageService = {
    listFiles: jest.fn(),
  } as unknown as jest.Mocked<StorageService>

  const Hook = (textBlocksDto = TextBlocksFaker.fakeManyDto(2, { type: 'default' })) =>
    renderHook(() => useStoryAudioFiles({ storageService, textBlocksDto }))

  function makeTextBlockDto(fileName?: string, status: 'pending' | 'done' = 'done') {
    return {
      ...TextBlocksFaker.fakeDto({ type: 'default' }),
      audio: fileName
        ? {
            fileName,
            status,
            voice: 'panda' as const,
          }
        : undefined,
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should skip storage lookup when there are no done audios with file name', () => {
    const { result } = Hook([
      makeTextBlockDto('pending.wav', 'pending'),
      TextBlocksFaker.fakeDto({ type: 'quote' }),
    ])

    expect(storageService.listFiles).not.toHaveBeenCalled()
    expect(result.current.audioFiles).toEqual({})
    expect(result.current.isLoading).toBe(false)
  })

  it('should check each done audio by its file name inside audios/story', async () => {
    const firstFileName = 'intro.wav'
    const secondFileName = 'quote.wav'

    storageService.listFiles
      .mockResolvedValueOnce(
        new RestResponse({
          body: new PaginationResponse({
            items: [firstFileName],
            totalItemsCount: 1,
            itemsPerPage: 1000,
            page: 1,
          }),
        }),
      )
      .mockResolvedValueOnce(
        new RestResponse({
          body: new PaginationResponse({
            items: [],
            totalItemsCount: 0,
            itemsPerPage: 1000,
            page: 1,
          }),
        }),
      )

    const { result } = Hook([
      makeTextBlockDto(firstFileName),
      {
        ...TextBlocksFaker.fakeDto({ type: 'quote' }),
        audio: { fileName: secondFileName, status: 'done', voice: 'shark' as const },
      },
    ])

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(storageService.listFiles).toHaveBeenCalledTimes(2)
    expect(storageService.listFiles).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        folder: expect.objectContaining({
          value: FileStorageFolderPath.createAsAudiosStory().value,
        }),
        search: expect.objectContaining({ value: firstFileName }),
      }),
    )
    expect(storageService.listFiles).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        folder: expect.objectContaining({
          value: FileStorageFolderPath.createAsAudiosStory().value,
        }),
        search: expect.objectContaining({ value: secondFileName }),
      }),
    )
    expect(result.current.audioFiles).toEqual({
      [firstFileName]: true,
      [secondFileName]: false,
    })
  })

  it('should fallback to false when storage lookup fails', async () => {
    const fileName = 'missing.wav'

    storageService.listFiles.mockResolvedValueOnce(
      new RestResponse({ statusCode: 500, errorMessage: 'Storage failed' }),
    )

    const { result } = Hook([makeTextBlockDto(fileName)])

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.audioFiles).toEqual({ [fileName]: false })
  })
})
