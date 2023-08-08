'use client'

import { Text as TextData } from '@/types/text'
import { getImage } from '@/utils/functions'
import Image from 'next/image'
import { tv } from 'tailwind-variants'

const textStyles = tv({
  base: 'font-medium tracking-wider text-gray-100 text-sm w-full p-4 rounded-md',
  variants: {
    type: {
      default: 'bg-purple-700',
      alert: 'bg-yellow-400 text-yellow-700',
      quote: 'bg-blue-700 border-l-4 border-blue-300',
      list: 'border-green-400 text-green-400',
      image: '',
      code: '',
    },
  },
})

interface TextProps {
  data: TextData
}

export function Text({ data: { type, content, picture } }: TextProps) {
  const textImage = picture ? getImage('texts', picture) : ''

  return (
    <div className="flex items-center gap-6">
      {textImage && (
        <div className="relative w-24 h-16 bg-red-400 rounded-md overflow-hidden">
          <Image src={textImage} fill alt="Panda" />
        </div>
      )}
      <div className={textStyles({ type })}>{content}</div>
    </div>
  )
}
