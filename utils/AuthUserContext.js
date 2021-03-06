import { createContext, useContext } from 'react'
import useSupabaseAuth from './useSupabaseAuth'

const authUserContext = createContext({
  authUser: null,
  loading: true,
  handleLogin: async () => {},
  handleSignup: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  getProfile: async () => {},
  updateProfile: async () => {},
  deleteAccount: async () => {},
  reset: async () => {},
  updatePassword: async () => {},
  uploadAvatar: async () => {},
})

export function AuthUserProvider({ children }) {
  const auth = useSupabaseAuth()
  return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(authUserContext)