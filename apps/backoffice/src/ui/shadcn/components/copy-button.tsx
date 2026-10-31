import { useState, type PropsWithChildren } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

import { Button } from '@/ui/shadcn/components/button'
import { cn } from '../utils'

type Props = {
  className?: string
  onClick: () => void
}

export function CopyButton({ onClick, className, children }: PropsWithChildren<Props>) {
  const [copied, setCopied] = useState<boolean>(false)

  const handleCopy = async () => {
    try {
      onClick()
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button
      variant='outline'
      className={cn('flex items-center disabled:opacity-100 px-2', className)}
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      disabled={copied}
    >
      {copied && (
        <div
          className={cn(
            'transition-all',
            copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
          )}
        >
          <CheckIcon className='stroke-emerald-500' size={16} aria-hidden='true' />
        </div>
      )}
      {!copied && (
        <div
          className={cn(
            'transition-all left-4',
            copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
          )}
        >
          <CopyIcon size={16} aria-hidden='true' />
        </div>
      )}
      {children}
    </Button>
  )
}
