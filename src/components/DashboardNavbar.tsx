'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import CommandPalette from '@/components/CommandPalette'

export default function DashboardNavbar() {
  const { data: session } = useSession()
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsPaletteOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Resolve user avatar cleanly
  const rawAvatar = session?.user?.avatar
  const avatarSrc = rawAvatar
    ? rawAvatar.startsWith('/')
      ? rawAvatar
      : rawAvatar.startsWith('images/')
      ? `/${rawAvatar}`
      : `/images/${rawAvatar}`
    : '/images/doctor3.jpg'

  const userRole = (session?.user?.role || '').toUpperCase()

  return (
    <>
      <header className="flex justify-between items-center px-6 py-3.5 bg-white border-b border-slate-200">
        {/* Global Search Bar (Triggers Command Palette) */}
        <div 
          onClick={() => setIsPaletteOpen(true)}
          className="flex-1 max-w-md cursor-pointer"
        >
          <div className="relative group">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-teal-600 transition text-base" />
            <input
              type="text"
              readOnly
              placeholder="Search patients, medical records, appointments..."
              className="w-full pl-10 pr-16 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 cursor-pointer focus:outline-none group-hover:border-slate-400 transition bg-slate-50/50"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
              Ctrl K
            </kbd>
          </div>
        </div>

      {/* User Profile & Role Info */}
      <div className="flex items-center gap-3.5 ml-4">
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm font-semibold text-slate-900">
              {session?.user?.name || (userRole === 'PATIENT' ? 'Patient' : 'Medical Staff')}
            </span>
            {userRole && (
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  userRole === 'ADMIN'
                    ? 'bg-purple-100 text-purple-700'
                    : userRole === 'DOCTOR'
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {userRole}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {session?.user?.department || (userRole === 'PATIENT' ? 'Patient Portal' : userRole === 'ADMIN' ? 'Hospital Governance' : 'Hospital Staff')}
          </p>
        </div>

        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
          <Image
            src={avatarSrc}
            alt="Profile photo"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </header>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />
    </>
  )
}