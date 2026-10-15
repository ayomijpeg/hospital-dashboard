"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  Users,
  UserPlus,
  Receipt,
  Clock,
  ArrowRight,
  Stethoscope,
  X,
  FileText,
  ShieldCheck,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Navigation" | "Clinical Action" | "Record";
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const STATIC_COMMANDS: CommandItem[] = [
  {
    id: "nav-admin",
    title: "Hospital Governance & Administration",
    subtitle: "Credentialing, staff verifications, RBAC permissions, and audit logs",
    category: "Navigation",
    icon: ShieldCheck,
    href: "/dashboard/admin",
  },
  {
    id: "nav-appt",
    title: "All Appointments & Encounters",
    subtitle: "Manage patient queues, confirm consultations, and launch EHR",
    category: "Navigation",
    icon: Calendar,
    href: "/dashboard/appointments",
  },
  {
    id: "nav-patients",
    title: "Patient Master Directory",
    subtitle: "View clinical profiles, medical conditions, and demographics",
    category: "Navigation",
    icon: Users,
    href: "/dashboard/patients",
  },
  {
    id: "nav-billing",
    title: "Hospital Billing & Invoices",
    subtitle: "Track receivables, mark paid encounters, and view statements",
    category: "Navigation",
    icon: Receipt,
    href: "/dashboard/billing",
  },
  {
    id: "nav-doctors",
    title: "Specialist & Physician Directory",
    subtitle: "Browse attending doctors, departments, and on-duty status",
    category: "Navigation",
    icon: Stethoscope,
    href: "/dashboard/doctors",
  },
  {
    id: "nav-schedules",
    title: "Roster & Shift Schedules",
    subtitle: "Doctor shift schedules, clinic hours, and department coverage",
    category: "Navigation",
    icon: Clock,
    href: "/dashboard/Schedules",
  },
  {
    id: "act-create-bill",
    title: "Generate New Patient Bill",
    subtitle: "Create invoice for diagnostic tests, consultation, or pharmacy",
    category: "Clinical Action",
    icon: Receipt,
    href: "/dashboard/billing/create",
  },
  {
    id: "act-register-patient",
    title: "Register New Inpatient / Outpatient",
    subtitle: "Onboard patient to hospital database with age & medical condition",
    category: "Clinical Action",
    icon: UserPlus,
    href: "/dashboard/patients",
  },
  {
    id: "act-blog",
    title: "Hospital Health Bulletins & Articles",
    subtitle: "View medical publications and clinical announcements",
    category: "Navigation",
    icon: FileText,
    href: "/dashboard/blog",
  },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keydown listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredCommands = React.useMemo(() => {
    if (!query.trim()) return STATIC_COMMANDS;
    const q = query.toLowerCase();
    return STATIC_COMMANDS.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(q) ||
        cmd.subtitle.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q)
    );
  }, [query]);

  // Handle arrow keys and Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    }
  };

  const executeCommand = (cmd: CommandItem) => {
    onClose();
    router.push(cmd.href);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-white">
          <Search className="w-5 h-5 text-teal-600 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, destination, or clinical action..."
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 p-1 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredCommands.length === 0 ? (
            <div className="py-10 text-center text-slate-500">
              <p className="text-xs font-semibold">No matching command or destination found</p>
              <p className="text-[11px] text-slate-400 mt-1">Try &quot;appointments&quot;, &quot;patients&quot;, or &quot;billing&quot;</p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                    isSelected
                      ? "bg-teal-50/80 text-teal-900 border border-teal-200"
                      : "hover:bg-slate-50 text-slate-700 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {cmd.title}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            cmd.category === "Clinical Action"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {cmd.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition ${
                      isSelected
                        ? "text-teal-600 translate-x-1"
                        : "text-slate-300"
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Helper */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px] text-slate-600 shadow-2xs">
                ↑
              </kbd>{" "}
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px] text-slate-600 shadow-2xs">
                ↓
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px] text-slate-600 shadow-2xs">
                ↵
              </kbd>{" "}
              Select
            </span>
          </div>
          <span className="text-slate-400">Doct. Enterprise Healthcare</span>
        </div>
      </div>
    </div>
  );
}
