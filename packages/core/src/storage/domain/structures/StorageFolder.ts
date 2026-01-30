import { StringValidation } from '#global/libs/index'
import { Logical } from '#global/domain/structures/Logical'
import type { StorageFolderName } from '../../types'

export class StorageFolder {
  private constructor(readonly name: StorageFolderName) {}

  static create(name?: string) {
    if (!name) return new StorageFolder('story')

    if (!StorageFolder.isStorageFolderName(name)) throw new Error()

    return new StorageFolder(name)
  }

  static createAsStory() {
    return StorageFolder.create('story')
  }

  static createAsPlanets() {
    return StorageFolder.create('planets')
  }

  static createAsRockets() {
    return StorageFolder.create('rockets')
  }

  static createAsAvatars() {
    return StorageFolder.create('avatars')
  }

  static createAsAchievements() {
    return StorageFolder.create('achievements')
  }

  static createAsRankings() {
    return StorageFolder.create('rankings')
  }

  static createAsDatabaseBackups() {
    return StorageFolder.create('database-backups')
  }

  static createAsInsignias() {
    return StorageFolder.create('insignias')
  }

  static createAsFeedbackReports() {
    return StorageFolder.create('feedback-reports')
  }

  private static isStorageFolderName(name: string): name is StorageFolderName {
    new StringValidation(name).oneOf([
      'story',
      'database-backups',
      'avatars',
      'rockets',
      'rankings',
      'planets',
      'achievements',
      'insignias',
      'feedback-reports',
    ])
    return true
  }

  get isStory(): Logical {
    return Logical.create(this.name === 'story')
  }

  get isDatabaseBackups(): Logical {
    return Logical.create(this.name === 'database-backups')
  }
}
