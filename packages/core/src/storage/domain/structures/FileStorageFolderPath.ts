import { StringValidation } from '#global/libs/index'
import { Logical } from '#global/domain/structures/Logical'
import type { FileStorageFolderPathValue, StorageFolderName } from '../../types'

export class FileStorageFolderPath {
  private constructor(readonly value: FileStorageFolderPathValue) {}

  static create(value: string): FileStorageFolderPath {
    if (!FileStorageFolderPath.isFileStorageFolderPathValue(value)) throw new Error()

    return new FileStorageFolderPath(value)
  }

  static createAsStory(): FileStorageFolderPath {
    return FileStorageFolderPath.createAsImagesStory()
  }

  static createAsImagesStory(): FileStorageFolderPath {
    return FileStorageFolderPath.create('images/story')
  }

  static createAsAudiosStory(): FileStorageFolderPath {
    return FileStorageFolderPath.create('audios/story')
  }

  static createAsImagesPlanets(): FileStorageFolderPath {
    return FileStorageFolderPath.create('images/planets')
  }

  static createAsPlanets(): FileStorageFolderPath {
    return FileStorageFolderPath.createAsImagesPlanets()
  }

  static createAsImagesRockets(): FileStorageFolderPath {
    return FileStorageFolderPath.create('images/rockets')
  }

  static createAsRockets(): FileStorageFolderPath {
    return FileStorageFolderPath.createAsImagesRockets()
  }

  static createAsImagesAvatars(): FileStorageFolderPath {
    return FileStorageFolderPath.create('images/avatars')
  }

  static createAsAvatars(): FileStorageFolderPath {
    return FileStorageFolderPath.createAsImagesAvatars()
  }

  static createAsImagesAchievements(): FileStorageFolderPath {
    return FileStorageFolderPath.create('images/achievements')
  }

  static createAsAchievements(): FileStorageFolderPath {
    return FileStorageFolderPath.createAsImagesAchievements()
  }

  static createAsImagesRankings(): FileStorageFolderPath {
    return FileStorageFolderPath.create('images/rankings')
  }

  static createAsRankings(): FileStorageFolderPath {
    return FileStorageFolderPath.createAsImagesRankings()
  }

  static createAsImagesInsignias(): FileStorageFolderPath {
    return FileStorageFolderPath.create('images/insignias')
  }

  static createAsInsignias(): FileStorageFolderPath {
    return FileStorageFolderPath.createAsImagesInsignias()
  }

  static createAsDatabaseBackups(): FileStorageFolderPath {
    return FileStorageFolderPath.create('database-backups')
  }

  static createAsFeedbackReports(): FileStorageFolderPath {
    return FileStorageFolderPath.create('images/feedback-reports')
  }

  get isStory(): Logical {
    return Logical.create(this.value === 'images/story' || this.value === 'audios/story')
  }

  get isDatabaseBackups(): Logical {
    return Logical.create(this.value === 'database-backups')
  }

  private static isFileStorageFolderPathValue(
    value: string,
  ): value is FileStorageFolderPathValue {
    new StringValidation(value).oneOf([
      'images/story',
      'audios/story',
      'images/planets',
      'images/rockets',
      'images/avatars',
      'images/achievements',
      'images/rankings',
      'images/insignias',
      'images/feedback-reports',
      'database-backups',
    ])
    return true
  }

  private static isStorageFolderValue(value: string): value is StorageFolderName {
    new StringValidation(value).oneOf([
      'story',
      'rockets',
      'avatars',
      'planets',
      'achievements',
      'rankings',
      'database-backups',
      'feedback-reports',
      'insignias',
    ])

    return true
  }
}

export { FileStorageFolderPath as StorageFolder }
export { FileStorageFolderPath as FileStorageFolder }
