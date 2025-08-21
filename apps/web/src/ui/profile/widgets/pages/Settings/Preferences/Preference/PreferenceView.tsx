import { twMerge } from 'tailwind-merge'

import { Switch } from '@/ui/global/widgets/components/Switch'

type Props = {
  label: string
  className?: string
  defaultChecked: boolean
  onCheck: (isChecked: boolean) => void
}

export const PreferenceView = ({ label, className, defaultChecked, onCheck }: Props) => {
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

      <Switch
        defaultCheck={defaultChecked}
        onCheck={onCheck}
        className='w-max border-gray-700'
      />
    </div>
  )
}
