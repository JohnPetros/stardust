import Image from 'next/image'

interface StatusProps {
  title: string
  image: string
  value: string
}

export function Status({ title, image, value }: StatusProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <dt className="text-green-500 text-center">{title}</dt>
      <div className="relative w-16 h-16">
        <Image src={image} fill alt="" />
      </div>
      <dd className="text-gray-100 text-sm text-center">{value}</dd>
    </div>
  )
}
