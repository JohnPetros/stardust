import { RocketsTable } from './RocketsTable'

export const RocketsPageView = () => {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold text-zinc-100'>Foguetes</h1>
        <p className='text-sm text-zinc-400'>
          Gerencie todos os foguetes disponíveis na loja
        </p>
      </div>
      <RocketsTable />
    </div>
  )
}
