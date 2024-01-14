'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { PanInfo, useAnimation } from 'framer-motion'

import { ConsoleProps } from '.'

export function useConsole({ height, results }: ConsoleProps) {
  const [output, setOutput] = useState<string[]>([])
  const types = useRef<string[]>([])
  const controls = useAnimation()

  function calculateMinHeight() {
    return ((height + 100) / 10) * 0.5 + 'rem'
  }

  const open = useCallback(() => {
    controls.start('open')
  }, [controls])

  const close = useCallback(() => {
    controls.start('closed')
  }, [controls])

  function formatOutput(output: string, index: number) {
    switch (types.current[index].trim()) {
      case 'textoo':
        return "'" + output + "'"
      case 'vetor':
        return '[ ' + output.split(',').join(', ') + ' ]'
      default:
        return output
    }
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.velocity.y > 20 && info.offset.y >= 50) {
      close()
    }
  }

  useEffect(() => {
    setOutput([])
    if (!results.length) return

    types.current = results.filter((_, index) => index % 2 === 0)
    const output = results.filter((_, index) => index % 2 !== 0)

    setOutput(output.map((output, index) => formatOutput(output.trim(), index)))
  }, [results])

  return {
    output,
    animationControls: controls,
    open,
    close,
    calculateMinHeight,
    handleDragEnd,
  }
}
