// src/app/dashboard/layout.tsx
'use client'

import Sidebar from '@/components/Sidebar'
import DashboardNavbar from '@/components/DashboardNavbar'
import { Providers } from '../provider'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
    <div className="flex min-h-screen bg-[#eaedf0]">
      <div className="w-[250px] border-r bg-white">
        <Sidebar />
      </div>
      <main className="flex-1 p-6 space-y-6">
        <DashboardNavbar />
        {children}
      </main>
    </div>
    </Providers>
  )
}
