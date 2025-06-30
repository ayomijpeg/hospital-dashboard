// src/components/AppointmentOverview.tsx
'use client'

import AppointmentCard from './AppointmentCard'
import Link from 'next/link'
import { appointments } from '@/data/appointments'

export default function AppointmentOverview() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Appointment Request</h3>
        <Link href="/appointments" className="text-sm text-blue-500 hover:underline">
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {appointments.slice(0, 4).map((apt) => (
          <AppointmentCard key={apt.id} data={apt} />
        ))}
      </div>
    </div>
  )
}
