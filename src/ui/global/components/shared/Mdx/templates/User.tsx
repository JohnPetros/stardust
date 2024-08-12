import { useAuthContext } from '@/ui/global/contexts/AuthContext'
import { UserAvatar } from '@/ui/global/components/shared/UserAvatar'

import { Animation } from './Animation'
import { Content } from './Content'

type UserProps = {
  title: string
  picture: string
  children: string[]
  hasAnimation?: boolean
}

export function User({ children, hasAnimation = true }: UserProps) {
  const { user } = useAuthContext()

  return (
    <Animation hasAnimation={hasAnimation}>
      <div className='not-prose flex w-full flex-col'>
        <div className='flex w-full items-center'>
          <Content type='user' hasAnimation={hasAnimation}>
            {children}
          </Content>
          {user && (
            <UserAvatar
              avatarName={user.avatar.name.value}
              avatarImage={user.avatar.image.value}
              size={80}
            />
          )}
        </div>
      </div>
    </Animation>
  )
}
