import Image from 'next/image'

export function Hero() {
  return (
    <div className="space-y-6">
      <Image src="/images/logo.svg" width={280} height={280} priority alt="StarDust" />
      <p className="text-gray-100 text-base text-center">Aprenda enquanto se diverte!</p>
      <Image src="/images/rocket.svg" width={280} height={280} priority alt="Rocket" />
    </div>
  )
}
