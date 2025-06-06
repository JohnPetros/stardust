import { twMerge } from 'tailwind-merge'

type Props = {
  label: string
  value: number
  total: number
  color: string
}

export const LegendView = ({ label, value, total, color }: Props) => {
  return (
    <div className='flex items-center justify-between gap-1'>
      <span className={twMerge(color, 'mr-2 h-2 w-3 rounded-md')} />
      <dt className='text-gray-300'>{label}</dt>
      <dd className='text-lg font-semibold text-gray-100'>
        {value}
        <span className='text-base text-gray-500'>/{total}</span>
      </dd>
    </div>
  )
}
