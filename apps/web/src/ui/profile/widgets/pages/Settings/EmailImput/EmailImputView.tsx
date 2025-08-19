import { Badge } from '@/ui/global/widgets/components/Badge'

type Props = {
  value: string
}

export const EmailImputView = ({ value }: Props) => {
  return (
    <div className='grid grid-cols-3 border-b border-gray-700 py-4'>
      <label htmlFor='name' className='text-sm text-gray-100'>
        Email
      </label>

      <div className='flex items-center gap-1'>
        <input
          type='text'
          value={value}
          readOnly
          className='text-gray-400 bg-transparent flex-1 border-none outline-none'
        />

        <Badge variant='default'>Primário</Badge>
      </div>
    </div>
  )
}
