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
      className="bg-gray-400 w-full rounded-lg"
      style={{ height: height }}
    >
      <Progress.Indicator
        className="bg-green-400"
        style={{ width: `${value}%` }}
      />

      <div className="relative w-8 h-8 rotate-90 -ml-1 -mt-2">
        {indicatorImage && <Image src={indicatorImage} fill alt="" />}
      </div>
    </Progress.Root>
  )
}
