'use client'

import { MDXRemote } from 'next-mdx-remote'

import { Alert } from './Alert'
import { Code } from './Code'
import { Image } from './Image'
import { Quote } from './Quote'
import { Text } from './Text'
import { User } from './User'

const COMPONENTS = {
  Text,
  Alert,
  Quote,
  Image,
  User,
  Code,
}

type MdxProps = {
  children: string
}

export function Mdx({ children }: MdxProps) {
  const source = JSON.parse(children)

  if (source) return <MDXRemote {...source} components={COMPONENTS} />
}
