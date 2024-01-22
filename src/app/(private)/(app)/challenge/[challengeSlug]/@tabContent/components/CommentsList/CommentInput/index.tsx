import * as Toolbar from '@radix-ui/react-toolbar'

import { UserAvatar } from '@/app/(private)/(app)/(home)/components/UseAvatar'
import { useAuth } from '@/contexts/AuthContext'

type CommentInputProps = {
  onSend: () => void
}

export function CommentInput({ onSend }: CommentInputProps) {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="flex gap-3">
      <UserAvatar avatarId={user?.avatar_id} size={48} />
      <textarea className="rounded-md bg-gray-800 font-medium text-gray-200" />
      <Toolbar.Root></Toolbar.Root>
    </div>
  )
}
