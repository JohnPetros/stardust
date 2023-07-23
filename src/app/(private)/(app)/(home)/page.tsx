'use client'

import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user } = useAuth()

  // console.log(user?.name);

  return <div className="text-white">Home {user?.name}</div>
}
