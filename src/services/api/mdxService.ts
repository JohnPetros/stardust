import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import type { IMdxService } from './interfaces/IMdxService'
import { Resources } from './resources'

export const MdxService = (): IMdxService => {
  return {
    compileMdx: async (content: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/${Resources.MDX}/compile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
          }),
        }
      )

      const data = await response.json()

      return data.source as MDXRemoteSerializeResult
    },
  }
}
