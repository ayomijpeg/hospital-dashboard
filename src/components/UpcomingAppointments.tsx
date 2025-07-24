'use client'

import { useEffect, useState } from 'react'
import AppointmentCard from './AppointmentCard'
import { Appointment } from '@/types/appointment'
import { useSession } from 'next-auth/react'

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

const fetchAppointments = async () => {
  try {
    setLoading(true)
    setError(null)
    
    const res = await fetch('/api/doctors/appointments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // First read the response as text
    const responseText = await res.text()
    
    // Handle non-200 responses
    if (!res.ok) {
      try {
        // Attempt to parse JSON error
        const errorData = JSON.parse(responseText)
        throw new Error(errorData.details || errorData.error || 'Failed to fetch appointments')
      } catch (e) {
        console.log(e)
        // If not JSON, use the text directly
        throw new Error(responseText || `Request failed with status ${res.status}`)
      }
    }

    // Parse successful response
    const data = JSON.parse(responseText)
    setAppointments(data)
  } catch (err: unknown) {
    console.error('Fetch error:', err)
    if (err instanceof Error) {
      setError(err.message || 'Failed to load appointments')
    } else {
      setError('An unknown error occurred')
    }
  } finally {
    setLoading(false)
  }
}
  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }
    
    fetchAppointments()
  }, [session?.user?.id])

  if (error) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Your Appointments</h2>
        </div>
        
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={fetchAppointments}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 mx-auto"
            aria-label="Try again to load appointments"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Your Appointments</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchAppointments}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label={loading ? "Refreshing appointments" : "Refresh appointments"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={loading ? 'animate-spin' : ''}
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
          </button>
          <a href="/appointments" className="text-sm text-blue-600 hover:underline">
            View All
          </a>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400 italic mb-4">No upcoming appointments found</p>
          <button 
            onClick={fetchAppointments}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Refresh appointments"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <AppointmentCard key={apt.id} data={apt} />
          ))}
        </div>
      )}
    </div>
  )
}