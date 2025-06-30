'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'

export default function DashboardNavbar() {
  const { data: session, status } = useSession()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  if (status === 'loading') return <div className="h-16 bg-white border-b"></div>

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white border-b">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients, appointments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      {/* User Profile */}
      <div className="flex items-center gap-3 ml-4">
        <div className="text-right">
          <p className="text-sm font-medium">
            {session?.user?.name || 'Doctor'}
          </p>
          <p className="text-xs text-gray-500">
            {session?.user?.department || 'Department'}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-50 overflow-hidden border border-blue-100">
          <Image
            src="/images/doctor3.jpg"
            alt="Doctor profile"
            width={32}
            height={32}
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
}