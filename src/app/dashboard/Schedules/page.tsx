'use client'

import { doctorSchedules } from '@/data/doctorSchedules'
import { FaUserMd, FaClock } from 'react-icons/fa'
import DoctorSchedules from '@/components/DoctorSchedules'

export default function SchedulePage() {
  return (
    <div className="flex min-h-screen bg-[#eaedf0]">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Doctor Schedules</h1>

        <ul className="space-y-4">
          {doctorSchedules.map((doc) => (
            <li
              key={doc.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-1">
                <FaUserMd className="text-blue-500" />
                <p className="text-lg font-medium text-gray-800">{doc.doctor}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 pl-7">
                <span>{doc.department}</span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1">
                  <FaClock className="text-gray-500" />
                  {doc.shift || 'N/A'}
                </span>
              </div>
              <p className="text-sm text-gray-500 pl-7 mt-1">
                Status: <span className="font-semibold text-teal-600">{doc.status}</span> | Scheduled for {doc.date} at {doc.time}
              </p>
            </li>
          ))}
        </ul>

        {/* Calendar Component */}
        <div className="mt-10">
          <DoctorSchedules />
        </div>
      </main>
    </div>
  )
}
