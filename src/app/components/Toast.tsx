'use client'
import { useState } from 'react'
import { Prohibit, X } from '@phosphor-icons/react'
import * as RadixToast from '@radix-ui/react-toast'

export function Toast() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <RadixToast.Root
        className="bg-red-700/30 absolute top-0 right-0"
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <RadixToast.Title className="flex items-center gap-2 p-5">
          <Prohibit
            className="text-gray-100 bg-red-700"
            width={20}
            height={20}
            weight="bold"
          />
          Error alert
        </RadixToast.Title>

        <RadixToast.Action
          className="p-2"
          asChild
          altText="Close toast"
        >
          <button>
            <X className="text-gray-400" width={16} height={16} weight="bold" />
          </button>
        </RadixToast.Action>
        <div>
          <div className="bg-red-700 w-1/4 h-1" />
        </div>
      </RadixToast.Root>
      <RadixToast.Viewport className="ToastViewport" />
    </>
  )
}
