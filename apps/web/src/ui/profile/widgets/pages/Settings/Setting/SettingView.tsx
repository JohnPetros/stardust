import { twMerge } from 'tailwind-merge'

import { Switch } from '@/ui/global/widgets/components/Switch'

type Props = {
  label: string
  className?: string
  onCheck: (isChecked: boolean) => void
}

export const SettingView = ({ label, className, onCheck }: Props) => {
  return (
    <div
      className={twMerge(
        'flex items-center justify-between border border-gray-700 px-6 py-4 rounded-md',
        className,
      )}
    >
      <label htmlFor='' className='text-gray-100'>
        {label}
      </label>

      <Switch onCheck={onCheck} className='w-max border-gray-700' />
    </div>
  )
}
