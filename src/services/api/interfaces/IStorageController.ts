export type Folder =
  | 'avatars'
  | 'rockets'
  | 'rankings'
  | 'planets'
  | 'achievements'
  | 'theory'

export interface IStorageController {
  getImage(folder: Folder, resource: string): string
}
