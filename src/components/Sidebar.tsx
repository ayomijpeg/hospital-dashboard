'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FaCalendarAlt, FaUsers, FaClock, FaFileAlt, FaCog, FaThLarge, FaFileInvoiceDollar, FaBars, FaTimes } from 'react-icons/fa'
import Image from 'next/image'
import LogoutButton from './LogoutButton'

const navItems = [
  { label: 'Overview', icon: FaThLarge, href: '/dashboard' },
  { label: 'Appointment', icon: FaCalendarAlt, href: '/dashboard/appointments' },
  { label: 'My Patients', icon: FaUsers, href: '/dashboard/patients' },
  { label: 'Schedule Timings', icon: FaClock, href: '/dashboard/Schedules' },
  { label: 'Blog', icon: FaFileAlt, href: '/dashboard/blog' },
  { label: 'Billing', icon: FaFileInvoiceDollar, href: '/dashboard/billing' },
  { label: 'Settings', icon: FaCog, href: '/dashboard/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Track sidebar state

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  return (
    <div className={`h-screen ${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r px-4 py-6 flex flex-col font-sans transition-all`}>
      {/* Logo and Branding */}
      <div className="flex items-center gap-3 mb-1">
        <Image
          src="/images/logo.png"
          alt="Hospital Dashboard Logo"
          width={50}
          height={50}
        />
        {isSidebarOpen && <h1 className="text-xl font-bold text-gray-800">Doct.</h1>}
      </div>

      {/* Hamburger / Close Icon */}
      <button 
        className="md:hidden text-gray-600 p-2" 
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Navigation Items */}
      <nav className="space-y-2 text-sm mt-0 flex-1">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-[#0D0D2B] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Icon size={18} />
              {isSidebarOpen && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button at Bottom */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <LogoutButton />
      </div>
    </div>
  )
}
