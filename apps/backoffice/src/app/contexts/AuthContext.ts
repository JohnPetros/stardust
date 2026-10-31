import { createContext } from 'react-router'

type AuthContext = {
  accessToken: string
}

export const authContext = createContext<AuthContext>()
