import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import type { IMdxService } from './interfaces/IMdxService'
import { Server } from './server'

import { ROUTES } from '@/utils/constants'

export const MdxService = (): IMdxService => {
  return {
    compileMdx: async (content: string) => {
      const server = Server()

      const data = await server.post<{ source: MDXRemoteSerializeResult }>(
        `${ROUTES.server.mdx}/compile`,
        content
      )

      return data.source
    },
  }
}
