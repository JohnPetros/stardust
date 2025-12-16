import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/shadcn/components/tabs'
import { RocketsTable } from './RocketsTable'
import { AvatarsTable } from './AvatarsTable'
import type { ShopService } from '@stardust/core/shop/interfaces'

type Props = {
  shopService: ShopService
}

export const ShopPageView = ({ shopService }: Props) => {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold text-zinc-100'>Loja</h1>
        <p className='text-sm text-zinc-400'>
          Gerencie todos os itens cosméticos disponíveis na loja
        </p>
      </div>
      <Tabs defaultValue='rockets'>
        <TabsList>
          <TabsTrigger value='rockets'>Foguetes</TabsTrigger>
          <TabsTrigger value='avatars'>Avatares</TabsTrigger>
        </TabsList>
        <TabsContent value='rockets'>
          <RocketsTable shopService={shopService} />
        </TabsContent>
        <TabsContent value='avatars'>
          <AvatarsTable shopService={shopService} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
