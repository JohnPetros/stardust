import { notFound } from 'next/navigation'

import { Header } from './components/Header'

import { Playground } from '@/@types/playground'
import { createSupabaseServerClient } from '@/services/api/supabase/clients/serverClient'
import { PlaygroundsController } from '@/services/api/supabase/controllers/playgroundsController'

let playground: Playground

type UserPlaygroundPageProps = {
  params: { playgroundId: string }
}

export default async function UserPlaygroundPage({
  params: { playgroundId },
}: UserPlaygroundPageProps) {
  const supabase = createSupabaseServerClient()
  const playgroudsController = PlaygroundsController(supabase)

  try {
    playground = await playgroudsController.getPlaygroundById(playgroundId)
  } catch (error) {
    console.error(error)
    notFound()
  }

  return (
    <>
      <Header playgroundTitle={playground.title} />
    </>
  )
}
