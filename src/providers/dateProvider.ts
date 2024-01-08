import { cache } from 'react'

import { IDateProvider } from './interfaces/IDateProvider'

import { dayjsProvider } from '@/libs/dayjs'

export const DateProvider = cache((): IDateProvider => dayjsProvider)
