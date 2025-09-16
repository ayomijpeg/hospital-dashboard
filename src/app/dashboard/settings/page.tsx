"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AppointmentCard from "@/components/AppointmentCard";
import { Appointment } from "@/types/appointment";
import { doctorReviews } from "@/data/doctor"; // Assuming you have a mock data file
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/doctors/appointments", {
        cache: "no-store",
      });
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

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

      // Update the local appointment list
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
      );

      toast.success(`Appointment ${status.toLowerCase()}`);
    } catch (error1) {
      console.log(error1);
      toast.error("Failed to update appointment");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* 👤 Doctor Profile */}
      <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-6 border border-teal-100">
        <Image
          src={session?.user?.avatar || "/images/doctor3.jpg"}
          alt="Doctor Profile"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover border-2 border-teal-600"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {session?.user?.name}
          </h2>
          <p className="text-teal-600 font-medium">
            {session?.user?.department}
          </p>
          <p className="text-gray-600">{session?.user?.email}</p>
        </div>
      </div>

      {/* 🗓 Appointments */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Your Appointments
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-sm text-gray-500">No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt: Appointment) => (
              <AppointmentCard
                key={apt.id}
                data={apt}
                showActions={apt.status === "Pending"}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>
      {/* Patient Reviews */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Patient Reviews
        </h3>
        <div className="space-y-4">
          {doctorReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-600"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-gray-800">
                  {review.patientName}
                </p>
                <span className="text-sm text-gray-400">{review.date}</span>
              </div>
              <p className="text-yellow-500 mb-1">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </p>
              <p className="text-gray-700">{review.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
