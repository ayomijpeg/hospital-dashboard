import 'next-auth'
import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string
    department: string
  }

  interface Session extends DefaultSession {
    user?: {
      id: string
      name?: string | null
      email?: string | null
      department: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    department: string
  }
}