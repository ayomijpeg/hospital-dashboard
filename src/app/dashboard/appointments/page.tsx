// src/app/dashboard/appointments/page.tsx


import AppointmentCard from '@/components/AppointmentCard'
import { appointments } from '@/data/appointments'
import { Appointment } from '@/types/appointment'
export const metadata = {
  title: 'Appointment | Hospital Management',
  description: 'Hospital data at your fingertips.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function AppointmentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">All Appointments</h1>
      <div className="space-y-4">
        {appointments.map((apt: Appointment) => (
          <AppointmentCard key={apt.id} data={apt} showActions />
        ))}
      </div>
    </div>
  )
}
