'use client'
import { Animation } from '@/app/components/Animation'

import Transition from '../../public/animations/transition.json'

export default function Loading() {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 z-50 flex items-center justify-center">
      <Animation src={Transition} size={540} />
      <p>Loading</p>
    </div>
  )
}
