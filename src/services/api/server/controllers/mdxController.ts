import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import type { IMdxController } from '../../interfaces/IMdxController'
import { useServer } from '../useServer'

import { ROUTES } from '@/utils/constants'

export const MdxController = (): IMdxController => {
  const server = useServer()

  return {
    compileMdx: async (content: string) => {
      const data = await server.post<{
        source: MDXRemoteSerializeResult
      }>(`${ROUTES.server.mdx}/compile`, content)

      return data.source
    },
  }
}