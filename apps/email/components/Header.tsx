import { Container, Img, Text } from '@react-email/components'

type HeaderProps = {
  children: string
}

export const Header = ({ children }: HeaderProps) => {
  return (
    <Container>
      <Img
        width={180}
        height={30}
        src='https://aukqejqsiqsqowafpppb.supabase.co/storage/v1/object/public/images/marketing/logo.png'
      />

      <Text className='text-lg font-medium text-green-400'>{children}</Text>
    </Container>
  )
}
