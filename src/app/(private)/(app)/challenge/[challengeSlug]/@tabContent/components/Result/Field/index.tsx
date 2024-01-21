import { twMerge } from 'tailwind-merge'

type FieldProps = {
  label: string
  value: string
  isFromUser?: boolean
}

export function Field({ label, value, isFromUser }: FieldProps) {
  return (
    <>
      <dt className="font-medium text-gray-300">{label}</dt>
      <dd
        className={twMerge(
          'mt-1 rounded-md px-3 py-2',
          isFromUser
            ? 'bg-gray-500 font-semibold text-gray-900'
            : 'bg-gray-700 text-gray-100'
        )}
      >
        {value}
      </dd>
    </>
  )
}
