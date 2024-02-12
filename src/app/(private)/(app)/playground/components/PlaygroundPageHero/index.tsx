import Image from 'next/image'

export function PlaygroundPageHero() {
  return (
    <div className="flex w-max flex-col items-center gap-12">
      <Image
        src="/images/rocket.svg"
        width={180}
        height={180}
        priority
        alt="Foguete com tons esverdeados rodeado de estrelas flututando para cima e para baixo repetidamente."
      />
      <div className="flex -translate-y-3 items-center gap-3">
        <Image
          src="/images/logo.svg"
          width={180}
          height={180}
          priority
          alt="Estar Dâsti"
        />
        <h1 className="text-xl font-medium tracking-widest text-green-400">
          Playground
        </h1>
      </div>
    </div>
  )
}
