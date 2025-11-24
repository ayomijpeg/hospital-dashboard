'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react' // Import React for types
import { 
  FaCalendarAlt, FaUsers, FaClock, FaFileAlt, 
  FaCog, FaThLarge, FaFileInvoiceDollar, FaBars, FaTimes 
} from 'react-icons/fa' // This import is necessary
import Image from 'next/image' // This import is necessary
// Make sure to import your real LogoutButton
// import LogoutButton from './LogoutButton'

// --- START: TypeScript Fix ---
// We need to define the props type for the LogoutButton
type LogoutButtonProps = {
  isSidebarOpen: boolean;
}

// Apply the type to the component's props
const LogoutButton: React.FC<LogoutButtonProps> = ({ isSidebarOpen }) => (
// --- END: TypeScript Fix ---
  <button className={`flex items-center gap-3 py-2 rounded-md transition-colors text-red-500 hover:bg-red-50 w-full group relative ${isSidebarOpen ? 'px-4' : 'justify-center'}`}>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
    
    {isSidebarOpen && <span className="font-medium">Logout</span>}
    
    {/* Tooltip for collapsed state */}
    {!isSidebarOpen && (
      <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap z-10">
        Logout
      </span>
    )}
  </button>
);


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
  // Default to true (expanded) for desktop-first
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  return (
    <aside 
      role="navigation"
      aria-label="Main navigation"
      // This is the key change: `fixed` position
      className={`fixed top-0 left-0 h-screen ${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r flex flex-col font-sans transition-all duration-300 ease-in-out z-50`}
    >
      {/* Logo and Branding Header */}
      <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} px-4 py-6 border-b border-gray-200 h-20`}>
        <div className={`flex items-center gap-3 ${!isSidebarOpen ? 'hidden' : ''}`}>
          <Image
            src="/images/logo.png" // Your original image path
            alt="Hospital Dashboard Logo"
            width={40} 
            height={40}
            className="rounded-md"
            // Optional: fallback for broken image link
            onError={(e) => (e.currentTarget.src = 'https://placehold.co/40x40/0D0D2B/FFFFFF?text=D')}
          />
          <h1 className="text-xl font-bold text-gray-800">Doct.</h1>
        </div>
        
        {/* Hamburger / Close Icon */}
        <button 
          className="text-gray-600 hover:text-gray-900 p-2 rounded-md" 
          onClick={toggleSidebar}
          aria-expanded={isSidebarOpen}
          aria-controls="sidebar-nav"
        >
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav 
        id="sidebar-nav" 
        className="flex-1 space-y-2 text-sm mt-4 px-4 overflow-y-auto"
      >
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href
          return (
            // Using Next.js Link for client-side routing
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 py-3 rounded-md transition-colors group relative ${
                isActive 
                  ? 'bg-[#0D0D2B] text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100'
              } ${
                isSidebarOpen 
                  ? 'px-4' // Padding when open
                  : 'justify-center' // Center icon when collapsed
              }`}
            >
              <Icon size={18} />
              {isSidebarOpen && <span className="font-medium">{label}</span>}
              
              {/* Tooltip for collapsed state */}
              {!isSidebarOpen && (
                <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap z-10">
                  {label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button at Bottom */}
      <div className={`mt-auto p-4 border-t border-gray-200 ${!isSidebarOpen ? 'flex justify-center' : ''}`}>
        <LogoutButton isSidebarOpen={isSidebarOpen} />
      </div>
    </aside>
  )
}
