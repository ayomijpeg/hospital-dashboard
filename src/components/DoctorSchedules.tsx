'use client';
import { doctorSchedules } from '@/data/doctorSchedules';
import { FaUserMd, FaClock } from 'react-icons/fa';
import Calendar from 'react-calendar';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function DoctorSchedules() {
  const [date, setDate] = useState<Value>(new Date());

  const selectedDateStr =
    date instanceof Date ? date.toISOString().split('T')[0] : undefined;

  const filteredSchedules = doctorSchedules.filter(
    (doc) => doc.date === selectedDateStr
  );

  return (
    <div className="grid md:grid-cols-3 gap-6 bg-white rounded-xl p-6 shadow-md">
      {/* Calendar Section */}
      <div className="md:col-span-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Date</h3>

        <div className="bg-gray-50 p-3 rounded-lg border text-gray-600 border-gray-200 shadow-sm">
          <Calendar
            onChange={setDate}
            value={date}
            className="REACT-CALENDAR rounded-md"
            tileClassName="text-sm"
          />
        </div>

        <p className="text-sm mt-3 text-gray-700 font-medium">
          Selected: {date instanceof Date ? date.toDateString() : 'None'}
        </p>
      </div>

      {/* Schedule Section */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          Doctor Schedules for {date instanceof Date ? date.toDateString() : '...'}
        </h2>

        {filteredSchedules.length === 0 ? (
          <p className="text-gray-600 text-sm italic">No schedules for this day.</p>
        ) : (
          <ul className="space-y-4">
            {filteredSchedules.map((doc) => (
              <li
                key={doc.id}
                className="bg-white hover:bg-gray-50 transition rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FaUserMd className="text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{doc.doctor}</p>
                      <p className="text-xs text-gray-500">{doc.department}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      doc.status === 'Confirmed'
                        ? 'bg-green-100 text-green-800'
                        : doc.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <FaClock />
                    <span>{doc.shift}</span>
                  </div>
                  <span>{doc.time}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
