'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { useMdx } from '@/ui/global/widgets/components/Mdx/hooks/useMdx'
import Image from 'next/image'

type TitleProps = {
  children: string
  picture?: string
}

export function QuestionStem({ children, picture }: TitleProps) {
  const { parseMdxToText } = useMdx()
  const { storageService } = useRest()
  const image = picture ? storageService.fetchImage('theory', picture) : ''

  return (
    <div className='flex w-full flex-col items-center justify-center gap-3 rounded-md md:flex-row'>
      {image && (
        <div className='relative h-16 w-20'>
          <Image
            src={image}
            fill
            sizes='(min-width: 375px) 4rem'
            alt='Panda'
            className='skeleton rounded-md'
            onLoadingComplete={(image) => image.classList.remove('skeleton')}
            priority
          />
        </div>
      )}
      <p
        className='max-w-xl text-center font-medium text-gray-100 md:text-left'
        dangerouslySetInnerHTML={{ __html: parseMdxToText(children) }}
      />
    </div>
  )
}
