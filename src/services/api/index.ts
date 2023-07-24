import user from './user'
import planet from './planet'
import star from './star'
import avatar from './avatar'

export const api = {
  ...user,
  ...planet,
  ...star,
  ...avatar
}
