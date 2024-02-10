import type { IMdxController } from '../../interfaces/IMdxController'
import { Server } from '../server'

import { Text } from '@/@types/Text'
import { ROUTES } from '@/global/constants'

export const MdxController = (): IMdxController => {
  const server = Server()

  return {
    compileMdxComponents: async (components: string[]) => {
      const data = await server.post<{
        compiledMdxComponents: string[]
      }>(`${ROUTES.server.mdx}/compile-components`, { components })

      return data.compiledMdxComponents
    },

    compileDescription: async (description: string) => {
      const data = await server.post<{
        compiledDescription: string
      }>(`${ROUTES.server.mdx}/compile-description`, { description })

      return data.compiledDescription
    },

    parseTexts: async (texts: Text[]) => {
      const data = await server.post<{
        mdxComponents: string[]
      }>(`${ROUTES.server.mdx}/parse-texts`, { texts })

      return data.mdxComponents
    },
  }
}
