import { api } from '@/services/api'
import useSWR from 'swr'

async function getAvatar(id: string) {
  return await api.getAvatar(id)
}

export function useAvatar(avatarId: string) {
  const { data: userAvatar } = useSWR('avatar', getAvatar)

  return { avatar: userAvatar }
}
