import { serialize } from 'next-mdx-remote/serialize'

export default async function compileDescription(description: string) {
  const mdx = await serialize(description)

  return mdx
}
