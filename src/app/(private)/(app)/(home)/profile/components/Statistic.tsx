import Image from 'next/image'

interface StatiscProps {
  title: string
  image: string
  value: number
}

export function Statistic({ title, image, value }: StatiscProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex items-center justify-center gap-2">
        <span className="text-gray-100">{value}</span>
        <div className="w-6 h-6">
          <Image src={image} width={40} height={40} alt="" />
        </div>
      </div>
      <strong className="text-center text-green-500">{title}</strong>
    </div>
  )
}
