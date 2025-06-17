import { type ClassNameValue, twMerge } from 'tailwind-merge'

type Props = {
  className: ClassNameValue
  children: string
}

export const NameView = ({ children, className }: Props) => {
  return <span className={twMerge(className)}>{children}</span>
}
