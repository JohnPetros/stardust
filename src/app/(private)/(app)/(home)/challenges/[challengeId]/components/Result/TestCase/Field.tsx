import { twMerge } from 'tailwind-merge'

interface FieldProps {
  label: string
  value: string
  isFromUser?: boolean
}

export function Field({ label, value, isFromUser }: FieldProps) {
  return (
    <>
      <dt className='text-gray-300 font-medium'>{label}</dt>
      <dd
        className={twMerge(
          'py-2 px-3 rounded-md mt-1',
          isFromUser ? 'bg-gray-500 text-gray-900 font-semibold' : 'bg-gray-700 text-gray-100'
        )}
      >
        {value}
      </dd>
    </>
  )
}
