'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'

import Image from 'next/image'
import { UserAvatar } from '@/app/(private)/(app)/(home)/components/UserAvatar'
import { CodeSnippet } from '@/app/components/Text/CodeSnippet'
import { TypeWriter } from './TypeWriter'
import { Title } from './Title'

import { Variants, motion } from 'framer-motion'

import { tv } from 'tailwind-variants'

import { formatText, getImage, slugify } from '@/utils/functions'

import type { Text as TextData } from '@/@types/text'

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
  base: 'font-medium tracking-wider text-gray-100 text-sm w-full p-3 rounded-md',
  variants: {
    type: {
      default: 'bg-purple-700',
      alert: 'bg-yellow-400 text-yellow-900',
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
  data: { type, title, content, picture, isRunnable },
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
    >
      {title && (
        <section id={slugify(title)} className="mb-4">
          <Title>{title}</Title>
        </section>
      )}

      {type === 'image' && textImage && (
        <div className="flex flex-col items-center justify-center w-full">
          <Image
            src={textImage}
            width={180}
            height={120}
            className="rounded-lg"
            priority
            alt=""
          />
          <p className="text-gray-100 font-medium text-start text-lg mt-1">
            <TypeWriter
              text={formatText(String(content))}
              isEnable={hasAnimation}
            />
          </p>
        </div>
      )}
      <div className="flex items-center w-full">
        {type === 'code' && (
          <div className="flex flex-col gap-2 w-full">
            {title && <Title>{title}</Title>}
            <CodeSnippet
              code={formatText(String(content))}
              isRunnable={Boolean(isRunnable)}
            />
          </div>
        )}

        {type === 'user' && (
          <>
            <div className={textStyles({ type })}>
              {!Array.isArray(content) && (
                <p className="leading-6">
                  <TypeWriter
                    text={formatText(content)}
                    isEnable={hasAnimation}
                  />
                </p>
              )}
            </div>
            {user && <UserAvatar avatarId={user?.avatar_id} size={80} />}
          </>
        )}

        {['default', 'alert', 'quote'].includes(String(type)) && (
          <>
            {textImage && (
              <div className="relative md:w-24 w-20 h-12 md:h-16 rounded-md overflow-hidden mr-3 ">
                <Image
                  src={textImage}
                  fill
                  alt="Panda"
                  className="skeleton"
                  sizes="(min-width: 375px) 5rem, (min-width: 769px) 6rem"
                  priority
                  onLoadingComplete={(image) =>
                    image.classList.remove('skeleton')
                  }
                />
              </div>
            )}

            {type === 'alert' && (
              <span className="block mr-3">
                <Image
                  src="/icons/alert.svg"
                  width={32}
                  height={32}
                  alt=""
                  className="skeleton"
                  onLoadingComplete={(image) =>
                    image.classList.remove('skeleton')
                  }
                />
              </span>
            )}

            <div className={textStyles({ type })}>
              {!Array.isArray(content) && (
                <p className="leading-6">
                  <TypeWriter
                    text={formatText(content)}
                    isEnable={hasAnimation}
                  />
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
