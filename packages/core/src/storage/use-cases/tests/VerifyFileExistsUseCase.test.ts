import { mock, type Mock } from 'ts-jest-mocker'

import { FileStorageFolderPath } from '../../domain/structures/FileStorageFolderPath'
import { FileNotFoundError } from '../../errors/FileNotFoundError'
import type { FileStorageProvider } from '#storage/interfaces/FileStorageProvider'

import { VerifyFileExistsUseCase } from '../VerifyFileExistsUseCase'

describe('VerifyFileExistsUseCase', () => {
  let storageProvider: Mock<FileStorageProvider>
  let useCase: VerifyFileExistsUseCase

  beforeEach(() => {
    storageProvider = mock<FileStorageProvider>()
    useCase = new VerifyFileExistsUseCase(storageProvider)
  })

  it('should return true when the file exists', async () => {
    storageProvider.findFile.mockResolvedValue(new File(['content'], 'report.png'))

    await expect(
      useCase.execute({
        folder: FileStorageFolderPath.createAsFeedbackReports().value,
        fileName: 'report.png',
      }),
    ).resolves.toBe(true)

    expect(storageProvider.findFile).toHaveBeenCalledWith(
      expect.objectContaining({
        value: FileStorageFolderPath.createAsFeedbackReports().value,
      }),
      expect.objectContaining({ value: 'report.png' }),
    )
  })

  it('should throw when the file does not exist', async () => {
    storageProvider.findFile.mockResolvedValue(null)

    await expect(
      useCase.execute({
        folder: FileStorageFolderPath.createAsFeedbackReports().value,
        fileName: 'missing.png',
      }),
    ).rejects.toThrow(FileNotFoundError)
  })
})
