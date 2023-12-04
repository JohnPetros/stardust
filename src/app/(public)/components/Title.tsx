import { SignIn } from '@phosphor-icons/react'

interface TitleProps {
  title: string
  text: string
}

export function Title({ title, text }: TitleProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <SignIn className="text-green-400" width={24} height={24} />
        <h1 className="text-xl font-semibold text-green-400">{title}</h1>
      </div>
      <p className="mt-2 text-gray-100">{text}</p>
    </div>
  )
}
