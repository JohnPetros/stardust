'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'

import Image from 'next/image'
import { TypeWritter } from './TypeWritter'
import { UserAvatar } from '@/app/(private)/(app)/(home)/components/UserAvatar'
import { CodeEditor } from '../CodeEditor'

import { Variants, motion } from 'framer-motion'

import { tv } from 'tailwind-variants'

import { getImage } from '@/utils/functions'

import type { Text as TextData } from '@/types/text'
import { CodeSnippet } from '@/app/(private)/(app)/lesson/components/Theory/CodeSnippet'

const textAnimations: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.99,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
      type: 'tween',
      ease: 'linear',
    },
  },
}

const textStyles = tv({
  base: 'font-medium tracking-wider text-gray-100 text-sm w-full p-4 rounded-md',
  variants: {
    type: {
      default: 'bg-purple-700',
      alert: 'bg-yellow-400 text-yellow-700',
      quote: 'bg-blue-700 border-l-4 border-blue-300 text-blue-300',
      list: 'border-green-400 text-green-400',
      image: '',
      code: '',
      user: 'bg-green-400 text-green-900 font-semibold ml-auto mr-4 w-max',
    },
  },
})

interface TextProps {
  data: TextData
  hasAnimation?: boolean
}

export function Text({
  data: { type, content, picture },
  hasAnimation,
}: TextProps) {
  const { user } = useAuth()
  const textRef = useRef<HTMLDivElement>(null)
  const textImage = picture ? getImage('theory', picture) : ''

  useEffect(() => {
    if (hasAnimation && textRef.current)
      textRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  return (
    <motion.div
      ref={textRef}
      variants={textAnimations}
      initial={hasAnimation && 'hidden'}
      animate={hasAnimation && 'visible'}
      className="flex items-center w-full"
    >
      {type === 'image' && textImage && (
        <div className="flex flex-col items-center justify-center w-full">
          <Image
            src={textImage}
            width={180}
            height={120}
            className="rounded-lg"
            alt=""
          />
          <p className="text-gray-100 font-medium text-start text-lg">
            <TypeWritter canType delay={750} speed={35}>
              {String(content)}
            </TypeWritter>
          </p>
        </div>
      )}

      {type === 'code' && (
        <>
          <CodeSnippet code={String(content)} />
        </>
      )}

      {type === 'user' && (
        <>
          <div className={textStyles({ type })}>
            {!Array.isArray(content) && (
              <p>
                <TypeWritter canType={!!hasAnimation}>{content}</TypeWritter>
              </p>
            )}
          </div>
          {user && <UserAvatar avatarId={user?.avatar_id} size={80} />}
        </>
      )}

      {['default', 'alert', 'quote'].includes(String(type)) && (
        <>
          {textImage && (
            <div className="relative w-24 h-16 bg-red-400 rounded-md overflow-hidden mr-3">
              <Image src={textImage} fill alt="Panda" />
            </div>
          )}
          {type === 'alert' && (
            <span className="block mr-3">
              <Image src="/icons/alert.svg" width={32} height={32} alt="" />
            </span>
          )}
          <div className={textStyles({ type })}>
            {!Array.isArray(content) && (
              <p>
                <TypeWritter canType={!!hasAnimation}>{content}</TypeWritter>
              </p>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}
