import Image from 'next/image'

type StatusProps = {
  title: string
  image: string
  value: string
}

export function Status({ title, image, value }: StatusProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <dt className="text-center text-green-500">{title}</dt>
      <div className="relative h-16 w-16">
        <Image src={image} fill alt="" />
      </div>
      <dd className="text-center text-sm text-gray-100">{value}</dd>
    </div>
  )
}
