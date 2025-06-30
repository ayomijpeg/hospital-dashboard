// src/components/OverviewCards.tsx

import { FaCalendarAlt, FaUser, FaClinicMedical, FaVideo } from 'react-icons/fa'

const cards = [
  {
    icon: <FaCalendarAlt size={20} />,
    label: 'Appointments',
    value: '24.4k',
    color: 'bg-purple-500',
  },
  {
    icon: <FaUser size={20} />,
    label: 'Total Patient',
    value: '166.3k',
    color: 'bg-pink-500',
  },
  {
    icon: <FaClinicMedical size={20} />,
    label: 'Clinic Consulting',
    value: '53.5k',
    color: 'bg-orange-400',
  },
  {
    icon: <FaVideo size={20} />,
    label: 'Video Consulting',
    value: '28.0k',
    color: 'bg-blue-500',
  },
]

export default function OverviewCards() {
  return (
    <div className="px-6 py-4 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Welcome, Dev. AYOMI</h2>
        <p className="text-sm text-gray-400">Have a nice day at great work</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-lg p-4 text-white ${card.color}`}>
            <div className="flex items-center gap-2">
              <div className="text-white bg-white/20 p-2 rounded-md">{card.icon}</div>
              <div>
                <p className="text-lg font-bold">{card.value}</p>
                <p className="text-xs opacity-90">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
