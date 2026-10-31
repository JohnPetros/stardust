import { Icon } from '@/ui/global/widgets/components/Icon'
import { DropdownMenuItem } from '@/ui/shadcn/components/dropdown-menu'

type Props = {
  onClick: () => void
}

export const SignOutButtonView = ({ onClick }: Props) => {
  return (
    <DropdownMenuItem className='text-red-500' onClick={onClick}>
      <Icon name='sign-out' className='mr-2 h-4 w-4' />
      <span>Sign out</span>
    </DropdownMenuItem>
  )
}
