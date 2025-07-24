"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Doctor {
  id: number;
  name: string;
  department: string;
  status: string;
}
type Props = {
  onAppointmentCreated?: () => void; // optional callback
}
export default function AppointmentForm({ onAppointmentCreated }: Props)  {
  const [patient, setPatient] = useState("");
  const [gender, setGender] = useState("");
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
      console.log("Raw doctor API response:", data);
      const availableOnly = data.filter((doc) => doc.status === "Available");
      setAvailableDoctors(availableOnly);
    } catch (error) {
      toast.error("Failed to load doctors");
      console.error("Doctor fetch error:", error);
    }
  };

  fetchDoctors();
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!patient || !gender || !age || !date || !doctorId) {
      toast.error("All fields are required");
        setLoading(false);
      return;
    }

    try {
     await axios.post("/api/doctors/appointments", {
  name: patient,
  gender,
  age: parseInt(age),
  dateTime: date,
  doctorId,
});

       setPatient("");
  setGender("");
  setAge("");
  setDate("");
  setDoctorId(null);


      toast.success("Appointment created");
      router.refresh();
      onAppointmentCreated?.();
    } catch (error) {
      toast.error("Failed to create appointment");
      console.error("Appointment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 space-y-4 p-4 rounded-lg shadow">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-teal-700 mb-4 text-center">
          Create Appointment
        </h2>

        <div className="space-y-4">
          {/* Patient Name */}
          <div>
            <label htmlFor="patient" className="block text-sm font-medium text-gray-800">
              Patient Name <span className="text-red-500">*</span>
            </label>
            <input
              id="patient"
              type="text"
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-600 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-800">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-600 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="Male">👨 Male</option>
              <option value="Female">👩 Female</option>
              <option value="Other">⚧ Other</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-800">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg   text-gray-600 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="e.g. 30"
              min="0"
            />
          </div>

          {/* Date & Time */}
          <div>
            <label htmlFor="datetime" className="block text-sm font-medium text-gray-800">
              Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              id="datetime"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Doctor Select */}
          <div>
            <label htmlFor="doctor" className="block text-sm font-medium text-gray-800">
              Assign Doctor <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative">
              <select
                id="doctor"
                value={doctorId ?? ""}
                onChange={(e) => setDoctorId(Number(e.target.value))}
                className="appearance-none w-full border border-gray-300 px-4 py-2 pr-10 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-gray-700 bg-white shadow-sm transition"
              >
                <option value="" disabled className="text-gray-400">
                  👨‍⚕️ Select available doctor
                </option>
               {availableDoctors.length === 0 ? (
  <option disabled>No available doctors</option>
) : (
  availableDoctors.map((doc) => (
    <option key={doc.id} value={doc.id}>
      🩺 {doc.name} — {doc.department}
    </option>
  ))
)}

              </select>

              {/* Custom arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700
              transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.243A8.003 8.003 0 0112 20v-4a4.002 4.002 0 00-3.07-3.857l-1.07 4.1zM20 12a8.003 8.003 0 01-2.93 6.243l1.07 4.1A12.001 12.001 0 0024 12h-4z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Appointment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
