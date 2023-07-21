'use client'
import { useEffect, useState } from 'react'
import { Prohibit, X } from '@phosphor-icons/react'
import * as Container from '@radix-ui/react-toast'
import {
  AnimatePresence,
  Variants,
  motion,
  useAnimate,
  useDragControls,
} from 'framer-motion'
const TOAST_DURATION = 2500

export function Toast() {
  const [isOpen, setIsOpen] = useState(true)
  const [scope, animate] = useAnimate()

  const toastVariants: Variants = {
    initial: {
      opacity: 0,
      x: 250,
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        duration: 0.4,
      },
    },
    close: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  const barVariants: Variants = {
    full: {
      width: '100%',
    },
    empty: {
      width: 0,
      transition: {
        ease: 'linear',
        duration: TOAST_DURATION / 1000,
      },
    },
  }

  function close() {
    setIsOpen(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      close()
    }, TOAST_DURATION)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Container.Viewport className="fixed top-4 right-4  rounded  max-w-[90vw] z-50 flex" />
      <AnimatePresence>
        {isOpen && (
          <Container.Root
            forceMount
            open={isOpen}
            asChild
            // onOpenChange={setIsOpen}
          >
            <motion.div
              ref={scope}
              variants={toastVariants}
              initial="initial"
              animate="open"
              exit="close"
              drag="x"
              dragConstraints={{
                left: 0,
                right: 10,
              }}
              dragElastic={0.8}
              onDragEnd={() => {
                animate(scope.current, { x: 500 }, { duration: 0.1 })
                close()
              }}
              className="bg-red-700/50 rounded"
            >
              <div className="flex justify-between gap-6 p-4 ">
                <Container.Title className="flex items-center gap-2 text-gray-100 font-medium">
                  <span className="text-gray-100 bg-red-700 rounded p-1">
                    <Prohibit
                      className=""
                      width={20}
                      height={20}
                      weight="bold"
                    />
                  </span>
                  Usuário não encontrado
                </Container.Title>

                <Container.Action
                  className="w-max"
                  asChild
                  altText="Close toast"
                >
                  <button onClick={close}>
                    <X
                      className="text-gray-400"
                      width={20}
                      height={20}
                      weight="bold"
                    />
                  </button>
                </Container.Action>
              </div>

              <motion.div
                variants={barVariants}
                initial="full"
                animate="empty"
                className="w-full rounded"
              >
                <div className="bg-red-700 h-1" />
              </motion.div>
            </motion.div>
          </Container.Root>
        )}
      </AnimatePresence>
    </>
  )
}
