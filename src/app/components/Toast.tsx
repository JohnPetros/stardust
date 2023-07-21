'use client'
import { useEffect, useState } from 'react'
import { Prohibit, X } from '@phosphor-icons/react'
import * as Container from '@radix-ui/react-toast'

export function Toast() {
  const [isOpen, setIsOpen] = useState(true)

  
 
  return (
    <>
      <Container.Viewport className="fixed top-4 right-4 max-w-[90vw] z-50 flex" />
      <Container.Root
        className="bg-red-700/50 rounded w-full"
        open={true}
        // onOpenChange={setIsOpen}
      >
        <div className="flex justify-between p-4 gap-6">
          <Container.Title className="flex items-center gap-2 text-gray-100 font-medium">
            <span className="text-gray-100 bg-red-700 rounded p-1">
              <Prohibit className="" width={20} height={20} weight="bold" />
            </span>
            Usuário não encontrado
          </Container.Title>

          <Container.Action className="w-max" asChild altText="Close toast">
            <button>
              <X
                className="text-gray-400"
                width={20}
                height={20}
                weight="bold"
              />
            </button>
          </Container.Action>
        </div>

        <div className='w-full rounded'>
          <div className="bg-red-700 w-1/4 h-1" />
        </div>
      </Container.Root>
    </>
  )
}
