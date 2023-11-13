'use client'
import Transition from '../../public/animations/transition.json'

import { Animation } from '@/app/components/Animation'

export default function Loading() {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-900">
      <Animation src={Transition} size={540} />
      <p>Loading</p>
    </div>
  )
}
