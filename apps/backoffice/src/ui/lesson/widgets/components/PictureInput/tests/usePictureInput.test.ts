import { act, renderHook } from '@testing-library/react'

import { Image } from '@stardust/core/global/structures'
import type { StorageService } from '@stardust/core/storage/interfaces'

import { usePictureInput } from '../usePictureInput'

const mockPaginatedFetchReturn = {
  data: [] as string[],
  isFetching: false,
  isFetchingNextPage: false,
  hasNextPage: false,
  nextPage: jest.fn(),
  refetch: jest.fn(),
}

jest.mock('@/ui/global/hooks/usePaginatedFetch', () => ({
  usePaginatedFetch: jest.fn(() => mockPaginatedFetchReturn),
}))

describe('usePictureInput', () => {
  let storageService: StorageService
  let dialogRef: { current: { close: jest.Mock } | null }
  let onChange: jest.Mock
  let onClear: jest.Mock

  const Hook = (params?: { defaultPicture?: Image; isOptional?: boolean }) =>
    renderHook(() =>
      usePictureInput({
        storageService,
        dialogRef: dialogRef as never,
        onChange,
        onClear,
        ...params,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()

    storageService = {} as StorageService
    dialogRef = { current: { close: jest.fn() } }
    onChange = jest.fn()
    onClear = jest.fn()

    mockPaginatedFetchReturn.data = []
    mockPaginatedFetchReturn.isFetching = false
    mockPaginatedFetchReturn.isFetchingNextPage = false
    mockPaginatedFetchReturn.hasNextPage = false
    mockPaginatedFetchReturn.nextPage = jest.fn()
    mockPaginatedFetchReturn.refetch = jest.fn()
  })

  it('should automatically select the uploaded image and refetch the list', () => {
    const { result } = Hook()

    act(() => {
      result.current.handleImageSubmit('uploaded-picture.jpg')
    })

    expect(result.current.selectedImage?.value).toBe('uploaded-picture.jpg')
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'uploaded-picture.jpg' }),
    )
    expect(mockPaginatedFetchReturn.refetch).toHaveBeenCalledTimes(1)
    expect(dialogRef.current?.close).toHaveBeenCalledTimes(1)
  })

  it('should fallback to panda.jpg when removing the selected image and refetch the list', () => {
    const { result } = Hook({
      defaultPicture: Image.create('uploaded-picture.jpg'),
    })

    act(() => {
      result.current.handlePictureCardRemove('uploaded-picture.jpg')
    })

    expect(result.current.selectedImage?.value).toBe('panda.jpg')
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ value: 'panda.jpg' }))
    expect(mockPaginatedFetchReturn.refetch).toHaveBeenCalledTimes(1)
  })
})
