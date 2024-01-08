import 'dayjs/locale/pt-br'

import dayjs from 'dayjs'

import { IDateProvider } from '@/providers/interfaces/IDateProvider'

dayjs.locale('pt-br')

export const dayjsProvider: IDateProvider = {
  format(date, dateFormat) {
    return dayjs(date).format(dateFormat)
  },
}
