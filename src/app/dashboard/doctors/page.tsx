'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import CreateDoctor from '@/components/CreateDoctor'
import { Stethoscope, Mail, CheckCircle2, Clock, Calendar } from 'lucide-react'

type Doctor = {
  id: number
  name: string
  department: string
  gender: string
  email: string
  avatar: string | null
  status: string
}

export default function DoctorsPage() {
  const { data: session } = useSession()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  const userRole = (session?.user?.role || 'PATIENT').toUpperCase()
  const isAdmin = userRole === 'ADMIN'

  const fetchDoctors = async () => {
    try {
      setLoading(true)
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

  const resolveAvatar = (doc: Doctor) => {
    if (doc.avatar) {
      return doc.avatar.startsWith('/')
        ? doc.avatar
        : doc.avatar.startsWith('images/')
        ? `/${doc.avatar}`
        : `/images/${doc.avatar}`
    }
    return doc.gender === 'Female' ? '/images/female-doctor.jpg' : '/images/male-doctor.jpg'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Medical Practitioner Directory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Active hospital clinicians, departments, and clinical availability
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm shrink-0">
          <Stethoscope className="w-4 h-4 text-teal-600" />
          <span>Active Staff:</span>
          <span className="font-mono font-bold text-slate-900">{doctors.length}</span>
        </div>
      </div>

      {/* Add Doctor Accordion Form (Admin Only) */}
      {isAdmin && <CreateDoctor onDoctorCreated={fetchDoctors} />}

      {/* Doctors Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base">No medical staff found</h3>
          <p className="text-sm text-slate-500 mt-1">
            {isAdmin ? 'Click "+ New Doctor" above to register a clinician.' : 'Active clinicians will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    <Image
                      src={resolveAvatar(doc)}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base text-slate-900 truncate">
                      Dr. {doc.name}
                    </h2>
                    <p className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded inline-block mt-1">
                      {doc.department}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2 text-slate-500 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      doc.status === 'Available'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {doc.status === 'Available' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Clock className="w-3 h-3 text-amber-600" />
                    )}
                    {doc.status || 'Available'}
                  </span>

                  <span className="text-[11px] font-mono text-slate-400">
                    ID: #{String(doc.id).padStart(4, '0')}
                  </span>
                </div>

                {userRole === 'PATIENT' && (
                  <Link
                    href="/dashboard/appointments"
                    className="mt-3.5 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg border border-teal-200 transition"
                  >
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>Book Consultation</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
