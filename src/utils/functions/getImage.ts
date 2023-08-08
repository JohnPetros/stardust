type Folder = 'avatars' | 'rockets' | 'rankings' | 'planets' | 'achievements' | 'texts'

export function getImage(folder: Folder, resource: string) {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/${folder}/${resource}`
}
