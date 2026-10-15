"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  CalendarPlus,
  CalendarCheck,
  CreditCard,
  HeartPulse,
  Pill,
  CheckCircle2,
} from "lucide-react";
import { Appointment } from "@/types/appointment";

interface PatientPortalViewProps {
  userName: string;
  userEmail?: string;
}

interface Doctor {
  id: number;
  name: string;
  department: string;
  avatar?: string | null;
  status: string;
}

export default function PatientPortalView({ userName }: PatientPortalViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Wizard State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDept, setSelectedDept] = useState("Cardiology");
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("10:00 AM");
  const [patientAge, setPatientAge] = useState("32");
  const [patientGender, setPatientGender] = useState("Female");
  const [visitReason, setVisitReason] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const DEPARTMENTS = [
    { name: "Cardiology", desc: "Heart care, ECGs & cardiovascular health", icon: "❤️" },
    { name: "Pediatrics", desc: "Infant, child & adolescent medical care", icon: "🧸" },
    { name: "Neurology", desc: "Brain, spine & central nervous system", icon: "🧠" },
    { name: "Orthopedics", desc: "Bones, joints, sports medicine & spine", icon: "🦴" },
    { name: "General Practice", desc: "Routine wellness exams & acute care", icon: "🩺" },
  ];

  const TIME_SLOTS = [
    "09:00 AM",
    "10:30 AM",
    "11:45 AM",
    "02:00 PM",
    "03:30 PM",
    "04:45 PM",
  ];

  useEffect(() => {
    const loadPortalData = async () => {
      try {
        const [apptRes, docRes] = await Promise.all([
          fetch("/api/doctors/appointments"),
          fetch("/api/doctors"),
        ]);

        if (apptRes.ok) {
          const apptData = await apptRes.json();
          setAppointments(apptData);
        }

        if (docRes.ok) {
          const docData = await docRes.json();
          setDoctors(docData);
          if (docData.length > 0) {
            setSelectedDoctorId(docData[0].id);
          }
        }
      } catch (err) {
        console.error("Portal load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPortalData();
  }, []);

  const filteredDoctors = doctors.filter(
    (d) => !selectedDept || d.department.toLowerCase().includes(selectedDept.toLowerCase())
  );

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedDate) {
      toast.error("Please pick a physician and appointment date");
      return;
    }

    setBookingLoading(true);
    try {
      // Compose full ISO dateTime
      const composedDateTime = new Date(`${selectedDate} ${selectedSlot}`).toISOString();

      const res = await fetch("/api/doctors/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName || "Patient",
          gender: patientGender,
          age: parseInt(patientAge, 10) || 30,
          dateTime: composedDateTime,
          doctorId: selectedDoctorId,
        }),
      });

      if (!res.ok) throw new Error("Failed to book appointment");

      toast.success(
        `Consultation booked successfully with Dr. ${
          doctors.find((d) => d.id === selectedDoctorId)?.name || "Specialist"
        }!`,
        { duration: 5000 }
      );

      setIsBookingOpen(false);
      setStep(1);

      // Refresh list
      const apptRes = await fetch("/api/doctors/appointments");
      if (apptRes.ok) {
        setAppointments(await apptRes.json());
      }
    } catch (err) {
      console.error(err);
      toast.error("Booking submission error. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-3">
            <HeartPulse className="w-3.5 h-3.5" />
            Patient Health Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {userName || "Valued Patient"}
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Manage your clinical consultations, view attending physicians, download electronic billing receipts, and schedule hospital visits with board-certified specialists.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => {
                setStep(1);
                setIsBookingOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <CalendarPlus className="w-4 h-4" />
              Book Specialist Consultation
            </button>

            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition"
            >
              <CreditCard className="w-4 h-4" />
              View Invoices & Billing
            </Link>
          </div>
        </div>
      </div>

      {/* Patient Health Hub Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Upcoming Visits</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {appointments.filter((a) => a.status !== "Declined").length} Consultations
            </div>
            <p className="text-xs text-teal-700 mt-1 font-medium">Scheduled with attending team</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Care Plan</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">E-Prescription Ready</div>
            <p className="text-xs text-blue-700 mt-1 font-medium">Verified by hospital pharmacy</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Health Record (EHR)</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">Up to Date</div>
            <p className="text-xs text-emerald-700 mt-1 font-medium">Immunizations & Labs Verified</p>
          </div>
        </div>
      </div>

      {/* Main Content Split: My Appointments & Hospital Specialists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: My Consultations */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Scheduled Visits & Care Timeline</h2>
              <p className="text-xs text-slate-500">Upcoming specialist consultations and past medical reviews</p>
            </div>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              + New Appointment
            </button>
          </div>

          <div className="p-5">
            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No scheduled appointments</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You do not have any active appointments. Use the booking wizard to schedule a consultation with our hospital physicians.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {appointments.slice(0, 4).map((apt) => (
                  <div key={apt.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 rounded-lg px-2 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-teal-700 font-bold text-sm">
                        {apt.doctor?.name ? apt.doctor.name.charAt(0) : "D"}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Dr. {apt.doctor?.name || "Attending Physician"}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {apt.doctor?.department || "General Medicine"} • {new Date(apt.dateTime || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        apt.status === "Confirmed"
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : apt.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Specialist Directory */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Hospital Specialists</h3>
            <Link href="/dashboard/doctors" className="text-xs text-teal-700 font-semibold hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {doctors.slice(0, 4).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                    {doc.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Dr. {doc.name}</p>
                    <p className="text-[11px] text-slate-500">{doc.department}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedDoctorId(doc.id);
                    setSelectedDept(doc.department);
                    setStep(3);
                    setIsBookingOpen(true);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition"
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Patient Guided Booking Wizard Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
            
            {/* Modal Header with Steps Indicator */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Schedule Medical Consultation</h3>
                <p className="text-xs text-slate-400">Step {step} of 4: {
                  step === 1 ? "Choose Clinical Department" :
                  step === 2 ? "Select Attending Specialist" :
                  step === 3 ? "Pick Date & Time Slot" : "Review & Confirm"
                }</p>
              </div>

              <button
                onClick={() => setIsBookingOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5">
              <div
                className="bg-teal-500 h-1.5 transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            {/* Step Body */}
            <div className="p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Select Specialty Department</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DEPARTMENTS.map((dept) => (
                      <div
                        key={dept.name}
                        onClick={() => setSelectedDept(dept.name)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition ${
                          selectedDept === dept.name
                            ? "border-teal-600 bg-teal-50 text-teal-900 ring-1 ring-teal-600"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                          <span className="text-base">{dept.icon}</span>
                          <span>{dept.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{dept.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition"
                    >
                      Next: Choose Specialist →
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Select Attending Physician</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredDoctors.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">
                        No doctors currently available in {selectedDept}.
                      </p>
                    ) : (
                      filteredDoctors.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoctorId(doc.id)}
                          className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                            selectedDoctorId === doc.id
                              ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                              {doc.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">Dr. {doc.name}</p>
                              <p className="text-[11px] text-slate-500">{doc.department} • On Duty</p>
                            </div>
                          </div>
                          {selectedDoctorId === doc.id && (
                            <CheckCircle2 className="w-5 h-5 text-teal-600" />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!selectedDoctorId}
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition disabled:opacity-50"
                    >
                      Next: Select Time Slot →
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Select Date & Time Slot</h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Appointment Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Available Consultation Slots</label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 text-xs font-semibold rounded-lg border transition ${
                            selectedSlot === slot
                              ? "bg-teal-600 text-white border-teal-600"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      disabled={!selectedDate}
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition disabled:opacity-50"
                    >
                      Next: Review & Confirm →
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Confirm Appointment Details</h4>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Department:</span>
                      <strong className="text-slate-800">{selectedDept}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Attending Clinician:</span>
                      <strong className="text-slate-800">
                        Dr. {doctors.find((d) => d.id === selectedDoctorId)?.name || "Specialist"}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Date & Slot:</span>
                      <strong className="text-slate-800">{selectedDate} at {selectedSlot}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Patient:</span>
                      <strong className="text-slate-800">{userName}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Age</label>
                      <input
                        type="number"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Gender</label>
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Reason for Consultation / Symptoms (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={visitReason}
                      onChange={(e) => setVisitReason(e.target.value)}
                      placeholder="e.g. Follow-up review, routine checkup, persistent chest discomfort..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep(3)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      disabled={bookingLoading}
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition disabled:opacity-50"
                    >
                      {bookingLoading ? "Confirming..." : "Confirm & Book Consultation"}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
