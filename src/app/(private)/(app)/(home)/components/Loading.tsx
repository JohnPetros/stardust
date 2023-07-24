import { Animation } from "@/app/components/Animation";
import LoadingAnimation from '../../../../../../public/animations/loading.json'

export function Loading() {
  return (
    <Animation src={LoadingAnimation} size={24} />
  )
}
