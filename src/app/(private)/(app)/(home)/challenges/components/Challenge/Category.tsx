interface CategoryProps {
  name: string
}

export function Category({ name }: CategoryProps) {
  return (
    <li className="rounded-md bg-gray-400 p-1 text-xs font-semibold text-gray-900">
      {name}
    </li>
  )
}
