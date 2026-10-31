'use client'
import * as React from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from './calendar'
import { Datetime } from '@stardust/core/global/libs'

type Props = {
  startDate?: Date
  endDate?: Date
  onChange: (range: { startDate?: Date; endDate?: Date }) => void
}

export const DateRangePicker = ({ startDate, endDate, onChange }: Props) => {
  const dateRange: DateRange | undefined = React.useMemo(() => {
    if (!startDate && !endDate) return undefined
    return {
      from: new Datetime(startDate).dateWithoutTimeZone(),
      to: new Datetime(endDate).dateWithoutTimeZone(),
    }
  }, [startDate, endDate])

  function handleSelect(range: DateRange | undefined) {
    if (range?.to && range?.from) {
      onChange({
        startDate: range?.from,
        endDate: range?.to,
      })
    }
  }

  return (
    <Calendar
      mode='range'
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={handleSelect}
      numberOfMonths={2}
      className='rounded-lg border shadow-sm'
    />
  )
}
