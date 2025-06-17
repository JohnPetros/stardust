import { twMerge } from 'tailwind-merge'

type Props = {
  label: string
  value: string
  isFromUser?: boolean
}

export const FieldView = ({ label, value, isFromUser }: Props) => {
  return (
    <>
      <dt className='font-medium text-gray-300'>{label}</dt>
      <dd
        className={twMerge(
          'mt-1 rounded-md px-3 py-2 font-code',
          isFromUser
            ? 'bg-gray-500 font-semibold text-gray-900'
            : 'bg-gray-700 text-gray-100',
        )}
      >
        {value}
      </dd>
    </>
  )
}
