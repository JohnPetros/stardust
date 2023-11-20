import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

export interface IMdxService {
  compileMdx(content: string): Promise<MDXRemoteSerializeResult>
}
