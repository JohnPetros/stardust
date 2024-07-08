import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { UserAvatar } from '@/modules/global/components/shared/UserAvatar'

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
          {user && <UserAvatar avatarId={user?.avatarId} size={80} />}
        </div>
      </div>
    </Animation>
  )
}