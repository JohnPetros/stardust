import { formatSpecialCharacters } from '../formatSpecialCharacters'

type TitleProps = {
  children: string
}

export function Title({ children }: TitleProps) {
  let title = formatSpecialCharacters(children, 'decode')
  if (title.startsWith("'") && title.endsWith("'"))
    title = title.slice(1, title.length - 1) // title with quotes bug fix

  return <h3 className='not-prose w-full text-lg font-semibold text-gray-100'>{title}</h3>
}
