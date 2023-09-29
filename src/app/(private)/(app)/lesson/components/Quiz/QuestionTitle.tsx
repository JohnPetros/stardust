'use client'

import Image from 'next/image'
import { formatText, getImage } from '@/utils/functions'

interface TitleProps {
  children: string
  picture?: string
}

export function QuestionTitle({ children, picture }: TitleProps) {
  const image = picture ? getImage('theory', picture) : ''

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 w-full rounded-md">
      {image && (
        <div className="relative w-16 h-16">
          <Image
            src={image}
            fill
            sizes="(min-width: 375px) 4rem"
            alt="Panda"
            className="skeleton rounded-md"
            onLoadingComplete={(image) => image.classList.remove('skeleton')}
            priority
          />
        </div>
      )}
      <p
        className="text-gray-100 text-center md:text-left font-medium max-w-xl"
        dangerouslySetInnerHTML={{ __html: formatText(children) }}
      ></p>
    </div>
  )
}
