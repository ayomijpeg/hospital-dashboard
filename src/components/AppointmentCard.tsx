// src/components/AppointmentCard.tsx
import Image from 'next/image'
import { Appointment } from '@/types/appointment'
import { FaTimes, FaCheck } from 'react-icons/fa'

type Props = {
  data: Appointment
  showActions?: boolean
}

export default function AppointmentCard({ data, showActions = false }: Props) {
  const statusColor =
    data.status === 'Confirmed'
      ? 'text-blue-600 bg-blue-100'
      : data.status === 'Declined'
      ? 'text-red-600 bg-red-100'
      : 'text-gray-600 bg-gray-100'

  return (
    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-white transition shadow-sm">
      <div className="flex gap-3 items-center">
        <Image
          src={data.avatar}
          alt={data.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <h4 className="font-medium text-gray-800">{data.name}</h4>
          <p className="text-sm text-gray-500">
            {data.gender}, {data.age} • {data.date} {data.time}
          </p>
        </div>
      </div>

      {showActions ? (
        <div className="flex gap-3">
         <button
  className="bg-red-100 text-red-600 p-1 rounded-full"
  aria-label="Decline Appointment"
  title="Decline"
>
  <FaTimes />
</button>

<button
  className="bg-violet-100 text-violet-600 p-1 rounded-full"
  aria-label="Confirm Appointment"
  title="Confirm"
>
  <FaCheck />
</button>
        
        </div>
      ) : (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>
          {data.status}
        </span>
      )}
    </div>
  )
}

