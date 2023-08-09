import { TypeWritter } from '@/app/components/Text/TypeWritter'

interface StemProps {
  children: string
}

export function Stem({ children }: StemProps) {
  return (
    <p className="text-gray-100 font-medium">
      <TypeWritter>{children}</TypeWritter>
    </p>
  )
}
