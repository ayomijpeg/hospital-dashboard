// src/hooks/useUser.ts
'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

type UserData = {
  id: string
  name: string | null
  email: string | null
  role: string
  image?: string | null
  createdAt: Date
} | null

export function useUser() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<UserData>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        if (status === 'authenticated' && session.user?.id) {
          const res = await fetch(`/api/users/${session.user.id}`)
          if (!res.ok) throw new Error('Failed to fetch user')
          const data = await res.json()
          setUser(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [status, session])

  return { user, loading, error }
}