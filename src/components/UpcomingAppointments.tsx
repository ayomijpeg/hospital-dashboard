'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AppointmentCard from './AppointmentCard'
import { Appointment } from '@/types/appointment'
import { useSession } from 'next-auth/react'
import { CalendarCheck, ArrowRight, RotateCw } from 'lucide-react'

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
          'Content-Type': 'application/json',
        },
      })

      const responseText = await res.text()

      if (!res.ok) {
        try {
          const errorData = JSON.parse(responseText)
          throw new Error(errorData.details || errorData.error || 'Failed to fetch appointments')
        } catch {
          throw new Error(responseText || `Request failed with status ${res.status}`)
        }
      }

      const data = JSON.parse(responseText)
      setAppointments(Array.isArray(data) ? data : [])
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
    fetchAppointments()
  }, [session?.user?.id])

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      {/* 🏥 Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Upcoming Appointments
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {appointments.length} Scheduled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Clinical encounters scheduled for review, diagnostic workup, and attending follow-ups
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchAppointments}
            disabled={loading}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 disabled:opacity-50"
            title="Refresh list"
            aria-label={loading ? 'Refreshing appointments' : 'Refresh appointments'}
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-600' : ''}`} />
          </button>

          <Link
            href="/dashboard/appointments"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 📋 Body */}
      <div className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
            <div className="w-7 h-7 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Loading clinical encounters...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-rose-600 font-medium mb-3">{error}</p>
            <button
              onClick={fetchAppointments}
              className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition"
            >
              Retry
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-6">
            <CalendarCheck className="w-9 h-9 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No upcoming appointments on roster</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              New patient consultations will appear here once booked or triaged
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.slice(0, 3).map((apt) => (
              <AppointmentCard
                key={apt.id}
                data={apt}
                showActions={apt.status === 'Pending'}
                onUpdateStatus={async (id, status) => {
                  try {
                    await fetch(`/api/appointments/${id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status }),
                    })
                    fetchAppointments()
                  } catch (err) {
                    console.error('Update failed:', err)
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}