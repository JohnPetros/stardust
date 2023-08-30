'use client'

import { useParams } from "next/navigation"
import { Header } from "./components/Header"

export default function Challenge() {
  const { challengeId } = useParams()

  return (
    <div>
      <Header challengeTitle="Pedido de ajuda" />
    </div>
  )
}
