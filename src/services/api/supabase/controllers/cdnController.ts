import type { Folder, ICdnController } from '../../interfaces/ICdnController'
import type { Supabase } from '../types/supabase'

export const CdnController = (supabase: Supabase): ICdnController => {
  const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL

  if (!CDN_URL) throw new Error('CDN url must be provided')

  return {
    getImage: (folder: Folder, resource: string) => {
      return `${process.env.NEXT_PUBLIC_CDN_URL}/${folder}/${resource}`
    },
  }
}
