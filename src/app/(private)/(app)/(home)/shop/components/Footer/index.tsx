import Image from 'next/image'

export function Footer() {
  return (
    <footer className="mx-auto flex w-max items-center gap-1 text-sm text-gray-100">
      Possíveis direitos reservados a{' '}
      <a
        target="_blank"
        href="https://www.freepik.com/author/catalyststuff"
        className="text-green-500"
        rel="noreferrer"
      >
        @catalyststuff
      </a>
      <Image
        src="/images/catalyst.jpg"
        alt="imagem representando a entidade Catalyst"
        width={24}
        height={24}
        className="rounded-full"
      />
      .
    </footer>
  )
}
