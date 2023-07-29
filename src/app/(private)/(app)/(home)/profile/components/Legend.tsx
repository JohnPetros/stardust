import { twMerge } from 'tailwind-merge'

interface LabelProps {
  label: string
  value: number
  total: number
  color: string
}

export function Legend({ label, value, total, color }: LabelProps) {
  return (
    <div className='flex gap-1 items-center justify-between'>
      <span className={twMerge(color, 'rounded-md w-3 h-2 mr-2')} />
      <dt className="text-gray-300">{label}</dt>
      <dd className="text-lg text-gray-100 font-semibold">
        {value}<span className="text-gray-500 text-base">/{total}</span>
      </dd>
    </div>
  )
}
