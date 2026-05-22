import { mock, type Mock } from 'ts-jest-mocker'

import { SignedUploadUrl } from '#storage/domain/structures/SignedUploadUrl'
import { FileNameAlreadyExistsError } from '#storage/errors/FileNameAlreadyExistsError'
import type { FileStorageProvider } from '#storage/interfaces/FileStorageProvider'

import { CreateSignedUploadUrl } from '../CreateSignedUploadUrl'

describe('Create Signed Upload Url', () => {
  let storageProvider: Mock<FileStorageProvider>
  let useCase: CreateSignedUploadUrl

  beforeEach(() => {
    storageProvider = mock<FileStorageProvider>()
    storageProvider.findFile.mockImplementation()
    storageProvider.createSignedUploadUrl.mockImplementation()

    useCase = new CreateSignedUploadUrl(storageProvider)
  })

  it('should return the signed upload url dto when the file does not exist', async () => {
    const signedUploadUrl = SignedUploadUrl.create({
      url: 'https://storage.stardust.dev/upload',
      folderPath: 'images/story',
      fileName: 'cover.png',
    })

    storageProvider.findFile.mockResolvedValue(null)
    storageProvider.createSignedUploadUrl.mockResolvedValue(signedUploadUrl)

    const response = await useCase.execute({
      folderPath: 'story',
      fileName: 'cover.png',
    })

    expect(storageProvider.findFile).toHaveBeenCalledTimes(1)
    expect(storageProvider.createSignedUploadUrl).toHaveBeenCalledTimes(1)
    expect(response).toEqual(signedUploadUrl.dto)
  })

  it('should throw when findFile returns an existing file', async () => {
    storageProvider.findFile.mockResolvedValue(new File(['image'], 'cover.png'))

    await expect(
      useCase.execute({
        folderPath: 'story',
        fileName: 'cover.png',
      }),
    ).rejects.toThrow(FileNameAlreadyExistsError)

    expect(storageProvider.createSignedUploadUrl).not.toHaveBeenCalled()
  })

  it('should convert folderPath and fileName to domain objects before calling the provider', async () => {
    storageProvider.findFile.mockResolvedValue(null)
    storageProvider.createSignedUploadUrl.mockResolvedValue(
      SignedUploadUrl.create({
        url: 'https://storage.stardust.dev/upload',
        folderPath: 'images/story',
        fileName: 'hero.png',
      }),
    )

    await useCase.execute({
      folderPath: 'story',
      fileName: 'hero.png',
    })

    const [findFolderPath, findFileName] = storageProvider.findFile.mock.calls[0]
    const [createFolderPath, createFileName] =
      storageProvider.createSignedUploadUrl.mock.calls[0]

    expect(findFolderPath.value).toBe('images/story')
    expect(findFileName.value).toBe('hero.png')
    expect(createFolderPath.value).toBe('images/story')
    expect(createFileName.value).toBe('hero.png')
  })
})
