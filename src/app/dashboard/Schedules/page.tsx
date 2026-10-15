'use client'

import { doctorSchedules } from '@/data/doctorSchedules'
import DoctorSchedules from '@/components/DoctorSchedules'
import { Stethoscope, Clock, Calendar } from 'lucide-react'
import RoleGuard from '@/components/RoleGuard'

export default function SchedulePage() {
  return (
    <RoleGuard
      allowedRoles={['DOCTOR', 'ADMIN']}
      fallbackMessage="Hospital shift scheduling and roster management is reserved for Attending Physicians and Hospital Administrators."
    >
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Doctor Shift Roster & Schedules
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daily clinical coverage, specialty duty shifts, and availability calendar
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm shrink-0">
          <Calendar className="w-4 h-4 text-teal-600" />
          <span>Active Roster:</span>
          <span className="font-mono font-bold text-slate-900">{doctorSchedules.length} shifts</span>
        </div>
      </div>

      {/* Calendar & Shift View Component */}
      <DoctorSchedules />

      {/* Shift Roster List */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          All Registered Shift Assignments
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {doctorSchedules.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Dr. {doc.doctor}</h3>
                    <p className="text-xs text-slate-500">{doc.department}</p>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    doc.status === 'Confirmed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {doc.shift || 'General Shift'} ({doc.time})
                </span>
                <span className="font-mono text-slate-500">Date: {doc.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </RoleGuard>
  )
}
