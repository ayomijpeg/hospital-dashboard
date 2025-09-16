"use client";

import { useEffect, useState } from "react";
import AppointmentForm from "@/components/AppointmentForm";
import AppointmentCard from "@/components/AppointmentCard";
import { Appointment } from "@/types/appointment";
import { toast } from "react-hot-toast";
import BillingPromptModal from "@/components/BillModal";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBillingPrompt, setShowBillingPrompt] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`/api/doctors/appointments`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Handle Confirm/Decline
  const handleUpdateStatus = async (
    id: number,
    status: "Confirmed" | "Declined"
  ) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Update failed");

      // Update the state optimistically
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
      );

      toast.success(`Appointment ${status.toLowerCase()}`);
      if (status === "Confirmed") {
        setShowBillingPrompt(true);
        setSelectedAppointmentId(id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update appointment");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        All Appointments
      </h1>

      <AppointmentForm onAppointmentCreated={fetchAppointments} />

      <h2 className="text-2xl font-bold text-gray-600 mb-4">
        Manage Your patient appointments.
      </h2>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
            <span className="sr-only">Loading...</span>
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-sm text-gray-500">No appointments found.</p>
        ) : (
          appointments.map((apt: Appointment) => (
            <AppointmentCard
              key={apt.id}
              data={apt}
              showActions={apt.status === "Pending"}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        )}
      </div>
      {showBillingPrompt && selectedAppointmentId && (
        <BillingPromptModal
          appointmentId={selectedAppointmentId}
          onClose={() => {
            setShowBillingPrompt(false);
            setSelectedAppointmentId(null);
          }}
        />
      )}
    </div>
  );
}
