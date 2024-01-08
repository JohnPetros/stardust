import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

export interface IMdxController {
  compileMdx(content: string): Promise<MDXRemoteSerializeResult>
}
