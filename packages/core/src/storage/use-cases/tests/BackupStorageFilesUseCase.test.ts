import { mock, type Mock } from 'ts-jest-mocker'

import { AppError } from '#global/domain/errors/index'
import { FileStorageFolderPath } from '#storage/domain/structures/FileStorageFolderPath'
import type { FileStorageProvider } from '#storage/interfaces/FileStorageProvider'
import { BackupStorageFilesUseCase } from '../BackupStorageFilesUseCase'

const makeFile = (name: string) =>
  new File(['content'], name, { type: 'application/octet-stream' })

describe('Backup Storage Files Use Case', () => {
  let sourceStorageProvider: Mock<FileStorageProvider>
  let dropboxStorageProvider: Mock<FileStorageProvider>
  let secondaryStorageProvider: Mock<FileStorageProvider>
  let useCase: BackupStorageFilesUseCase

  beforeEach(() => {
    sourceStorageProvider = mock<FileStorageProvider>()
    dropboxStorageProvider = mock<FileStorageProvider>()
    secondaryStorageProvider = mock<FileStorageProvider>()

    sourceStorageProvider.listFiles.mockImplementation()
    dropboxStorageProvider.uploadMany.mockImplementation()
    secondaryStorageProvider.uploadMany.mockImplementation()

    useCase = new BackupStorageFilesUseCase(sourceStorageProvider, [
      dropboxStorageProvider,
      secondaryStorageProvider,
    ])
  })

  it('should list files with pagination and upload them to all destinations', async () => {
    const firstPageFiles = Array.from({ length: 100 }, (_, index) =>
      makeFile(`page-one-${index}.png`),
    )
    const secondPageFiles = [makeFile('second-page.png')]

    sourceStorageProvider.listFiles
      .mockResolvedValueOnce({ items: firstPageFiles, count: 101 })
      .mockResolvedValueOnce({ items: secondPageFiles, count: 101 })
      .mockResolvedValue({ items: [], count: 0 })

    await useCase.execute()

    expect(sourceStorageProvider.listFiles).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        folder: FileStorageFolderPath.createAsImagesStory(),
        page: expect.objectContaining({ value: 1 }),
        itemsPerPage: expect.objectContaining({ value: 100 }),
      }),
    )
    expect(sourceStorageProvider.listFiles).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        folder: FileStorageFolderPath.createAsImagesStory(),
        page: expect.objectContaining({ value: 2 }),
        itemsPerPage: expect.objectContaining({ value: 100 }),
      }),
    )
    expect(dropboxStorageProvider.uploadMany).toHaveBeenCalledWith(
      FileStorageFolderPath.createAsImagesStory(),
      [...firstPageFiles, ...secondPageFiles],
    )
    expect(secondaryStorageProvider.uploadMany).toHaveBeenCalledWith(
      FileStorageFolderPath.createAsImagesStory(),
      [...firstPageFiles, ...secondPageFiles],
    )
  })

  it('should keep paginating when provider count is capped at the first page size', async () => {
    const firstPageFiles = Array.from({ length: 100 }, (_, index) =>
      makeFile(`capped-${index}.png`),
    )
    const secondPageFiles = [makeFile('after-cap.png')]

    sourceStorageProvider.listFiles
      .mockResolvedValueOnce({ items: firstPageFiles, count: 100 })
      .mockResolvedValueOnce({ items: secondPageFiles, count: 100 })
      .mockResolvedValue({ items: [], count: 0 })

    await useCase.execute()

    expect(sourceStorageProvider.listFiles).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        folder: FileStorageFolderPath.createAsImagesStory(),
        page: expect.objectContaining({ value: 2 }),
      }),
    )
    expect(dropboxStorageProvider.uploadMany).toHaveBeenCalledWith(
      FileStorageFolderPath.createAsImagesStory(),
      [...firstPageFiles, ...secondPageFiles],
    )
  })

  it('should continue uploading to the other destination when one destination fails', async () => {
    const files = [makeFile('story.wav')]

    sourceStorageProvider.listFiles
      .mockResolvedValueOnce({ items: files, count: 1 })
      .mockResolvedValue({ items: [], count: 0 })
    dropboxStorageProvider.uploadMany.mockRejectedValueOnce(new Error('Dropbox failed'))
    secondaryStorageProvider.uploadMany.mockResolvedValueOnce(files)

    await expect(useCase.execute()).rejects.toThrow(AppError)

    expect(dropboxStorageProvider.uploadMany).toHaveBeenCalledWith(
      FileStorageFolderPath.createAsImagesStory(),
      files,
    )
    expect(secondaryStorageProvider.uploadMany).toHaveBeenCalledWith(
      FileStorageFolderPath.createAsImagesStory(),
      files,
    )
  })

  it('should continue processing other folders when one folder fails to list', async () => {
    const storyFiles = [makeFile('story.png')]

    sourceStorageProvider.listFiles
      .mockRejectedValueOnce(new Error('Supabase unavailable'))
      .mockResolvedValueOnce({ items: storyFiles, count: 1 })
      .mockResolvedValue({ items: [], count: 0 })
    dropboxStorageProvider.uploadMany.mockResolvedValue(storyFiles)
    secondaryStorageProvider.uploadMany.mockResolvedValue(storyFiles)

    await expect(useCase.execute()).rejects.toThrow('Supabase unavailable')

    expect(dropboxStorageProvider.uploadMany).toHaveBeenCalledWith(
      FileStorageFolderPath.createAsAudiosStory(),
      storyFiles,
    )
    expect(secondaryStorageProvider.uploadMany).toHaveBeenCalledWith(
      FileStorageFolderPath.createAsAudiosStory(),
      storyFiles,
    )
  })

  it('should skip destination uploads when a folder has no files', async () => {
    sourceStorageProvider.listFiles.mockResolvedValue({ items: [], count: 0 })

    await expect(useCase.execute()).resolves.toBeUndefined()

    expect(dropboxStorageProvider.uploadMany).not.toHaveBeenCalled()
    expect(secondaryStorageProvider.uploadMany).not.toHaveBeenCalled()
  })

  it('should not include database backups folder in file storage backup', async () => {
    sourceStorageProvider.listFiles.mockResolvedValue({ items: [], count: 0 })

    await useCase.execute()

    expect(sourceStorageProvider.listFiles).not.toHaveBeenCalledWith(
      expect.objectContaining({
        folder: FileStorageFolderPath.createAsDatabaseBackups(),
      }),
    )
  })
})
