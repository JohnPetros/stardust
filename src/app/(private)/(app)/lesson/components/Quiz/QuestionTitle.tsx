'use client'

import Image from 'next/image'

import { formatText, getImage } from '@/utils/helpers'

interface TitleProps {
  children: string
  picture?: string
}

export function QuestionTitle({ children, picture }: TitleProps) {
  const image = picture ? getImage('theory', picture) : ''

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 rounded-md md:flex-row">
      {image && (
        <div className="relative h-16 w-16">
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
        className="max-w-xl text-center font-medium text-gray-100 md:text-left"
        dangerouslySetInnerHTML={{ __html: formatText(children) }}
      ></p>
    </div>
  )
}
