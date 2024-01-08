import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import type { IMdxController } from './interfaces/IMdxService'
import { Server } from './server'

import { ROUTES } from '@/utils/constants'

export const MdxController = (): IMdxController => {
  return {
    compileMdx: async (content: string) => {
      const server = Server()

      const data = await server.post<{
        source: MDXRemoteSerializeResult
      }>(`${ROUTES.server.mdx}/compile`, content)

      return data.source
    },
  }
}
