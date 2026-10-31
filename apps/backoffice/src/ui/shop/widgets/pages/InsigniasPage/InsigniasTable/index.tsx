import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { InsigniasTableView } from './InsigniasTableView'
import { useInsigniasTable } from './useInsigniasTable'

export const InsigniasTable = () => {
  const { shopService, storageService } = useRestContext()
  const toastProvider = useToastProvider()
  const {
    insignias,
    isLoading,
    handleCreateInsignia,
    handleUpdateInsignia,
    handleDeleteInsignia,
  } = useInsigniasTable({
    shopService,
    toastProvider,
    storageService,
  })

  return (
    <InsigniasTableView
      insignias={insignias}
      isLoading={isLoading}
      handleCreateInsignia={handleCreateInsignia}
      handleUpdateInsignia={handleUpdateInsignia}
      handleDeleteInsignia={handleDeleteInsignia}
    />
  )
}
