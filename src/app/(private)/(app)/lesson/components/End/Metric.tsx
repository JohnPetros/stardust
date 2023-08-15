import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

const colors = {
  bg: {
    green: 'bg-green-500',
    blue: 'bg-blue-300',
    red: 'bg-red-300',
    yellow: 'bg-yellow-300',
  },

  border: {
    green: 'border-green-500',
    blue: 'border-blue-300',
    red: 'border-red-300',
    yellow: 'border-yellow-300',
  },
}

interface MetricProps {
  title: string
  amount: number
  icon: string
  color: 'green' | 'blue' | 'red' | 'yellow'
  isLarge: boolean
  delay: number
}

export function Metric({
  title,
  amount,
  icon,
  color,
  isLarge,
  delay,
}: MetricProps) {
  return (
    <div
      className={twMerge(
        'rounded-md overflow-hidden border',
        isLarge ? 'w-64 h-20' : 'w-32 h-20',
        colors.border[color]
      )}
    >
      <div className={twMerge('grid place-content-center p-1', colors.bg[color])}>
        <strong className="text-gray-900">{title}</strong>
      </div>
      <div className="flex items-center justify-center gap-2 p-3">
        <Image src={`/icons/${icon}`} width={24} height={24} alt="" />
        <span className="text-gray-100 text-lg font-medium">{amount}</span>
      </div>
    </div>
  )
}
