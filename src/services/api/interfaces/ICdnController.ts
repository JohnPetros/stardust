export type Folder =
  | 'avatars'
  | 'rockets'
  | 'rankings'
  | 'planets'
  | 'achievements'
  | 'theory'

export interface ICdnController {
  getImage(folder: Folder, resource: string): string
}
