'use client'
import { MDXRemote } from 'next-mdx-remote'

import { Alert } from './Alert'
import { Quote } from './Quote'
import { Text } from './Text'

import { useMdx } from '@/hooks/useMdx'

const COMPONENTS = {
  Text,
  Alert,
  Quote,
}

interface MdxProps {
  id: string
  children: string
}

export function Mdx({ children }: MdxProps) {
  const source = useMdx(children)
  if (source) return <MDXRemote {...source} components={COMPONENTS} />
}
