// src/components/LogoutButton.tsx
'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaSignOutAlt } from 'react-icons/fa'

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut({ redirect: false })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-3 w-full px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors ${
        isLoading ? 'opacity-70' : ''
      }`}
    >
      <FaSignOutAlt size={18} className={isLoading ? 'animate-spin' : ''} />
      <span className="text-sm">{isLoading ? 'Signing out...' : 'Sign Out'}</span>
    </button>
  )
}