"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";

export default function CreateBillPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get("appointmentId");

  const [services, setServices] = useState("");
  const [amount, setAmount] = useState("");
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) return;

      try {
        const res = await fetch(`/api/appointments/${appointmentId}`);
        if (!res.ok) throw new Error("Appointment not found");

        const data = await res.json();
        setPatientName(data.patient?.name || data.name || "");
        setDoctorName(data.doctor?.name || "");
      } catch (err) {
        setError("Failed to load appointment info.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          services,
          amount: parseFloat(amount),
        }),
      });

      if (!res.ok) throw new Error("Failed to create bill");

      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/billing");
      }, 2000);
    } catch (err) {
      console.log(err);
      setError("Failed to create bill. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10 relative">
      {success && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <div className="bg-green-50 text-green-800 p-4 rounded-lg shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Bill created successfully! Redirecting...</span>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Bill</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="patient"
              className="block text-sm font-medium text-gray-700"
            >
              Patient
            </label>
            <input
              id="patient"
              value={patientName}
              disabled
              className="w-full border px-3 py-2 rounded-lg mt-1 bg-gray-100 text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="doctor"
              className="block text-sm font-medium text-gray-700"
            >
              Doctor
            </label>
            <input
              id="doctor"
              value={doctorName}
              disabled
              className="w-full border px-3 py-2 rounded-lg mt-1 bg-gray-100 text-gray-700"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="services"
            className="block text-sm font-medium text-gray-700"
          >
            Services
          </label>
          <textarea
            id="services"
            value={services}
            onChange={(e) => setServices(e.target.value)}
            placeholder="Describe the services provided "
            className="w-full border px-3 py-2 rounded-lg mt-1 text-gray-700"
            required
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount (₦)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 5000 "
            className="w-full border px-3 py-2 rounded-lg mt-1 text-gray-600"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                Creating...
              </>
            ) : (
              "Create Bill"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
