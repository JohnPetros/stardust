import user from './user'
import planet from './planet'
import star from './star'
import avatar from './avatar'
import achievement from './achievement'
import rocket from './rocket'
import ranking from './ranking'
import challenge from './challenge'
import category from './category'

export function useApi() {
  return {
    ...star(),
    ...user(),
    ...planet(),
    ...avatar(),
    ...achievement(),
    ...rocket(),
    ...ranking(),
    ...challenge(),
    ...category(),
  }
}
