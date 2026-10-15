'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, Activity } from 'lucide-react'

// Clinical palette: Deep Teal, Slate Graphite, Cerulean Blue
const COLORS = ['#0F766E', '#334155', '#0284C7']

type Demographic = {
  name: string
  count: number
  percentage: number
}

export default function PatientsAndGenderPanel() {
  const [demographics, setDemographics] = useState<Demographic[]>([
    { name: 'Adult (18-59)', count: 0, percentage: 58 },
    { name: 'Senior (60+)', count: 0, percentage: 26 },
    { name: 'Pediatric (<18)', count: 0, percentage: 16 },
  ])
  const [totalPatients, setTotalPatients] = useState(0)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/analytics/summary')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data.demographics)) {
            setDemographics(data.demographics)
          }
          if (data.patients !== undefined) {
            setTotalPatients(data.patients)
          }
        }
      } catch (err) {
        console.error('Failed to load demographics:', err)
      }
    }
    fetchSummary()
  }, [])

  const chartData = demographics.map((d) => ({
    name: d.name,
    value: d.percentage,
  }))

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 tracking-tight">Patient Demographics</h3>
              <p className="text-[11px] text-slate-400">Cohort distribution across registry</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            {totalPatients} Total
          </span>
        </div>

        {/* Donut Chart Container */}
        <div className="w-full h-48 relative my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={52}
                paddingAngle={4}
                stroke="#FFFFFF"
                strokeWidth={2.5}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value}%`, 'Cohort Share']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Indicator */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Activity className="w-4 h-4 text-teal-600 mb-0.5" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Registry</span>
          </div>
        </div>
      </div>

      {/* Breakdown Legend */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
        {demographics.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-slate-700 font-medium">{item.name}</span>
            </div>
            <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
