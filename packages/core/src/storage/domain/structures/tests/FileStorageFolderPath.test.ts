import { FileStorageFolderPath } from '../FileStorageFolderPath'

describe('FileStorageFolderPath Structure', () => {
  it('should create the galaxies lotties folder path', () => {
    expect(FileStorageFolderPath.createAsLottiesGalaxies().value).toBe('lotties/galaxies')
    expect(FileStorageFolderPath.create('lotties/galaxies').value).toBe(
      'lotties/galaxies',
    )
  })

  it('should keep creating the existing folder paths', () => {
    expect(FileStorageFolderPath.createAsImagesRockets().value).toBe('images/rockets')
    expect(FileStorageFolderPath.createAsDatabaseBackups().value).toBe('database-backups')
  })

  it('should resolve legacy folder names to the current folder paths', () => {
    expect(FileStorageFolderPath.create('rockets').value).toBe('images/rockets')
  })

  it('should throw when the folder path is not valid', () => {
    expect(() => FileStorageFolderPath.create('lotties/unknown')).toThrow()
    expect(() => FileStorageFolderPath.create('galaxies')).toThrow()
  })
})
