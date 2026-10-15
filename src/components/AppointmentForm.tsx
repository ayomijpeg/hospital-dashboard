"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CalendarPlus, User, ChevronDown, ChevronUp } from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  department: string;
  status: string;
}

type Props = {
  onAppointmentCreated?: () => void;
};

export default function AppointmentForm({ onAppointmentCreated }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [patient, setPatient] = useState("");
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("");
  const [date, setDate] = useState("");
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        if (!response.ok) throw new Error("Failed to fetch doctors");
        const data = (await response.json()) as Doctor[];
        setAvailableDoctors(data);
        if (data.length > 0 && doctorId === null) {
          setDoctorId(data[0].id);
        }
      } catch (error) {
        console.error("Doctor fetch error:", error);
      }
    };

    fetchDoctors();
  }, [doctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patient.trim() || !age || !date || !doctorId) {
      toast.error("Please fill in all required appointment fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/doctors/appointments", {
        name: patient.trim(),
        gender,
        age: parseInt(age, 10),
        dateTime: date,
        doctorId,
      });

      setPatient("");
      setGender("Male");
      setAge("");
      setDate("");

      toast.success("Appointment booked successfully!");
      setIsOpen(false);
      router.refresh();
      onAppointmentCreated?.();
    } catch (error) {
      toast.error("Failed to book appointment. Please try again.");
      console.error("Appointment booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
      {/* Header / Toggle Button */}
      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <CalendarPlus className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900">Book Patient Appointment</h2>
            <p className="text-xs text-slate-500">Schedule clinical visits and assign attending physicians</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 rounded-lg transition"
        >
          <span>{isOpen ? "Close Booking Form" : "+ Schedule Appointment"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Patient Name */}
            <div>
              <label htmlFor="patient" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Patient Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  id="patient"
                  type="text"
                  required
                  value={patient}
                  onChange={(e) => setPatient(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  placeholder="e.g. Johnathan Smith"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Patient Age <span className="text-rose-500">*</span>
              </label>
              <input
                id="age"
                type="number"
                min="1"
                max="125"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                placeholder="e.g. 35"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label htmlFor="datetime" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Date & Time <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="datetime"
                  type="datetime-local"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Doctor Assignment */}
          <div>
            <label htmlFor="doctor" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Attending Clinician / Specialist <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="doctor"
                required
                value={doctorId ?? ""}
                onChange={(e) => setDoctorId(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
              >
                {availableDoctors.length === 0 ? (
                  <option disabled value="">No physicians registered in system</option>
                ) : (
                  availableDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      Dr. {doc.name} — {doc.department} ({doc.status || "Available"})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? "Scheduling..." : "Confirm Appointment"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
