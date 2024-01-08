import { Img, Text } from '@react-email/components'

interface HeaderProps {
  children: string
}

export function Header({ children }: HeaderProps) {
  return (
    <>
      <Img
        width={100}
        height={20}
        src="https://aukqejqsiqsqowafpppb.supabase.co/storage/v1/object/public/images/utils/logo.png"
      />

      <Text className="font-semibold text-green-400">{children}</Text>
    </>
  )
}
