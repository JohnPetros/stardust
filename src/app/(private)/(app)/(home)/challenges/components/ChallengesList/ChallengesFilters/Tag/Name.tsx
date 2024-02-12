import { ClassNameValue, twMerge } from 'tailwind-merge'

type NameProps = {
  className: ClassNameValue
  children: string
}

export function Name({ children, className }: NameProps) {
  return <span className={twMerge(className)}>{children}</span>
}
