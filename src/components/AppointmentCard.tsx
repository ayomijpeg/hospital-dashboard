// src/components/AppointmentCard.tsx
"use client";

import Image from "next/image";
import { Appointment } from "@/types/appointment";
import { FaTimes, FaCheck } from "react-icons/fa";
import { Stethoscope, CheckCircle2, Calendar, Clock, ShieldCheck } from "lucide-react";
import { useState } from "react";

type Props = {
  data: Appointment;
  showActions?: boolean;
  onUpdateStatus?: (id: string | number, status: "Confirmed" | "Declined") => void;
  onStartConsultation?: (appointment: Appointment) => void;
};

export default function AppointmentCard({
  data,
  showActions = false,
  onUpdateStatus,
  onStartConsultation,
}: Props) {
  const [status, setStatus] = useState(data.status);
  const [imgError, setImgError] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "PT";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleUpdate = (newStatus: "Confirmed" | "Declined") => {
    setStatus(newStatus);
    onUpdateStatus?.(data.id, newStatus);
  };

  const getStatusBadge = () => {
    switch (status) {
      case "Confirmed":
        return "text-teal-700 bg-teal-50 border-teal-200";
      case "In-Consultation":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "Completed":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "Declined":
        return "text-rose-700 bg-rose-50 border-rose-200";
      default:
        return "text-amber-700 bg-amber-50 border-amber-200";
    }
  };

  // Resolve valid date object safely
  const rawDate = data.dateTime || data.date;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const isValidDate = dateObj && !isNaN(dateObj.getTime());

  const formattedDate = isValidDate
    ? dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : data.date || "Date Pending";

  const formattedTime = isValidDate
    ? dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : data.time || "";

  // Normalize avatar image path
  const avatarPath = data.avatar
    ? data.avatar.startsWith("/")
      ? data.avatar
      : data.avatar.startsWith("images/")
      ? `/${data.avatar}`
      : `/images/${data.avatar}`
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs hover:shadow-sm p-4 sm:p-5 flex flex-col justify-between">
      {/* 👤 Header: Patient Profile & Status Badge */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-11 h-11 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shadow-2xs">
            {!imgError && avatarPath ? (
              <Image
                src={avatarPath}
                alt=""
                fill
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="font-bold text-teal-800 text-xs tracking-tight select-none">
                {getInitials(data.name)}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight truncate">
              {data.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
              <span>{data.gender || "Patient"}</span>
              {data.age && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{data.age} yrs</span>
                </>
              )}
              <span className="text-slate-300">•</span>
              <span className="font-mono text-[10px] text-slate-400">ID-{String(data.id).padStart(4, "0")}</span>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <span
          className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-bold border tracking-wide inline-flex items-center gap-1.5 ${getStatusBadge()}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              status === "Confirmed"
                ? "bg-teal-600"
                : status === "In-Consultation"
                ? "bg-blue-600"
                : status === "Completed"
                ? "bg-emerald-600"
                : status === "Declined"
                ? "bg-rose-600"
                : "bg-amber-600"
            }`}
          />
          {status}
        </span>
      </div>

      {/* 📋 Metadata Strip: Date, Time & Attending Staff */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>{formattedDate}</span>
          {formattedTime && (
            <>
              <span className="text-slate-300">•</span>
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{formattedTime}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {data.doctor ? (
            <span className="truncate">
              <span className="font-semibold text-slate-700">Attending:</span> Dr. {data.doctor.name} (
              {data.doctor.department})
            </span>
          ) : (
            <span className="text-amber-700 font-medium">Attending: Triage Pending</span>
          )}
        </div>
      </div>

      {/* ⚡ Clinical Action Footer */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-auto">
        <span className="text-[11px] font-medium text-slate-400 hidden sm:inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          HIPAA Verified Encounter
        </span>

        <div className="flex items-center gap-2 ml-auto">
          {status === "Pending" && showActions && (
            <>
              <button
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-lg transition border border-rose-200 inline-flex items-center gap-1.5 shadow-2xs"
                title="Decline Appointment"
                onClick={() => handleUpdate("Declined")}
              >
                <FaTimes size={10} />
                <span>Decline</span>
              </button>

              <button
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition shadow-xs inline-flex items-center gap-1.5"
                title="Confirm Appointment"
                onClick={() => handleUpdate("Confirmed")}
              >
                <FaCheck size={10} />
                <span>Confirm</span>
              </button>
            </>
          )}

          {(status === "Confirmed" || status === "In-Consultation") && onStartConsultation && (
            <button
              onClick={() => onStartConsultation(data)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition shadow-xs"
            >
              <Stethoscope className="w-3.5 h-3.5 shrink-0" />
              <span>{status === "In-Consultation" ? "Resume Consultation" : "Start Consultation"}</span>
            </button>
          )}

          {status === "Completed" && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Encounter Billed
            </span>
          )}

          {/* When no clinician actions are requested (e.g. view-only on summary) */}
          {!showActions && !onStartConsultation && status !== "Completed" && (
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Encounter Scheduled
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
