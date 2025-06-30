'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const genderData = [
  { name: 'Male', value: 45 },
  { name: 'Female', value: 30 },
  { name: 'Child', value: 25 },
]

const COLORS = ['#FFA500', '#A259FF', '#00BFFF']

export default function PatientsAndGenderPanel() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-6">
      {/* Patients Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800">Patients</h3>
          <span className="text-sm text-gray-600">2020</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span className="text-sm text-gray-700">🧑‍⚕️ New Patient</span>
            <span className="font-bold text-gray-800">24.4k</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span className="text-sm text-gray-700">🧓 Old Patient</span>
            <span className="font-bold text-gray-800">166.3k</span>
          </div>
        </div>
      </div>

      {/* Gender Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800">Gender</h3>
          <span className="text-sm text-gray-600">2020</span>
        </div>

        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={30}
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* chart */}
        <div className="text-sm mt-4 space-y-1 text-gray-700">
          <p className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#FFA500]"></span>
            Male - 45%
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#A259FF]"></span>
            Female - 30%
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#00BFFF]"></span>
            Child - 25%
          </p>
        </div>
      </div>
    </div>
  )
}
