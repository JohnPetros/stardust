'use client'

import { motion, Variants } from 'framer-motion'
import Lottie from 'lottie-react'
import { useRouter } from 'next/navigation'

import PageNotFound from '../../public/animations/404.json'

import { Button } from '../global/components/Button'
import { ROUTES } from '@/global/constants'

const notFoundAnimation: Variants = {
  down: {
    opacity: 0,
    y: 100,
  },
  up: {
    opacity: 1,
    y: 0,
  },
}

export default function NotFound() {
  const router = useRouter()

  return (
    <main className="grid h-screen w-screen place-content-center bg-gray-900">
      <motion.div
        variants={notFoundAnimation}
        initial="down"
        animate="up"
        className="w-full max-w-3xl"
      >
        <div className="flex flex-col items-center gap-3 uppercase sm:flex-row ">
          <h1 className="text-6xl font-semibold text-green-400">
            Código <span className="sr-only">404</span>
          </h1>

          <div className="-mt-[2rem]">
            <Lottie animationData={PageNotFound} style={{ width: 240 }} />
          </div>
        </div>

        <div className="-mt-6">
          <p className="text-lg leading-8 text-gray-300">
            Parece que você se perdeu no espaço! <br /> Clique abaixo para
            puxarmos você de volta.
          </p>
        </div>

        <Button className="mt-6" onClick={() => router.push(ROUTES.private.home.space)}>
          Retornar
        </Button>
      </motion.div>
    </main>
  )
}
