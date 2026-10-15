"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import AppointmentForm from "@/components/AppointmentForm";
import AppointmentCard from "@/components/AppointmentCard";
import ConsultationModal from "@/components/ConsultationModal";
import { Appointment } from "@/types/appointment";
import { toast } from "react-hot-toast";
import { Search, CalendarCheck, Clock, CheckCircle2, Stethoscope } from "lucide-react";

export default function AppointmentsPage() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Confirmed" | "Completed">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [consultingAppointment, setConsultingAppointment] = useState<Appointment | null>(null);

  const userRole = (session?.user?.role || "PATIENT").toUpperCase();
  const isClinician = userRole === "DOCTOR" || userRole === "ADMIN";

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
      toast.error("Could not load latest appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle Confirm/Decline
  const handleUpdateStatus = async (id: string | number, status: "Confirmed" | "Declined") => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Update failed");

      setAppointments((prev) =>
        prev.map((appt) => (String(appt.id) === String(id) ? { ...appt, status } : appt))
      );

      toast.success(`Appointment marked as ${status}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update appointment");
    }
  };

  const handleConsultationCompleted = (appointmentId: string | number) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        String(appt.id) === String(appointmentId) ? { ...appt, status: "Completed" } : appt
      )
    );
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesTab =
        activeTab === "All"
          ? true
          : activeTab === "Pending"
          ? apt.status === "Pending"
          : activeTab === "Confirmed"
          ? apt.status === "Confirmed" || apt.status === "In-Consultation"
          : apt.status === "Completed";

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        apt.name.toLowerCase().includes(query) ||
        (apt.doctor?.name && apt.doctor.name.toLowerCase().includes(query)) ||
        (apt.doctor?.department && apt.doctor.department.toLowerCase().includes(query));

      return matchesTab && matchesSearch;
    });
  }, [appointments, activeTab, searchQuery]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: appointments.length,
      pending: appointments.filter((a) => a.status === "Pending").length,
      confirmed: appointments.filter((a) => a.status === "Confirmed" || a.status === "In-Consultation").length,
      completed: appointments.filter((a) => a.status === "Completed").length,
    };
  }, [appointments]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading Clinical Encounters...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isClinician ? "Appointments & Encounters" : "My Medical Appointments"}
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              {isClinician ? "EHR Clinical Hub" : "Patient Portal"}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {isClinician
              ? "Review incoming schedules, confirm consultations, and conduct electronic medical record documentation."
              : "Review your scheduled consultations, attending physician details, and appointment status."}
          </p>
        </div>
      </div>

      {/* Booking Form Accordion */}
      <AppointmentForm onAppointmentCreated={fetchAppointments} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Unified Clinical Segmented Filter Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 flex-wrap gap-1">
          <button
            onClick={() => setActiveTab("All")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-2 ${
              activeTab === "All"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <span>All Encounters</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                activeTab === "All" ? "bg-teal-50 text-teal-700" : "bg-slate-200 text-slate-600"
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("Pending")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-2 ${
              activeTab === "Pending"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Triage</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                activeTab === "Pending" ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"
              }`}
            >
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("Confirmed")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-2 ${
              activeTab === "Confirmed"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>Confirmed / Ready</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                activeTab === "Confirmed" ? "bg-teal-100 text-teal-800" : "bg-slate-200 text-slate-600"
              }`}
            >
              {counts.confirmed}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("Completed")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-2 ${
              activeTab === "Completed"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Completed & Billed</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                activeTab === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
              }`}
            >
              {counts.completed}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, physician, MRN..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Appointment Grid */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-3" />
            <p className="text-xs font-medium">Loading clinical encounters...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
            <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No appointments found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No appointment records match "${searchQuery}". Try clearing search.`
                : `There are currently no ${activeTab === "All" ? "" : activeTab.toLowerCase()} appointments scheduled.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAppointments.map((apt: Appointment) => (
              <AppointmentCard
                key={apt.id}
                data={apt}
                showActions={isClinician && apt.status === "Pending"}
                onUpdateStatus={isClinician ? handleUpdateStatus : undefined}
                onStartConsultation={isClinician ? (selected) => setConsultingAppointment(selected) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* EHR Consultation Modal */}
      {consultingAppointment && (
        <ConsultationModal
          appointment={consultingAppointment}
          onClose={() => setConsultingAppointment(null)}
          onConsultationCompleted={handleConsultationCompleted}
        />
      )}
    </div>
  );
}
