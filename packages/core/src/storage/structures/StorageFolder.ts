import { StringValidation } from '#global/libs/index'
import { Logical } from '#global/domain/structures/Logical'

type StorageFolderValue = 'story' | 'database-backups'

export class StorageFolder {
  private constructor(readonly value: StorageFolderValue) {}

  static create(value?: string) {
    if (!value) return new StorageFolder('story')

    if (!StorageFolder.isStorageFolderValue(value)) throw new Error()

    return new StorageFolder(value)
  }

  static createAsStory() {
    return StorageFolder.create('story')
  }

  static createAsDatabaseBackups() {
    return StorageFolder.create('database-backups')
  }

  private static isStorageFolderValue(value: string): value is StorageFolderValue {
    new StringValidation(value).oneOf(['story', 'database-backups'])
    return true
  }

  get isStory(): Logical {
    return Logical.create(this.value === 'story')
  }

  get isDatabaseBackups(): Logical {
    return Logical.create(this.value === 'database-backups')
  }
}
