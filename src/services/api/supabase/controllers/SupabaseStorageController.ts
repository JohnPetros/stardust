import {
  type Folder,
  type IStorageController,
} from '../../interfaces/IStorageController'
import type { Supabase } from '../types/Supabase'

export const SupabaseStorageController = (
  supabase: Supabase
): IStorageController => {
  const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL

  if (!CDN_URL) throw new Error('CDN url must be provided')

  return {
    getImage(folder: Folder, resource: string) {
      return `${process.env.NEXT_PUBLIC_CDN_URL}/${folder}/${resource}`
    },
  }
}
