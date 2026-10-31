import type { ComponentProps } from 'react'
import { Button } from '@/ui/shadcn/components/button'

type Props = {
  isLoading?: boolean
}

export const LoadMoreButtonView = ({
  isLoading,
  ...props
}: ComponentProps<'button'> & Props) => {
  return (
    <Button variant='outline' isLoading={isLoading} {...props}>
      Carregar mais
    </Button>
  )
}
