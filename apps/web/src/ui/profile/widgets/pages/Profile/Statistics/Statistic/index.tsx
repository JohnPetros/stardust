import Image from 'next/image'

type StatisctProps = {
  title: string
  image: string
  value: number
}

export function Statistic({ title, image, value }: StatisctProps) {
  return (
    <div className='flex flex-col items-center justify-center gap-2 md:flex-row md:justify-start'>
      <div className='flex items-center justify-center gap-3'>
        <span className='text-gray-100 text-base'>{value}</span>
        <div className='h-6 w-6'>
          <Image src={image} width={54} height={54} alt='' />
        </div>
      </div>
      <strong className='text-center font-medium text-green-500'>{title}</strong>
    </div>
  )
}
