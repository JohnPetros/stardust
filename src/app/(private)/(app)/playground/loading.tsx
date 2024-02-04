'use client'

import { Loading } from '@/app/components/Loading'

export default function LoadingPage() {
  return (
    <div className="grid h-screen w-screen place-content-center">
      <Loading isSmall={false} />
    </div>
  )
}
