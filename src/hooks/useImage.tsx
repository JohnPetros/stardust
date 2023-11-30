import { Folder } from '@/@types/folder'

export function useImage(folder: Folder, resource: string | undefined) {
  if (folder && resource)
    return `${process.env.NEXT_PUBLIC_CDN_URL}/${folder}/${resource}`
}
