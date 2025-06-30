// src/components/DoctorList.tsx
'use client'
import { useDoctors } from '@/hooks/useDoctors'

type Doctor = {
  id: number
  name: string
  specialty: string
  department: string
  email: string
}
export default function DoctorList() {
  const { doctors, loading } = useDoctors()

  if (loading) return <p>Loading doctors...</p>

  return (
    <ul className="space-y-4">
      {doctors.map((doctor: Doctor) => (
        <li key={doctor.id} className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-semibold">{doctor.name}</h3>
          <p className="text-sm text-gray-600">{doctor.specialty}</p>
        </li>
      ))}
    </ul>
  )
}
