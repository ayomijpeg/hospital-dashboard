"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  User,
  Shield,
  HeartPulse,
  CreditCard,
  Lock,
  Building,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  Stethoscope,
  Clock,
  FileCheck,
  AlertCircle,
} from "lucide-react";

interface ProfileState {
  id: number | string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  gender: string;
  age: number;
  department: string;
  condition: string;
  phone: string;
  address: string;
  bloodGroup: string;
  allergies: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  licenseNumber: string;
  npi: string;
  roomNumber: string;
  consultationDuration: number;
  acceptingPatients: boolean;
  createdAt: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [imgError, setImgError] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState<ProfileState>({
    id: 1,
    name: "",
    email: "",
    role: "PATIENT",
    avatar: null,
    gender: "Not Specified",
    age: 30,
    department: "General Medicine",
    condition: "Standard Wellness",
    phone: "",
    address: "",
    bloodGroup: "O+",
    allergies: "None reported",
    emergencyContact: { name: "", phone: "", relation: "" },
    insurance: { provider: "", policyNumber: "", groupNumber: "" },
    licenseNumber: "",
    npi: "",
    roomNumber: "",
    consultationDuration: 30,
    acceptingPatients: true,
    createdAt: new Date().toISOString(),
  });

  // Security / Password State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch current user profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/profile", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile(data.profile);
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const role = (profile.role || (session?.user as any)?.role || "PATIENT").toUpperCase();

  const handleInputChange = (field: string, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: "emergencyContact" | "insurance", field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      toast.success("Profile saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      toast.success("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* 🏥 Top Header Banner */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar with resilient initials fallback */}
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-teal-600/30 bg-teal-50 flex items-center justify-center shrink-0">
              {!imgError && profile.avatar ? (
                <Image
                  src={
                    profile.avatar.startsWith("/")
                      ? profile.avatar
                      : `/images/${profile.avatar}`
                  }
                  alt=""
                  fill
                  className="object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-2xl font-black text-teal-800 select-none">
                  {getInitials(profile.name)}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {profile.name || session?.user?.name || "Medical User"}
                </h1>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    role === "ADMIN"
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : role === "DOCTOR"
                      ? "bg-teal-50 text-teal-800 border border-teal-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {role === "ADMIN"
                    ? "Hospital System Admin"
                    : role === "DOCTOR"
                    ? `Staff Physician • ${profile.department}`
                    : "Registered Patient"}
                </span>
              </div>

              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <span>{profile.email}</span>
                <span>•</span>
                <span className="font-mono text-xs text-slate-600 font-medium">
                  {role === "PATIENT"
                    ? `MRN-PAT-${profile.id.toString().padStart(5, "0")}`
                    : role === "DOCTOR"
                    ? `NPI-${profile.npi || "1948201948"}`
                    : "GOV-ADMIN-TIER1"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Identity
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mt-8 gap-2 overflow-x-auto text-sm font-semibold">
          <button
            onClick={() => setActiveTab("general")}
            className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === "general"
                ? "border-teal-600 text-teal-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <User className="w-4 h-4" />
            {role === "PATIENT"
              ? "Demographics & Contact"
              : role === "DOCTOR"
              ? "Clinician Profile"
              : "Institution Details"}
          </button>

          {role === "PATIENT" && (
            <>
              <button
                onClick={() => setActiveTab("clinical")}
                className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
                  activeTab === "clinical"
                    ? "border-teal-600 text-teal-700 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                Medical & Allergies
              </button>
              <button
                onClick={() => setActiveTab("insurance")}
                className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
                  activeTab === "insurance"
                    ? "border-teal-600 text-teal-700 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Insurance & Coverage
              </button>
            </>
          )}

          {role === "DOCTOR" && (
            <button
              onClick={() => setActiveTab("practice")}
              className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === "practice"
                  ? "border-teal-600 text-teal-700 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              Practice & Schedule
            </button>
          )}

          {role === "ADMIN" && (
            <button
              onClick={() => setActiveTab("system")}
              className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === "system"
                  ? "border-teal-600 text-teal-700 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Building className="w-4 h-4" />
              Hospital Governance
            </button>
          )}

          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === "security"
                ? "border-teal-600 text-teal-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Lock className="w-4 h-4" />
            Security & Password
          </button>
        </div>
      </div>

      {/* 📋 TAB 1: General Profile & Demographics */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              {role === "PATIENT"
                ? "Personal Demographics & Primary Contact"
                : role === "DOCTOR"
                ? "Attending Physician Credentials & Contact"
                : "Hospital Executive Information"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Accurate records ensure reliable medical communication and clinical safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Full Legal Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address (Primary Login)
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Contact Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Residential Address / Clinic Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Street address, City, State, ZIP"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                />
              </div>
            </div>

            {role === "PATIENT" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Age / DOB
                  </label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Biological / Legal Gender
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other / Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </>
            )}

            {role === "DOCTOR" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Clinical Department
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    National Provider Identifier (NPI)
                  </label>
                  <input
                    type="text"
                    value={profile.npi}
                    onChange={(e) => handleInputChange("npi", e.target.value)}
                    placeholder="10-digit NPI number"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    State Medical Board License #
                  </label>
                  <input
                    type="text"
                    value={profile.licenseNumber}
                    onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Assigned Clinic Office / Suite
                  </label>
                  <input
                    type="text"
                    value={profile.roomNumber}
                    onChange={(e) => handleInputChange("roomNumber", e.target.value)}
                    placeholder="e.g. Wing B, Room 304"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                  />
                </div>
              </>
            )}
          </div>

          {/* Emergency Contact for Patients */}
          {role === "PATIENT" && (
            <div className="border-t border-slate-100 pt-6 mt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-teal-600" />
                Emergency Contact (Required for Inpatient / Ambulatory Care)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Primary point of contact in case of urgent medical notifications.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={profile.emergencyContact?.name || ""}
                    onChange={(e) => handleNestedChange("emergencyContact", "name", e.target.value)}
                    placeholder="e.g. Sarah Parker"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={profile.emergencyContact?.relation || ""}
                    onChange={(e) => handleNestedChange("emergencyContact", "relation", e.target.value)}
                    placeholder="e.g. Spouse, Parent, Sibling"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Emergency Phone
                  </label>
                  <input
                    type="text"
                    value={profile.emergencyContact?.phone || ""}
                    onChange={(e) => handleNestedChange("emergencyContact", "phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Demographics"}
            </button>
          </div>
        </form>
      )}

      {/* 🩺 TAB 2: Clinical & Medical Profile (Patients only) */}
      {activeTab === "clinical" && role === "PATIENT" && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Personal Clinical Baseline & Safety
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Vital clinical indicators shared with your attending medical team during triage and consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                ABO Blood Type
              </label>
              <select
                value={profile.bloodGroup}
                onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition bg-white"
              >
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Known Drug Allergies & Contraindications
              </label>
              <input
                type="text"
                value={profile.allergies}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                placeholder="e.g. Penicillin, Sulfa drugs, Latex (or None)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Chronic Health History / Primary Monitoring Concern
              </label>
              <textarea
                rows={3}
                value={profile.condition}
                onChange={(e) => handleInputChange("condition", e.target.value)}
                placeholder="e.g. Hypertension under treatment, mild seasonal asthma, post-operative routine checkups..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Clinical Baseline"}
            </button>
          </div>
        </form>
      )}

      {/* 💳 TAB 3: Health Insurance & Coverage (Patients only) */}
      {activeTab === "insurance" && role === "PATIENT" && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Health Insurance & Policy Coverage
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct billing eligibility allows automated claim adjudication and invoice copay discounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Insurance Provider / Carrier Name
              </label>
              <input
                type="text"
                value={profile.insurance?.provider || ""}
                onChange={(e) => handleNestedChange("insurance", "provider", e.target.value)}
                placeholder="e.g. Blue Cross Blue Shield, Aetna, Cigna, Medicare"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Member / Policy ID #
              </label>
              <input
                type="text"
                value={profile.insurance?.policyNumber || ""}
                onChange={(e) => handleNestedChange("insurance", "policyNumber", e.target.value)}
                placeholder="BCBS-84920491"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Group Number
              </label>
              <input
                type="text"
                value={profile.insurance?.groupNumber || ""}
                onChange={(e) => handleNestedChange("insurance", "groupNumber", e.target.value)}
                placeholder="GRP-9021"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Coverage Verification
              </label>
              <div className="px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Active Electronic Eligibility
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Insurance Policy"}
            </button>
          </div>
        </form>
      )}

      {/* 🩺 TAB 2: Clinician Practice & Timings (Doctors only) */}
      {activeTab === "practice" && role === "DOCTOR" && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Clinical Practice & Availability Preferences
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Defines intake availability and appointment scheduling buffers in the hospital master calendar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Default Encounter Slot Duration
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  value={profile.consultationDuration}
                  onChange={(e) => handleInputChange("consultationDuration", Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition bg-white"
                >
                  <option value={15}>15 Minutes (Brief Follow-up)</option>
                  <option value={30}>30 Minutes (Standard Consultation)</option>
                  <option value={45}>45 Minutes (Comprehensive Exam)</option>
                  <option value={60}>60 Minutes (Initial Intake / Diagnostic)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Patient Intake Status
              </label>
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => handleInputChange("acceptingPatients", !profile.acceptingPatients)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    profile.acceptingPatients ? "bg-teal-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      profile.acceptingPatients ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm font-semibold text-slate-800">
                  {profile.acceptingPatients ? "Accepting New Patients" : "Intake Closed (Roster Full)"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Clinical Preferences"}
            </button>
          </div>
        </form>
      )}

      {/* 🏛 TAB 2: Governance & System Controls (Admins only) */}
      {activeTab === "system" && role === "ADMIN" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Institutional Governance & Master Registry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              System-wide rules, HIPAA audit retention, and medical board dispatch controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 className="text-sm font-bold text-slate-900 mb-1">Facility Name</h4>
              <p className="text-xs text-slate-600">Metropolitan Medical Center & Ambulatory Surgical Hospital</p>
              <span className="text-[11px] text-teal-700 font-mono mt-2 block">CMS-CERT: 84920-ALPHA</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 className="text-sm font-bold text-slate-900 mb-1">HIPAA Audit Trail</h4>
              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Immutable Encryption Active (TLS 1.3 / AES-256)
              </p>
              <span className="text-[11px] text-slate-500 mt-2 block">7-Year Regulatory Retention Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* 🔒 TAB 4: Security & Account Authentication */}
      {activeTab === "security" && (
        <form onSubmit={handleChangePassword} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Security & Credential Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep your hospital account secure by updating credentials regularly.
            </p>
          </div>

          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                New Password (Minimum 6 Characters)
              </label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Shield className="w-4 h-4 text-teal-400" />
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
