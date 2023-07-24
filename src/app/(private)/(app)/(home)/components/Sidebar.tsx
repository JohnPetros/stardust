'use client'
import { UserAvatar } from './UserAvatar'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/app/components/Button'
import { useSiderbar } from '@/hooks/useSiderbar'
import { AnimatePresence, Variants, motion } from 'framer-motion'

const sidebarVariants: Variants = {
  close: {
    x: -320,
  },
  open: {
    x: 0,
    transition: {
      ease: 'linear',
      duration: 0.2,
    },
  },
}

export function Sidebar() {
  const { user } = useAuth()
  if (!user) return null

  const { isOpen } = useSiderbar()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={sidebarVariants}
          initial="close"
          animate="open"
          exit="close"
          className="bg-gray-900 p-6 fixed left-0 h-screen w-80 z-20"
        >
          <div className="flex flex-col items-center justify-center gap-3 text-gray-100">
            <UserAvatar avatarId={user.avatar_id} size={96} />
            <strong>{user?.name}</strong>
            <small className="text-sm">{user?.email}</small>
            <Button className="bg-green-400 text-green-900 px-3 py-2 w-48 mx-aut mt-3">
              Sair
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
