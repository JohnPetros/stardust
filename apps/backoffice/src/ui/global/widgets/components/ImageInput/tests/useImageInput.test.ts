import { act, renderHook } from '@testing-library/react'
import { mock, type Mock } from 'ts-jest-mocker'

import type { ToastProvider } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import type {
  SignedFileStorageProvider,
  StorageService,
} from '@stardust/core/storage/interfaces'
import type { SignedUploadUrlDto } from '@stardust/core/storage/structures/dtos'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

import { useImageInput } from '../useImageInput'

jest.mock('@/ui/global/hooks/useToastProvider', () => ({
  useToastProvider: jest.fn(),
}))

describe('useImageInput', () => {
  let storageService: Mock<StorageService>
  let signedFileStorageProvider: Mock<SignedFileStorageProvider>
  let toastProvider: Mock<ToastProvider>
  let dialogRef: { current: { close: jest.Mock } | null }
  let onSubmit: jest.Mock

  const Hook = () =>
    renderHook(() =>
      useImageInput({
        storageService,
        signedFileStorageProvider,
        folder: FileStorageFolderPath.createAsStory(),
        dialogRef: dialogRef as never,
        onSubmit,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()

    storageService = mock<StorageService>()
    signedFileStorageProvider = mock<SignedFileStorageProvider>()
    toastProvider = mock<ToastProvider>()
    dialogRef = { current: { close: jest.fn() } }
    onSubmit = jest.fn()

    toastProvider.showError = jest.fn()
    toastProvider.showSuccess = jest.fn()

    const { useToastProvider } = jest.requireMock('@/ui/global/hooks/useToastProvider')
    useToastProvider.mockReturnValue(toastProvider)
  })

  it('should upload the file successfully and call onSubmit with the stored filename', async () => {
    const file = new File(['image'], 'cover.png', { type: 'image/png' })

    storageService.createSignedUploadUrl.mockResolvedValue(
      new RestResponse({
        statusCode: 200,
        body: {
          url: 'https://storage.example/signed-url',
          folderPath: 'images/story',
          fileName: 'stored-cover.png',
        },
      }),
    )
    signedFileStorageProvider.uploadFile.mockResolvedValue()

    const { result } = Hook()

    act(() => {
      result.current.handleImageFileChange(file)
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(storageService.createSignedUploadUrl).toHaveBeenCalledWith(
      FileStorageFolderPath.createAsStory(),
      expect.objectContaining({ value: 'cover.png' }),
    )
    expect(signedFileStorageProvider.uploadFile).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: expect.objectContaining({ value: 'stored-cover.png' }),
      }),
      file,
    )
    expect(dialogRef.current?.close).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith('stored-cover.png')
    expect(result.current.imageFile).toBeNull()
    expect(result.current.imageName).toBe('')
    expect(result.current.imageNameError).toBe('')
  })

  it('should set image name validation error when the file name is invalid', async () => {
    const file = new File(['image'], 'cover.png', { type: 'image/png' })

    const { result } = Hook()

    act(() => {
      result.current.handleImageFileChange(file)
      result.current.handleImageNameChange('invalid-name.txt')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(storageService.createSignedUploadUrl).not.toHaveBeenCalled()
    expect(signedFileStorageProvider.uploadFile).not.toHaveBeenCalled()
    expect(result.current.imageNameError).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should show toast when upload fails and keep the current input state', async () => {
    const file = new File(['image'], 'cover.png', { type: 'image/png' })
    let resolveUpload: (value: RestResponse<SignedUploadUrlDto>) => void = () => {}

    storageService.createSignedUploadUrl.mockReturnValue(
      new Promise((resolve) => {
        resolveUpload = resolve
      }),
    )

    const { result } = Hook()

    act(() => {
      result.current.handleImageFileChange(file)
    })

    await act(async () => {
      void result.current.handleSubmit()
      await Promise.resolve()
    })

    expect(result.current.isSubmitting).toBe(true)

    await act(async () => {
      resolveUpload(
        new RestResponse({
          statusCode: 500,
          errorMessage: 'Upload falhou',
        }),
      )
      await Promise.resolve()
    })

    expect(toastProvider.showError).toHaveBeenCalledWith('Upload falhou')
    expect(signedFileStorageProvider.uploadFile).not.toHaveBeenCalled()
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.imageFile).toBe(file)
    expect(result.current.imageName).toBe('cover.png')
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
