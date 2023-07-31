interface CategoryProps {
  name: string
}

export function Category({ name }: CategoryProps) {
  return (
    <li className="rounded-md p-1 bg-gray-400 text-gray-900 font-semibold text-xs">
      {name}
    </li>
  )
}
