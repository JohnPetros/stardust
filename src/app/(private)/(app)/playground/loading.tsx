'use client'

import { Loading } from '@/global/components/Loading'

export default function LoadingPage() {
  return (
    <div className="grid h-screen w-screen place-content-center">
      <Loading isSmall={false} />
    </div>
  )
}
