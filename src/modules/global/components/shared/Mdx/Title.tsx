import { formatSpecialCharacters } from '@/modules/global/utils'

type TitleProps = {
  children: string
}

export function Title({ children }: TitleProps) {
  const title = formatSpecialCharacters(children, 'decode').slice(1, -1) // bug fix

  return (
    <h3 className='not-prose w-full text-lg font-semibold text-gray-100'>
      {formatSpecialCharacters(title, 'decode')}
    </h3>
  )
}
