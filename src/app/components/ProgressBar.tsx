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
      className="flex w-full items-center rounded-lg bg-gray-400 "
      style={{ height: height }}
    >
      <Progress.Indicator
        className="h-full rounded-lg bg-green-400"
        style={{ width: `${value}%`, transition: 'width .3s linear' }}
      />

      <div className="relative z-10 -ml-2 h-10 w-10  rotate-90">
        {indicatorImage && (
          <Image
            src={indicatorImage}
            fill
            sizes="(min-width: 375px) 2.5rem"
            alt=""
            priority
          />
        )}
      </div>
    </Progress.Root>
  )
}
