'use client'

import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import { MDXRemote } from 'next-mdx-remote'

import { Alert } from './Alert'
import { Code } from './Code'
import { Image } from './Image'
import { Quote } from './Quote'
import { Text } from './Text'
import { useMdx } from './useMdx'
import { User } from './User'

const COMPONENTS = {
  Text,
  Alert,
  Quote,
  Image,
  User,
  Code,
}

export type MdxRef = {
  isLoaded: boolean
}

type MdxProps = {
  id: string
  children: string
}

export function MdxComponent(
  { children }: MdxProps,
  ref: ForwardedRef<MdxRef>
) {
  const source = useMdx(children)

  useImperativeHandle(
    ref,
    () => {
      return {
        isLoaded: !!source,
      }
    },
    [source]
  )

  if (source) return <MDXRemote {...source} components={COMPONENTS} />
}

export const Mdx = forwardRef(MdxComponent)
