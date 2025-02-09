import { formatSpecialCharacters } from '../formatSpecialCharacters'

type TitleProps = {
  children: string
}

export function Title({ children }: TitleProps) {
  const title = children.slice(1, -1) // bug fix

  return <h3 className='not-prose w-full text-lg font-semibold text-gray-100'>{title}</h3>
}
