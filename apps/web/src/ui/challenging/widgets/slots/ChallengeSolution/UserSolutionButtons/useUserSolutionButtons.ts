import { useApi } from '@/ui/global/hooks'

export function useUserSolutionButtons(solutionId: string) {
  const api = useApi()

  async function handleDeleteSolutionButtonClick() {
    await api.deleteSolution(solutionId)
  }

  return {
    handleDeleteSolutionButtonClick,
  }
}
