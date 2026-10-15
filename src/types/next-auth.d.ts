import 'next-auth'
import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string
    role: string
    department?: string | null
    avatar?: string | null
  }

  interface Session extends DefaultSession {
    user?: {
      id: string
      name?: string | null
      email?: string | null
      role: string
      department?: string | null
      avatar?: string | null
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    department?: string | null
    avatar?: string | null
  }
}