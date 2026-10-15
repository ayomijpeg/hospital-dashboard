'use client'

import { Suspense } from 'react'
import Sidebar from '@/components/Sidebar'
import DashboardNavbar from '@/components/DashboardNavbar'
import AccessAlert from '@/components/AccessAlert'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <Suspense fallback={null}>
            <AccessAlert />
          </Suspense>
          {children}
        </main>
      </div>
    </div>
  )
}
