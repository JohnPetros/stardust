import { unstable_createContext } from 'react-router'

type AuthContext = {
  accessToken: string
}

export const authContext = unstable_createContext<AuthContext>()
