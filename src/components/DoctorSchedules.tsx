'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import { Stethoscope, Clock, CalendarDays, CheckCircle2 } from 'lucide-react';
import { doctorSchedules } from '@/data/doctorSchedules';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function DoctorSchedules() {
  const [date, setDate] = useState<Value>(new Date());

  const selectedDateStr =
    date instanceof Date ? date.toISOString().split('T')[0] : undefined;

  const exactMatches = doctorSchedules.filter(
    (doc) => doc.date === selectedDateStr
  );

  const displayedSchedules = exactMatches.length > 0 ? exactMatches : doctorSchedules;

  return (
    <div className="grid lg:grid-cols-3 gap-6 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      {/* Calendar Section */}
      <div className="lg:col-span-1">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Select Roster Date
          </h3>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs">
          <Calendar
            onChange={setDate}
            value={date}
            className="w-full border-0 bg-transparent text-slate-800 text-sm font-sans"
          />
        </div>

        <p className="text-xs mt-3 text-slate-500 font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-600 inline-block" />
          Selected: {date instanceof Date ? date.toDateString() : 'Today'}
        </p>
      </div>

      {/* Schedule List Section */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Shift Roster for {date instanceof Date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {exactMatches.length > 0
                ? `${exactMatches.length} physician(s) scheduled for this day`
                : 'No specific shifts for this day — viewing upcoming hospital duty roster'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {displayedSchedules.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-50/70 hover:bg-slate-50 transition p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Dr. {doc.doctor}
                  </h4>
                  <span className="text-xs font-medium text-teal-700">
                    {doc.department}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{doc.shift || 'General Shift'}</span>
                  <span className="text-slate-400">({doc.time})</span>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    doc.status === 'Confirmed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
