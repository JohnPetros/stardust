'use client'
import * as Progress from '@radix-ui/react-progress'
import Image from 'next/image'

interface ProgessProps {
  value: number
  height: number
  indicatorImage?: string
}

export function ProgressBar({ value, height, indicatorImage }: ProgessProps) {

  return (
    <Progress.Root
      value={value}
      className="flex items-center bg-gray-400 w-full rounded-lg "
      style={{ height: height }}
    >
      <Progress.Indicator
        className="bg-green-400 h-full rounded-lg"
        style={{ width: `${value}%`, transition: 'width .3s linear' }}
      />

      <div className="relative w-10 h-10 rotate-90 -ml-2  z-10">
        {indicatorImage && <Image src={indicatorImage} fill sizes='(min-width: 375px) 2.5rem' alt="" priority />}
      </div>
    </Progress.Root>
  )
}
