'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { 
  FaCalendarAlt, FaUsers, FaClock, FaFileAlt, 
  FaCog, FaThLarge, FaFileInvoiceDollar, FaBars, FaTimes,
  FaUserMd, FaSignOutAlt
} from 'react-icons/fa'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

type LogoutButtonProps = {
  isSidebarOpen: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ isSidebarOpen }) => {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut({ callbackUrl: '/login' })
    } catch (err) {
      console.error('Logout error:', err)
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-3 py-2.5 rounded-lg transition-colors text-rose-600 hover:bg-rose-50 w-full group relative ${
        isSidebarOpen ? 'px-4' : 'justify-center'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Sign Out"
    >
      <FaSignOutAlt className={`text-base shrink-0 ${loading ? 'animate-spin' : ''}`} />
      
      {isSidebarOpen && (
        <span className="font-medium text-sm">
          {loading ? 'Signing out...' : 'Sign Out'}
        </span>
      )}
      
      {!isSidebarOpen && (
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block bg-slate-900 text-white px-3 py-1.5 rounded-md text-xs whitespace-nowrap z-50 shadow-lg">
          Sign Out
        </span>
      )}
    </button>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const userRole = (session?.user?.role || '').toUpperCase()

  // Role-specific navigation items
  const navItems = React.useMemo(() => {
    if (userRole === 'PATIENT' || userRole === 'USER') {
      return [
        { label: 'Health Portal', icon: FaThLarge, href: '/dashboard' },
        { label: 'My Appointments', icon: FaCalendarAlt, href: '/dashboard/appointments' },
        { label: 'Doctor Directory', icon: FaUserMd, href: '/dashboard/doctors' },
        { label: 'My Invoices & Bills', icon: FaFileInvoiceDollar, href: '/dashboard/billing' },
        { label: 'Health Articles', icon: FaFileAlt, href: '/dashboard/blog' },
        { label: 'Profile & Settings', icon: FaCog, href: '/dashboard/settings' },
      ]
    }

    if (userRole === 'ADMIN') {
      return [
        { label: 'Executive Overview', icon: FaThLarge, href: '/dashboard' },
        { label: 'Governance & Staff', icon: FaCog, href: '/dashboard/admin' },
        { label: 'All Appointments', icon: FaCalendarAlt, href: '/dashboard/appointments' },
        { label: 'Patient Master', icon: FaUsers, href: '/dashboard/patients' },
        { label: 'Doctors & Staff', icon: FaUserMd, href: '/dashboard/doctors' },
        { label: 'Roster & Shifts', icon: FaClock, href: '/dashboard/Schedules' },
        { label: 'Hospital Financials', icon: FaFileInvoiceDollar, href: '/dashboard/billing' },
        { label: 'Announcements', icon: FaFileAlt, href: '/dashboard/blog' },
        { label: 'System Settings', icon: FaCog, href: '/dashboard/settings' },
      ]
    }

    if (userRole === 'DOCTOR') {
      return [
        { label: 'Overview', icon: FaThLarge, href: '/dashboard' },
        { label: 'Appointments', icon: FaCalendarAlt, href: '/dashboard/appointments' },
        { label: 'Patients', icon: FaUsers, href: '/dashboard/patients' },
        { label: 'Doctor Directory', icon: FaUserMd, href: '/dashboard/doctors' },
        { label: 'Schedule Timings', icon: FaClock, href: '/dashboard/Schedules' },
        { label: 'Billing & Invoices', icon: FaFileInvoiceDollar, href: '/dashboard/billing' },
        { label: 'Medical Blog', icon: FaFileAlt, href: '/dashboard/blog' },
        { label: 'Settings', icon: FaCog, href: '/dashboard/settings' },
      ]
    }

    // While loading or unauthenticated, return empty
    return []
  }, [userRole])

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  return (
    <aside 
      role="navigation"
      aria-label="Main navigation"
      className={`sticky top-0 h-screen ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } bg-white border-r border-slate-200 flex flex-col font-sans transition-all duration-300 ease-in-out z-40 shrink-0`}
    >
      {/* Logo and Branding Header */}
      <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} px-4 py-6 border-b border-slate-100 h-20`}>
        <Link href="/dashboard" className={`flex items-center gap-3 ${!isSidebarOpen ? 'hidden' : ''}`}>
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
            <Image
              src="/images/logo.png"
              alt="Hospital Logo"
              width={24} 
              height={24}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
              Doct<span className="text-teal-600">.</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {userRole === 'ADMIN' ? 'Hospital Admin' : (userRole === 'PATIENT' || userRole === 'USER') ? 'Patient Portal' : 'Clinical Portal'}
            </span>
          </div>
        </Link>
        
        {/* Toggle Collapse */}
        <button 
          className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition" 
          onClick={toggleSidebar}
          aria-expanded={isSidebarOpen}
          aria-label="Toggle navigation"
        >
          {isSidebarOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav 
        id="sidebar-nav" 
        className="flex-1 space-y-1 text-sm mt-4 px-3 overflow-y-auto"
      >
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 py-2.5 rounded-lg transition-all group relative font-medium ${
                isActive 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              } ${
                isSidebarOpen 
                  ? 'px-3.5' 
                  : 'justify-center' 
              }`}
            >
              <Icon size={17} className="shrink-0" />
              {isSidebarOpen && <span>{label}</span>}
              
              {!isSidebarOpen && (
                <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block bg-slate-900 text-white px-3 py-1.5 rounded-md text-xs whitespace-nowrap z-50 shadow-lg">
                  {label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button at Bottom */}
      <div className={`mt-auto p-3.5 pb-10 border-t border-slate-100 ${!isSidebarOpen ? 'flex justify-center' : ''}`}>
        <LogoutButton isSidebarOpen={isSidebarOpen} />
      </div>
    </aside>
  )
}
