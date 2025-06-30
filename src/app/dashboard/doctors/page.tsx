'use client'

import { useEffect, useState } from 'react'
import CreateDoctor from '@/components/CreateDoctor'

type Doctor = {
  id: number
  name: string
  specialty: string
  department: string
  email: string
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

 
  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors')
      const data = await res.json()
      if (Array.isArray(data)) {
        setDoctors(data)
      } else {
        console.error('Unexpected response:', data)
      }
    } catch (error) {
      console.error('Failed to load doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  return (
    <div className="p-6 min-h-screen bg-[#f4f6f8]">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor Directory</h1>

     {/* Doctor Form */}
      <CreateDoctor onDoctorCreated={fetchDoctors} />

      {loading ? (
        <p className="text-gray-500">Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p className="text-gray-500">No doctors found.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => (
            <li key={doc.id} className="bg-white p-4 rounded-xl shadow border">
              <h2 className="font-semibold text-lg text-gray-800">{doc.name}</h2>
              <p className="text-sm text-gray-600">
                {doc.specialty} - {doc.department}
              </p>
              <p className="text-sm text-gray-500 mt-1">{doc.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
