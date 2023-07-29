import { string } from 'zod'

interface CategoryProps {
  name: string
}

export function Category({ name }: CategoryProps) {
  return <li className="rounded-md p-1 bg-gray-400 text-gray-600 text-sm">{name}</li>
}
