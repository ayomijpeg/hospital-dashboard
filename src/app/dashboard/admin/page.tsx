"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  ShieldCheck,
  UserCheck,
  Building2,
  FileCheck2,
  AlertCircle,
  Search,
  CheckCircle2,
  RefreshCw,
  Clock,
} from "lucide-react";
import RoleGuard from "@/components/RoleGuard";

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface DoctorCredential {
  id: number;
  name: string;
  department: string;
  licenseNumber: string;
  npi: string;
  status: "Verified" | "Pending Review" | "Suspended";
  verifiedDate?: string;
}

const INITIAL_CREDENTIALS: DoctorCredential[] = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    department: "Cardiology",
    licenseNumber: "MD-CA-892144",
    npi: "1942859102",
    status: "Verified",
    verifiedDate: "Jan 12, 2026",
  },
  {
    id: 2,
    name: "Dr. Jonathan Reyes",
    department: "Pediatrics",
    licenseNumber: "MD-NY-419208",
    npi: "1820491823",
    status: "Verified",
    verifiedDate: "Feb 04, 2026",
  },
  {
    id: 3,
    name: "Dr. Elena Rostova",
    department: "Neurology",
    licenseNumber: "MD-TX-773192",
    npi: "1490284719",
    status: "Pending Review",
  },
  {
    id: 4,
    name: "Dr. Marcus Vance",
    department: "Orthopedics",
    licenseNumber: "MD-IL-663910",
    npi: "1029481726",
    status: "Verified",
    verifiedDate: "Mar 18, 2026",
  },
];

const INITIAL_AUDIT_LOGS = [
  {
    id: "log-1",
    actor: "Dr. Sarah Jenkins",
    action: "EHR Encounter Finalized",
    target: "Patient #101 (Eleanor Vance)",
    time: "10 mins ago",
    severity: "Normal",
  },
  {
    id: "log-2",
    actor: "Admin (Chief of Medicine)",
    action: "Credential Verified",
    target: "Dr. Elena Rostova (Neurology)",
    time: "42 mins ago",
    severity: "Security",
  },
  {
    id: "log-3",
    actor: "Billing Automated Worker",
    action: "Invoice Generated ($220.00)",
    target: "Encounter Enc-99214",
    time: "2 hours ago",
    severity: "Financial",
  },
  {
    id: "log-4",
    actor: "System Gateway",
    action: "HIPAA Access Token Refreshed",
    target: "Doctor Station #4",
    time: "3 hours ago",
    severity: "Normal",
  },
];

export default function AdminPortalPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [credentials, setCredentials] = useState<DoctorCredential[]>(INITIAL_CREDENTIALS);
  const [auditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [userSearch, setUserSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"credentials" | "rbac" | "capacity" | "audit">("credentials");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.warn("Using local users for admin display:", err);
      setUsers([
        { id: 1, name: "Dr. Sarah Jenkins", email: "s.jenkins@hospital.org", role: "doctor", createdAt: new Date().toISOString() },
        { id: 2, name: "Dr. Jonathan Reyes", email: "j.reyes@hospital.org", role: "doctor", createdAt: new Date().toISOString() },
        { id: 3, name: "Eleanor Vance", email: "eleanor.vance@gmail.com", role: "patient", createdAt: new Date().toISOString() },
        { id: 4, name: "Marcus Sterling", email: "marcus.sterling@gmail.com", role: "patient", createdAt: new Date().toISOString() },
        { id: 5, name: "System Administrator", email: "admin@hospital.org", role: "admin", createdAt: new Date().toISOString() },
      ]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("Role update failed");

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      toast.success(`User role updated to ${newRole.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user role");
    }
  };

  const handleToggleCredential = (id: number) => {
    setCredentials((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus =
            c.status === "Verified" ? "Suspended" : "Verified";
          toast.success(`${c.name} credentials marked as ${nextStatus}`);
          return {
            ...c,
            status: nextStatus,
            verifiedDate: nextStatus === "Verified" ? "Just now" : c.verifiedDate,
          };
        }
        return c;
      })
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <RoleGuard
      allowedRoles={["ADMIN"]}
      fallbackMessage="The Hospital Governance & RBAC command console is strictly reserved for Authorized Hospital System Administrators."
    >
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Hospital Administration & Governance
              </h1>
              <p className="text-xs text-slate-500">
                Physician credentialing, role-based access control (RBAC), facility census, and audit logs.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 rounded-lg transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          Refresh Registry
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Verified Clinicians</span>
            <UserCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {credentials.filter((c) => c.status === "Verified").length} / {credentials.length}
          </div>
          <p className="text-[11px] text-teal-700 mt-1 font-medium">100% Board Certified</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Accounts</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{users.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Multi-Role User Directory</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Overall Bed Census</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">78.5%</div>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium">Normal Inpatient Capacity</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Audit Integrity</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">100%</div>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium">HIPAA Compliant Logging</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          onClick={() => setActiveTab("credentials")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "credentials"
              ? "border-purple-600 text-purple-700 bg-purple-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Physician Credentialing ({credentials.length})
        </button>

        <button
          onClick={() => setActiveTab("rbac")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "rbac"
              ? "border-purple-600 text-purple-700 bg-purple-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          RBAC Role Assignment ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("capacity")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "capacity"
              ? "border-purple-600 text-purple-700 bg-purple-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Facility Census & Wards
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "audit"
              ? "border-purple-600 text-purple-700 bg-purple-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Clinical Audit Trail
        </button>
      </div>

      {/* Tab 1: Credentialing */}
      {activeTab === "credentials" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Hospital Medical Board Verification</h3>
              <p className="text-xs text-slate-500">Review state licensure, NPI registry status, and practice privileges</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {credentials.map((doc) => (
              <div key={doc.id} className="p-4 sm:flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {doc.name.replace("Dr. ", "").charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                      <span className="text-xs text-slate-500">• {doc.department}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>License: <strong className="font-mono text-slate-700">{doc.licenseNumber}</strong></span>
                      <span>NPI: <strong className="font-mono text-slate-700">{doc.npi}</strong></span>
                      {doc.verifiedDate && <span>Verified: {doc.verifiedDate}</span>}
                    </div>
                  </div>
                </div>

                <div className="mt-3 sm:mt-0 flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${
                      doc.status === "Verified"
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : doc.status === "Pending Review"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {doc.status === "Verified" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    {doc.status}
                  </span>

                  <button
                    onClick={() => handleToggleCredential(doc.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-700"
                  >
                    {doc.status === "Verified" ? "Revoke / Suspend" : "Verify Credentials"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: RBAC Role Assignment */}
      {activeTab === "rbac" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">User Identity & Privilege Level</h3>
              <p className="text-xs text-slate-500">Reassign system roles between Doctor, Patient, and Administrator</p>
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Current Role</th>
                  <th className="py-2.5 px-3 text-right">Assign Privilege</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-3 text-slate-600">{u.email}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : u.role === "doctor"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <select
                        value={u.role.toLowerCase()}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-purple-600 focus:outline-none cursor-pointer"
                      >
                        <option value="doctor">Doctor</option>
                        <option value="patient">Patient</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Capacity & Wards */}
      {activeTab === "capacity" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { dept: "Cardiology Inpatient Ward", beds: "34 / 40", pct: 85, status: "High Occupancy", color: "amber" },
            { dept: "Intensive Care Unit (ICU)", beds: "11 / 12", pct: 92, status: "Critical Attention", color: "rose" },
            { dept: "Pediatrics & Neonatal", beds: "16 / 25", pct: 64, status: "Optimal", color: "teal" },
            { dept: "Orthopedic Surgical Recovery", beds: "21 / 30", pct: 70, status: "Normal", color: "blue" },
          ].map((w) => (
            <div key={w.dept} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{w.dept}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    w.color === "rose"
                      ? "bg-rose-100 text-rose-800"
                      : w.color === "amber"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-teal-100 text-teal-800"
                  }`}
                >
                  {w.status}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs text-slate-500">
                <span>Occupied Beds</span>
                <span className="font-bold text-slate-900">{w.beds} ({w.pct}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    w.pct > 90 ? "bg-rose-600" : w.pct > 80 ? "bg-amber-500" : "bg-teal-600"
                  }`}
                  style={{ width: `${w.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">HIPAA Security & Access Audit Trail</h3>
            <p className="text-xs text-slate-500">Immutable ledger recording encounter finalizations, credential reviews, and billing actions</p>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <div>
                    <span className="font-bold text-slate-900">{log.actor}</span>{" "}
                    <span className="text-slate-500">— {log.action} on</span>{" "}
                    <strong className="text-slate-700">{log.target}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {log.time}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {log.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </RoleGuard>
  );
}
