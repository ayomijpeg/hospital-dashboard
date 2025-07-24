// src/components/AppointmentCard.tsx
'use client'

import Image from 'next/image'
import { Appointment } from '@/types/appointment'
import { FaTimes, FaCheck } from 'react-icons/fa'
import { useState } from 'react'

type Props = {
  data: Appointment
  showActions?: boolean
  onUpdateStatus?: (id: string, status: 'Confirmed' | 'Declined') => void
}

export default function AppointmentCard({ data, showActions = false, onUpdateStatus }: Props) {
  const [status, setStatus] = useState(data.status)

  const handleUpdate = (newStatus: 'Confirmed' | 'Declined') => {
    setStatus(newStatus)
    onUpdateStatus?.(data.id, newStatus)
  }

  const statusColor =
    status === 'Confirmed'
      ? 'text-blue-600 bg-blue-100'
      : status === 'Declined'
      ? 'text-red-600 bg-red-100'
      : 'text-gray-600 bg-gray-100'

  return (
    <div className="flex justify-between items-center p-4 rounded-xl hover:bg-white transition shadow-sm border">
      <div className="flex items-start gap-4">
        <Image
          src={`/images/${data.avatar || 'doctor4.jpg'}`}
          alt={data.name}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-gray-800">{data.name}</h4>
          <p className="text-sm text-gray-500">{data.gender}, {data.age} yrs</p>
         <p className="text-sm text-gray-500">
  {new Date(data.dateTime).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}{' '}
  at{' '}
  {new Date(data.dateTime).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })}
</p>

         {data.doctor ? (
  <p className="text-sm text-gray-400 mt-1">
    <span className="font-medium">Doctor:</span> Dr. {data.doctor.name} ({data.doctor.department})
  </p>
) : (
  <p className="text-sm text-gray-400 mt-1 text-red-400">
    <span className="font-medium">Doctor:</span> Not assigned
  </p>
)}

        </div>
      </div>

      {showActions ? (
        <div className="flex gap-3 items-center">
          <button
            className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200"
            title="Decline"
            onClick={() => handleUpdate('Declined')}
          >
            <FaTimes />
          </button>

          <button
            className="bg-violet-100 text-violet-600 p-2 rounded-full hover:bg-violet-200"
            title="Confirm"
            onClick={() => handleUpdate('Confirmed')}
          >
            <FaCheck />
          </button>
        </div>
      ) : (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>
          {status}
        </span>
      )}
    </div>
  )
}
