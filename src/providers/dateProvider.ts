import { cache } from 'react'

import { IDateProvider } from './interfaces/IDateProvider'

import { dayjsProvider } from '@/services/date/dayjs'

export const DateProvider = cache((): IDateProvider => dayjsProvider)
