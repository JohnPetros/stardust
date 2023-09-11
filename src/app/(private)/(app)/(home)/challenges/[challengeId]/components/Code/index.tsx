'use client'

import { useRef } from 'react'
import { useChallengeContext } from '@/hooks/useChallengeContext'

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

export function Code() {
  const {
    state: { challenge },
    dispatch,
  } = useChallengeContext()
  const code = useRef(challenge?.code ?? '')

  function handleRunCode() {
    dispatch({ type: 'handleUserCode', payload: code.current })
  }

  function handleCodeChange(value: string) {
    code.current = value
  }

  if (challenge)
    return (
      <div className="w-full h-screen">
        <div className="flex items-center justify-between bg-gray-700 py-2 px-3">
          <Button className="h-6 px-3 text-xs w-max" onClick={handleRunCode}>
            Executar
          </Button>
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
          hasMinimap
          onChange={handleCodeChange}
        />
      </div>
    )
}
