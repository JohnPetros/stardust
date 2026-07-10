import { mock, type Mock } from 'ts-jest-mocker'

import type { Amqp } from '@stardust/core/global/interfaces'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'
import { BackupStorageFilesUseCase } from '@stardust/core/storage/use-cases'

import { BackupStorageFilesJob } from '../BackupStorageFilesJob'

describe('Backup Storage Files Job', () => {
  let amqp: Mock<Amqp>
  let sourceStorageProvider: Mock<FileStorageProvider>
  let dropboxStorageProvider: Mock<FileStorageProvider>
  let googleDriveStorageProvider: Mock<FileStorageProvider>
  let job: BackupStorageFilesJob

  beforeEach(() => {
    amqp = mock<Amqp>()
    sourceStorageProvider = mock<FileStorageProvider>()
    dropboxStorageProvider = mock<FileStorageProvider>()
    googleDriveStorageProvider = mock<FileStorageProvider>()

    amqp.run.mockImplementation(async (callback) => await callback())
    sourceStorageProvider.listFiles.mockResolvedValue({ items: [], count: 0 })
    dropboxStorageProvider.uploadMany.mockImplementation()
    googleDriveStorageProvider.uploadMany.mockImplementation()

    job = new BackupStorageFilesJob(sourceStorageProvider, [
      dropboxStorageProvider,
      googleDriveStorageProvider,
    ])
  })

  it('should execute the use case inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      BackupStorageFilesUseCase.name,
    )
    expect(sourceStorageProvider.listFiles).toHaveBeenCalled()
  })

  it('should propagate failures from the use case', async () => {
    sourceStorageProvider.listFiles.mockRejectedValue(new Error('Listing failed'))

    await expect(job.handle(amqp)).rejects.toThrow('Listing failed')

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      BackupStorageFilesUseCase.name,
    )
  })
})
