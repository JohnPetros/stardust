import { ShopPageView } from './ShopPageView'
import { useRest } from '@/ui/global/hooks/useRest'

export const ShopPage = () => {
  const { shopService } = useRest()

  return <ShopPageView shopService={shopService} />
}
