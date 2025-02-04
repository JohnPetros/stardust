'use client'

import { useSiderbarContext } from '@/ui/profile/contexts/SidebarContext'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Button } from '@/ui/global/widgets/components/Button'
import { UserAvatar } from '@/ui/global/widgets/components/UserAvatar'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { SignOutAlertDialog } from '@/ui/global/widgets/components/SignOutAlertDialog'
import { AnimatedBar } from './AnimatedBar'
import { AchievementsList } from '../AchievementsList'

export function Sidebar() {
  const { user } = useAuthContext()
  const { isOpen, toggle } = useSiderbarContext()

  return (
    <AnimatedBar isOpen={isOpen} className='md:hidden z-50'>
      <div className='relative'>
        <button type='button' className='absolute right-2 p-2' onClick={toggle}>
          <Icon name='close' size={20} className='text-gray-500' />
        </button>

        {user && (
          <div className='flex flex-col items-center justify-center gap-1 text-gray-100'>
            <UserAvatar
              avatarImage={user.avatar.image.value}
              avatarName={user.avatar.name.value}
              size={64}
            />
            <strong>{user.name.value}</strong>
            <small className='text-sm'>{user.email.value}</small>
            <SignOutAlertDialog>
              <Button className='mx-aut mt-3 w-48 h-8 bg-green-400 px-3 py-2 text-green-900'>
                Sair
              </Button>
            </SignOutAlertDialog>
          </div>
        )}
      </div>

      <div className='mt-3 w-full h-full pb-12 overflow-y-auto'>
        <div>
          <AchievementsList />
        </div>
      </div>
    </AnimatedBar>
  )
}
