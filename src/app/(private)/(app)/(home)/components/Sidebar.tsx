'use client'
import { UserAvatar } from './UserAvatar'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/app/components/Button'
import { useSiderbar } from '@/hooks/useSiderbar'

export function Sidebar() {
  const { user } = useAuth()
  if (!user) return null

  const { isOpen } = useSiderbar()

  if (isOpen)
    return (
      <div className="bg-gray-900 p-6 fixed left-0 h-screen w-80 z-20">
        <div className="flex flex-col items-center justify-center gap-3 text-gray-100">
          <UserAvatar avatarId={user.avatar_id} size={96} />
          <strong>{user?.name}</strong>
          <small className='text-sm'>{user?.email}</small>
          <Button className="bg-green-400 text-green-900 px-3 py-2 w-48 mx-aut mt-3">
            Sair
          </Button>
        </div>
      </div>
    )
}
