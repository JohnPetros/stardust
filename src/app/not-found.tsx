'use client'

import { useRouter } from 'next/navigation'

import { Button } from './components/Button'
import PageNotFound from '../../public/animations/404.json'
import Lottie from 'lottie-react'

import { motion, Variants } from 'framer-motion'

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
    <main className="bg-gray-900 w-screen h-screen grid place-content-center">
      <motion.div
        variants={notFoundAnimation}
        initial="down"
        animate="up"
        className="w-full max-w-3xl"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 uppercase ">
          <h1 className="font-semibold text-green-400 text-6xl">
            Código <span className="sr-only">404</span>
          </h1>

          <div className="-mt-[2rem]">
            <Lottie animationData={PageNotFound} style={{ width: 240 }} />
          </div>
        </div>

        <div className="-mt-6">
          <p className="text-gray-300 text-lg leading-8">
            Parece que você se perdeu no espaço! <br /> Clique abaixo para
            puxarmos você de volta.
          </p>
        </div>

        <Button className="mt-6" onClick={router.back}>
          Retornar
        </Button>
      </motion.div>
    </main>
  )
}
