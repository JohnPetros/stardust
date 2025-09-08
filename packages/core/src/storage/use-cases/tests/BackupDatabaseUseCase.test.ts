import { mock, type Mock } from 'ts-jest-mocker'

import type { DatabaseProvider } from '#global/interfaces/provision/DatabaseProvider'
import type { StorageProvider } from '#storage/interfaces/StorageProvider'
import { StorageFolder } from '#storage/structures/StorageFolder'
import { BackupDatabaseUseCase } from '../BackupDatabaseUseCase'

describe('Backup Database Use Case', () => {
  let databaseProvider: Mock<DatabaseProvider>
  let storageProvider: Mock<StorageProvider>
  let useCase: BackupDatabaseUseCase

  beforeEach(() => {
    databaseProvider = mock<DatabaseProvider>()
    storageProvider = mock<StorageProvider>()
    databaseProvider.backup.mockImplementation()
    storageProvider.upload.mockImplementation()
    useCase = new BackupDatabaseUseCase(databaseProvider, storageProvider)
  })

  it('should create a backup file using the database provider', async () => {
    const backupFile = new File(['backup content'], 'backup.dump')
    databaseProvider.backup.mockResolvedValue(backupFile)

    await useCase.execute()

    expect(databaseProvider.backup).toHaveBeenCalledTimes(1)
  })

  it('should upload the backup file to the storage provider', async () => {
    const backupFile = new File(['backup content'], 'backup.dump')
    databaseProvider.backup.mockResolvedValue(backupFile)
    storageProvider.upload.mockResolvedValue(backupFile)

    await useCase.execute()

    expect(storageProvider.upload).toHaveBeenCalledWith(
      StorageFolder.createAsDatabaseBackups(),
      backupFile,
    )
  })

  it('should execute the complete backup process successfully', async () => {
    const backupFile = new File(['backup content'], 'backup.dump')
    databaseProvider.backup.mockResolvedValue(backupFile)
    storageProvider.upload.mockResolvedValue(backupFile)

    await expect(useCase.execute()).resolves.not.toThrow()

    expect(databaseProvider.backup).toHaveBeenCalledTimes(1)
    expect(storageProvider.upload).toHaveBeenCalledTimes(1)
    expect(storageProvider.upload).toHaveBeenCalledWith(
      StorageFolder.createAsDatabaseBackups(),
      backupFile,
    )
  })

  it('should propagate errors from the database provider', async () => {
    const error = new Error('Database backup failed')
    databaseProvider.backup.mockRejectedValue(error)

    await expect(useCase.execute()).rejects.toThrow('Database backup failed')
    expect(storageProvider.upload).not.toHaveBeenCalled()
  })

  it('should propagate errors from the storage provider', async () => {
    const backupFile = new File(['backup content'], 'backup.dump')
    const error = new Error('Storage upload failed')

    databaseProvider.backup.mockResolvedValue(backupFile)
    storageProvider.upload.mockRejectedValue(error)

    await expect(useCase.execute()).rejects.toThrow('Storage upload failed')
    expect(databaseProvider.backup).toHaveBeenCalledTimes(1)
  })
})
