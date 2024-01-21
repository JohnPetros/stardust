import { UserAvatar } from '@/app/(private)/(app)/(home)/components/UseAvatar'
import { useAuth } from '@/contexts/AuthContext'
import { useAvatar } from '@/hooks/useAvatar'
import { useApi } from '@/services/api'

type InputProps = {
  senderComment: () => void
}

export function CommentInput() {
  const { getImage } = useApi()
  const { user } = useAuth()

  if (!user) return null

  return (
    <div>
      <UserAvatar avatarId={user?.avatar_id} size={48} />
      <input type="text" value={} />
    </div>
  )
}
