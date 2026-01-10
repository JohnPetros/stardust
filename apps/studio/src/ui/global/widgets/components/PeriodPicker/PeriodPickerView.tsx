import { CalendarIcon } from 'lucide-react'
import { Datetime } from '@stardust/core/global/libs'
import { Button } from '@/ui/shadcn/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/ui/shadcn/components/dropdown-menu'
import { DateRangePicker } from '@/ui/shadcn/components/date-range-picker'

type Props = {
  startDate?: Date
  endDate?: Date
  label?: string
  onChange: (range: { startDate?: Date; endDate?: Date }) => void
}

export const PeriodPickerView = ({
  startDate,
  endDate,
  label = 'Período',
  onChange,
}: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='gap-2'>
          <CalendarIcon className='h-4 w-4' />
          {startDate ? (
            <>
              {new Datetime(startDate).format('DD/MM/YYYY')} -{' '}
              {endDate ? new Datetime(endDate).format('DD/MM/YYYY') : '...'}
            </>
          ) : (
            label
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='p-0'>
        <div className='flex flex-col'>
          <DateRangePicker startDate={startDate} endDate={endDate} onChange={onChange} />
          {startDate && (
            <div className='p-2 border-t border-zinc-800 w-full flex justify-center'>
              <Button
                size='sm'
                className='w-40 mx-auto justify-center text-xs h-8'
                onClick={() => onChange({ startDate: undefined, endDate: undefined })}
              >
                Limpar
              </Button>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
