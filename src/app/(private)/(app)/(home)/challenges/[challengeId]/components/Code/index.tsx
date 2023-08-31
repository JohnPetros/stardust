'use client'

import { Button } from '@/app/components/Button'
import { CodeEditor } from '@/app/components/CodeEditor'
import { IconButton } from './IconButton'
import {
  ArrowClockwise,
  ArrowsOutSimple,
  Command,
  Code as CodeIcon,
  Gear,
} from '@phosphor-icons/react'
import { useChallengeContext } from '@/hooks/useChallengeContext'

export function Code() {
  const {
    state: { challenge },
  } = useChallengeContext()

  function handleCodeChange(value: string) {
    console.log(value)
  }

  if (challenge)
    return (
      <div className="w-full h-full ">
        <div className="flex items-center justify-between bg-gray-700 py-2 px-3">
          <Button className="h-6 px-3 text-xs w-max">Executar</Button>
          <ul className="flex items-center gap-3">
            <li>
              <IconButton icon={ArrowClockwise} onClick={() => {}} />
            </li>
            <li>
              <IconButton icon={ArrowsOutSimple} onClick={() => {}} />
            </li>
            <li>
              <IconButton icon={Command} onClick={() => {}} />
            </li>
            <li>
              <IconButton icon={CodeIcon} onClick={() => {}} />
            </li>
            <li>
              <IconButton icon={Gear} onClick={() => {}} />
            </li>
          </ul>
        </div>
        <CodeEditor
          value={challenge.code}
          width="100%"
          height="100%"
          onChange={handleCodeChange}
        />
      </div>
    )
}