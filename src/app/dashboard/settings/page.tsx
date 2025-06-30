'use client'

import { doctorProfile, doctorReviews } from '@/data/doctor'
import Image from 'next/image'

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Doctor Profile Card */}
      <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-6">
        <Image
          src="/images/doctor3.jpg"
          alt="Doctor Profile"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover border-2 border-teal-600"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">{doctorProfile.name}</h2>
          {/* <p className="text-teal-700 font-medium">{doctorProfile.title}</p> */}
          <p className="text-gray-600">{doctorProfile.specialty}</p>
          <p className="text-gray-600">{doctorProfile.email}</p>
        </div>
      </div>

      {/* Patient Reviews */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Patient Reviews</h3>
        <div className="space-y-4">
          {doctorReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-600"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-gray-800">{review.patientName}</p>
                <span className="text-sm text-gray-400">{review.date}</span>
              </div>
              <p className="text-yellow-500 mb-1">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </p>
              <p className="text-gray-700">{review.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
