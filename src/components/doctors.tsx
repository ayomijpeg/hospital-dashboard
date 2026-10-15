'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react'

type DoctorSummary = {
  id: number
  name: string
  department: string
  avatar: string | null
  gender: string
  status: string
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<DoctorSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) setDoctors(data)
        }
      } catch (err) {
        console.error('Error fetching doctors:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  const resolveAvatar = (doc: DoctorSummary) => {
    if (doc.avatar) {
      return doc.avatar.startsWith('/')
        ? doc.avatar
        : doc.avatar.startsWith('images/')
        ? `/${doc.avatar}`
        : `/images/${doc.avatar}`
    }
    return doc.gender === 'Female' ? '/images/female-doctor.jpg' : '/images/male-doctor.jpg'
  }

  const topDoctors = doctors.slice(0, 4)

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 tracking-tight">Medical Clinicians on Duty</h2>
              <p className="text-[11px] text-slate-400">Board-certified specialists & faculty</p>
            </div>
          </div>
          <Link
            href="/dashboard/doctors"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 transition"
          >
            <span>Roster ({doctors.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Doctor preview list */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-7 h-7 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
          </div>
        ) : topDoctors.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center italic">
            No doctors currently registered.
          </p>
        ) : (
          <div className="space-y-2.5">
            {topDoctors.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition border border-slate-200/60"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-2xs">
                    <Image
                      src={resolveAvatar(doc)}
                      alt={doc.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      {doc.name.startsWith('Dr.') ? doc.name : `Dr. ${doc.name}`}
                    </h4>
                    <span className="text-[11px] text-teal-700 font-medium">
                      {doc.department}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {doc.status || 'Available'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Active Departments: Cardiology, Pediatrics, Neurology</span>
      </div>
    </div>
  )
}
