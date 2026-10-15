'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CalendarCheck, Users, Stethoscope, DollarSign } from 'lucide-react'

type Metrics = {
  appointments: number
  patients: number
  doctors: number
  totalRevenue: number
}

export default function OverviewCards() {
  const { data: session } = useSession()
  const [metrics, setMetrics] = useState<Metrics>({
    appointments: 0,
    patients: 0,
    doctors: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/analytics/summary')
        if (res.ok) {
          const data = await res.json()
          setMetrics(data)
        }
      } catch (err) {
        console.error('Error fetching analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  const userRole = (session?.user?.role || 'DOCTOR').toUpperCase()
  const userName = session?.user?.name || 'Medical Officer'

  const greeting =
    userRole === 'ADMIN'
      ? `Hospital Command Center — ${userName}`
      : userRole === 'PATIENT'
      ? `Welcome to your Health Portal, ${userName}`
      : `Good day, ${userName.startsWith('Dr.') ? userName : `Dr. ${userName}`}`

  const subGreeting =
    userRole === 'ADMIN'
      ? 'Overview of hospital bed occupancy, physician workload, and financial collections'
      : userRole === 'PATIENT'
      ? 'Manage your scheduled appointments, clinical consultations, and invoices'
      : 'Review today’s patient appointments, clinical schedule, and hospital duty'

  const cards = [
    {
      label: 'Scheduled Appointments',
      value: loading ? '...' : metrics.appointments.toLocaleString(),
      subtext: 'Upcoming patient visits',
      icon: CalendarCheck,
      iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      label: 'Registered Patients',
      value: loading ? '...' : metrics.patients.toLocaleString(),
      subtext: 'Active clinical health records',
      icon: Users,
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      label: 'Medical Practitioners',
      value: loading ? '...' : metrics.doctors.toLocaleString(),
      subtext: 'Specialists & attending staff',
      icon: Stethoscope,
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      label: 'Collected Revenue',
      value: loading ? '...' : `₦${metrics.totalRevenue.toLocaleString()}`,
      subtext: 'Settled clinical billing',
      icon: DollarSign,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ]

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      {/* Welcome & Role Header */}
      <div className="mb-6 pb-5 border-b border-slate-100">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {greeting}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {subGreeting}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </span>
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${card.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {card.value}
                </div>
                <p className="text-xs text-slate-400 mt-1">{card.subtext}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
