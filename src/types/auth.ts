export type User = {
    uid: string
    email: string | null
    isAdmin: boolean
  }
  
  export type AuthContextType = {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
  }