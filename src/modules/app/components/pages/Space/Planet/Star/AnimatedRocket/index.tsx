import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'

import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { useApi } from '@/infra/api'

const rocketVariants: Variants = {
  hidden: {
    opacity: 0,
    y: '-100vh',
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.5,
      type: 'spring',
    },
  },
}

type AnimatedImageProps = {
  shouldAnimate: boolean
}

export function AnimatedRocket({ shouldAnimate }: AnimatedImageProps) {
  const { user } = useAuthContext()
  const api = useApi()
  const rocketImage = api.fetchImage('rockets', user?.rocket.image ?? '')

  return (
    <motion.div
      variants={rocketVariants}
      initial='hidden'
      animate='visible'
      className='h-20 w-20'
    >
      {shouldAnimate && user && (
        <div className='relative h-20 w-20 rotate-180'>
          <Image src={rocketImage} alt={`Foguete ${user.rocket.name.value}`} fill />
        </div>
      )}
    </motion.div>
  )
}
