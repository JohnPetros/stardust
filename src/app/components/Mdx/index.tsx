'use client'
import { MDXRemote } from 'next-mdx-remote'

import { Alert } from './Alert'
import { Code } from './Code'
import { Image } from './Image'
import { Quote } from './Quote'
import { Text } from './Text'

import { useMdx } from '@/hooks/useMdx'

const COMPONENTS = {
  Text,
  Alert,
  Quote,
  Image,
  Code,
}

interface MdxProps {
  id: string
  children: string
}

export function Mdx({ children }: MdxProps) {
  console.log(children)
  const source = useMdx(children)
  if (source) return <MDXRemote {...source} components={COMPONENTS} />
}
