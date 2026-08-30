import type { DatabaseProvider } from '@stardust/core/global/interfaces'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'
import { BackupDatabaseUseCase } from '@stardust/core/storage/use-cases'
import { mock, type Mock } from 'ts-jest-mocker'

import { BackupDatabaseJob } from '../BackupDatabaseJob'

describe('BackupDatabaseJob', () => {
  let databaseProvider: Mock<DatabaseProvider>
  let storageProvider: Mock<FileStorageProvider>
  let execute: jest.SpyInstance
  let job: BackupDatabaseJob

  beforeEach(() => {
    databaseProvider = mock<DatabaseProvider>()
    storageProvider = mock<FileStorageProvider>()
    job = new BackupDatabaseJob(databaseProvider, storageProvider)
    execute = jest.spyOn(BackupDatabaseUseCase.prototype, 'execute').mockResolvedValue()
  })

  afterEach(() => jest.restoreAllMocks())

  it('executes the database backup use case', async () => {
    await job.handle()

    expect(execute).toHaveBeenCalledTimes(1)
  })

  it('propagates backup failures', async () => {
    const failure = new Error('Database backup failed')
    execute.mockRejectedValue(failure)

    await expect(job.handle()).rejects.toThrow(failure)
  })
})
