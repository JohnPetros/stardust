import { StringValidation } from '#global/libs/index'
import { Logical } from '#global/domain/structures/Logical'
import type { FileStorageFolderPathValue } from '../../types'

export class FileStorageFolderPath {
  private constructor(readonly value: FileStorageFolderPathValue) {}

  static create(value: string): FileStorageFolderPath {
    const resolvedValue = FileStorageFolderPath.resolveLegacyFolderPath(value)

    if (!FileStorageFolderPath.isFileStorageFolderPathValue(resolvedValue))
      throw new Error()

    return new FileStorageFolderPath(resolvedValue)
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

  static createAsImagesAvatars(): FileStorageFolderPath {
    return FileStorageFolderPath.create('images/avatars')
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

  static createAsImagesInsignias(): FileStorageFolderPath {
    return FileStorageFolderPath.create('images/insignias')
  }

  static createAsInsignias(): FileStorageFolderPath {
    return FileStorageFolderPath.createAsImagesInsignias()
  }

  static createAsDatabaseBackups(): FileStorageFolderPath {
    return FileStorageFolderPath.create('database-backups')
  }

  static createAsImagesFeedbackReports(): FileStorageFolderPath {
    return FileStorageFolderPath.create('images/feedback-reports')
  }

  static createAsFeedbackReports(): FileStorageFolderPath {
    return FileStorageFolderPath.createAsImagesFeedbackReports()
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
    new StringValidation(value)
      .oneOf([
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
      .validate()
    return true
  }

  private static resolveLegacyFolderPath(value: string): string {
    const legacyFolderMap: Record<string, FileStorageFolderPathValue> = {
      story: 'images/story',
      planets: 'images/planets',
      rockets: 'images/rockets',
      avatars: 'images/avatars',
      achievements: 'images/achievements',
      rankings: 'images/rankings',
      insignias: 'images/insignias',
      'feedback-reports': 'images/feedback-reports',
      'database-backups': 'database-backups',
    }

    return legacyFolderMap[value] ?? value
  }
}
