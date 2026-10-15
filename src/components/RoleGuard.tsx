"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallbackMessage?: string;
}

export default function RoleGuard({
  allowedRoles,
  children,
  fallbackMessage = "You do not have the required clinical or administrative clearance to access this department.",
}: RoleGuardProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Verifying Security Clearance...
        </p>
      </div>
    );
  }

  const userRole = (session?.user?.role || "PATIENT").toUpperCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

  const hasAccess = normalizedAllowed.includes(userRole);

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm font-sans text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            <Lock className="w-3.5 h-3.5" />
            Restricted Clinical Clearance
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Access Boundary Enforced
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {fallbackMessage}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 max-w-md mx-auto space-y-1.5 text-left">
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700">Authenticated Account:</span>
            <span className="font-mono text-slate-900">{session?.user?.email || "Unknown"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700">Assigned Privilege Tier:</span>
            <span className="font-bold text-teal-700 uppercase">{userRole}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700">Required Clearances:</span>
            <span className="font-mono text-slate-900">{normalizedAllowed.join(" | ")}</span>
          </div>
        </div>

        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Authorized Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
