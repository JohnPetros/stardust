import { Container, Img, Text } from '@react-email/components'

type HeaderProps = {
  children: string
}

export function Header({ children }: HeaderProps) {
  const logo = `${process.env.NEXT_PUBLIC_CDN_URL}/utils/logo.png`

  return (
    <Container>
      <Img width={140} height={30} src={logo} />

      <Text className='text-lg font-medium text-green-400'>{children}</Text>
    </Container>
  )
}
