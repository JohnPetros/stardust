import Image from 'next/image'

export function Hero() {
  return (
    <div className="space-y-6">
      <Image
        src="/images/logo.svg"
        width={280}
        height={280}
        priority
        alt="StarDust"
      />
      <p className="text-center text-base text-gray-100">
        Aprenda enquanto se diverte!
      </p>
      <Image
        src="/images/rocket.svg"
        width={280}
        height={280}
        priority
        alt="Rocket"
      />
    </div>
  )
}
