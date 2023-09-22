'use client'

import Image from 'next/image'

import { getImage } from '@/utils/functions'

interface TitleProps {
  children: string
  picture?: string
}

export function QuestionTitle({ children, picture }: TitleProps) {
  const image = picture ? getImage('theory', picture) : ''

  return (
    <div className="flex items-center justify-center gap-3 w-full">
      {image && (
        <div className="relative w-20 h-12">
          <Image
            src={image}
            fill
            sizes="(min-width: 375px) 4rem"
            className="rounded-md"
            alt=""
            priority
          />
        </div>
      )}
      <p className="text-gray-100 text-center font-medium mt-4">{children}</p>
    </div>
  )
}
