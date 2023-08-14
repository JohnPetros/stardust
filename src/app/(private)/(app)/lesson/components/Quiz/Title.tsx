'use client'

import Image from 'next/image'

import { getImage } from '@/utils/functions'

interface TitleProps {
  children: string
  picture?: string
}

export function Title({ children, picture }: TitleProps) {
  const image = picture ? getImage('texts', picture) : ''

  return (
    <>
      {image && (
        <Image
          src={image}
          width={64}
          height={64}
          className="rounded-md"
          alt=""
        />
      )}
      <p className="text-gray-100 text-center font-medium mt-4">{children}</p>
    </>
  )
}
