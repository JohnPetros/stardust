import type { ReactNode } from 'react'

import { cn } from '@/ui/shadcn/utils'
import { Icon } from '../../../components/Icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/shadcn/components/dropdown-menu'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { SignOutButton } from './SignOutButton'


type Props = {
  left?: ReactNode
  right?: ReactNode
  className?: string
  account: AccountDto
}

export const HeaderView = ({ left, right, className = '', account }: Props) => {
  return (
    <header
      className={cn(
        'flex items-center h-12 px-4 bg-zinc-900 border-b border-zinc-800 justify-between',
        className,
      )}
    >
      <div className='flex items-center gap-4'>
        {left ?? (
          <>
            <img src='/images/rocket.svg' alt='' className='w-8 h-8' />
            <span className='block bg-slate-500 w-0.5 h-6 rotate-[30deg] rounded-full' />
            <img src='/images/logo.svg' alt='StarDust' className='w-24 h-24' />
          </>
        )}
      </div>
      <div className='flex items-center'>
        {right ?? (
          <DropdownMenu>
            <DropdownMenuTrigger className='w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition-colors'>
              <Icon name='user' className='text-zinc-400' />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' sideOffset={10}>
              {account && (
                <>
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium leading-none'>{account.name}</p>
                      <p className='text-xs leading-none text-muted-foreground'>
                        {account.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )}
              <SignOutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
