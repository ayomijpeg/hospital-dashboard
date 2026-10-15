"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  X,
  Stethoscope,
  Pill,
  FileText,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Appointment } from "@/types/appointment";

interface ConsultationModalProps {
  appointment: Appointment;
  onClose: () => void;
  onConsultationCompleted: (appointmentId: string | number) => void;
}

interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const CLINICAL_PRESETS = {
  cardiology: {
    subjective: "Patient presents for routine cardiovascular follow-up. Reports mild exertional fatigue, denies chest pain, palpitations, or orthopnea.",
    objective: "BP 128/82 mmHg, HR 72 bpm regular, S1/S2 present without murmurs. Lungs clear to auscultation bilaterally. No peripheral edema.",
    assessment: "I10 - Essential (primary) hypertension, well-controlled on current regimen.",
    plan: "Continue daily antihypertensive regimen. Repeat lipid panel and basic metabolic panel in 6 months. Advise 30 min daily aerobic exercise.",
    defaultMeds: [
      { id: "1", name: "Amlodipine Besylate", dosage: "5mg", frequency: "Once daily in the morning", duration: "90 days" },
      { id: "2", name: "Atorvastatin Calcium", dosage: "20mg", frequency: "Once daily at bedtime", duration: "90 days" }
    ],
    fee: 220
  },
  general: {
    subjective: "Patient presents with persistent cough and throat irritation for 4 days. Denies high fever or shortness of breath.",
    objective: "Temp 99.1°F, O2 Sat 98% on room air. Pharynx mildly erythematous without exudate. Tympanic membranes clear. Lungs clear bilaterally.",
    assessment: "J06.9 - Acute upper respiratory infection, viral etiology presumed.",
    plan: "Symptomatic management, aggressive hydration, warm saline gargles. Rest. Follow up in 5-7 days if symptoms persist or fever spikes.",
    defaultMeds: [
      { id: "1", name: "Benzonatate (Tessalon)", dosage: "100mg", frequency: "Three times daily as needed for cough", duration: "7 days" },
      { id: "2", name: "Acetaminophen", dosage: "500mg", frequency: "Every 6 hours as needed for discomfort", duration: "5 days" }
    ],
    fee: 150
  },
  pediatrics: {
    subjective: "Routine pediatric well-child milestone examination. Caregiver notes healthy appetite, normal sleeping patterns, and age-appropriate speech development.",
    objective: "Height 50th percentile, Weight 55th percentile. Active, alert, playful. Eyes, ears, heart, lungs clear and normal.",
    assessment: "Z00.129 - Routine child health examination with normal findings.",
    plan: "Administered scheduled age-appropriate immunizations. Anticipatory guidance discussed regarding nutrition, screen time, and helmet safety.",
    defaultMeds: [],
    fee: 175
  }
};

export default function ConsultationModal({
  appointment,
  onClose,
  onConsultationCompleted,
}: ConsultationModalProps) {
  const [activeTab, setActiveTab] = useState<"soap" | "rx" | "billing">("soap");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vitals State
  const [vitals, setVitals] = useState({
    bp: "120/80",
    hr: "72",
    temp: "98.6",
    spo2: "99",
  });

  // SOAP State
  const [subjective, setSubjective] = useState(
    "Patient presents for scheduled medical review. Reports feeling generally well with no acute distress."
  );
  const [objective, setObjective] = useState(
    "Alert, oriented x3. Vital signs stable. Heart sounds regular S1/S2. Breath sounds clear bilaterally."
  );
  const [assessment, setAssessment] = useState(
    "Z00.00 - General adult medical examination without abnormal findings."
  );
  const [plan, setPlan] = useState(
    "Continue current lifestyle and healthy diet. Routine preventative screening recommended in 12 months."
  );

  // Prescriptions State
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: "rx-1",
      name: "Multivitamin Complex",
      dosage: "1 tablet",
      frequency: "Once daily with food",
      duration: "30 days",
    },
  ]);
  const [newMedName, setNewMedName] = useState("");
  const [newMedDose, setNewMedDose] = useState("");
  const [newMedFreq, setNewMedFreq] = useState("");
  const [newMedDur, setNewMedDur] = useState("30 days");

  // Billing State
  const [serviceFee, setServiceFee] = useState<number>(180);
  const [serviceDescription, setServiceDescription] = useState<string>(
    "Comprehensive Outpatient Clinical Evaluation & Management (EHR Enc-99214)"
  );

  const applyPreset = (presetKey: keyof typeof CLINICAL_PRESETS) => {
    const preset = CLINICAL_PRESETS[presetKey];
    setSubjective(preset.subjective);
    setObjective(preset.objective);
    setAssessment(preset.assessment);
    setPlan(preset.plan);
    setPrescriptions(preset.defaultMeds);
    setServiceFee(preset.fee);
    toast.success(`Applied ${presetKey.toUpperCase()} clinical template`);
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim() || !newMedDose.trim()) {
      toast.error("Medication name and dosage are required");
      return;
    }

    // Safety check for penicillin allergy
    if (newMedName.toLowerCase().includes("penicillin") || newMedName.toLowerCase().includes("amoxicillin")) {
      toast(
        () => (
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-slate-800">Allergy Warning Verification</p>
              <p className="text-slate-600">Please confirm patient does not have a registered beta-lactam hypersensitivity.</p>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    }

    setPrescriptions((prev) => [
      ...prev,
      {
        id: `rx-${Date.now()}`,
        name: newMedName.trim(),
        dosage: newMedDose.trim(),
        frequency: newMedFreq.trim() || "As directed by physician",
        duration: newMedDur.trim() || "30 days",
      },
    ]);

    setNewMedName("");
    setNewMedDose("");
    setNewMedFreq("");
    setNewMedDur("30 days");
    toast.success("Medication added to prescription queue");
  };

  const handleRemoveMedication = (id: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleFinalizeConsultation = async () => {
    setIsSubmitting(true);
    try {
      // 1. Update appointment status to Completed
      const patchRes = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (!patchRes.ok) {
        throw new Error("Failed to update appointment record");
      }

      // 2. Generate corresponding clinical bill
      const billRes = await fetch(`/api/billing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment.id,
          services: `${serviceDescription} | Diagnosis: ${assessment}`,
          amount: serviceFee,
        }),
      });

      if (!billRes.ok) {
        console.warn("Bill generation warning; appointment still marked completed.");
      }

      toast.success(
        `Consultation completed for ${appointment.name}. Invoice #${Math.floor(
          100000 + Math.random() * 900000
        )} generated!`,
        { duration: 4000 }
      );

      onConsultationCompleted(appointment.id);
      onClose();
    } catch (err) {
      console.error("Consultation completion failed:", err);
      toast.error("Failed to finalize encounter. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Clinical Consultation Encounter
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  EHR Workstation
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Attending: Dr. {appointment.doctor?.name || "Clinician"} ({appointment.doctor?.department || "General Practice"})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Summary Header Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-500 font-medium">Patient:</span>{" "}
              <strong className="text-slate-900 font-bold text-sm">{appointment.name}</strong>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <span className="text-slate-500 font-medium">Demographics:</span>{" "}
              <span className="text-slate-700 font-semibold">{appointment.gender}, {appointment.age} yrs</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <span className="text-slate-500 font-medium">MRN:</span>{" "}
              <code className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-mono text-[11px]">
                MRN-{String(appointment.id).replace(/[^0-9]/g, "").slice(0, 6) || "982410"}
              </code>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Allergies: Penicillin, Sulfa
            </span>
          </div>
        </div>

        {/* Vital Signs Strip */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Blood Pressure</span>
            <input
              type="text"
              value={vitals.bp}
              onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
              className="text-sm font-bold text-slate-800 bg-transparent w-full focus:outline-none"
              placeholder="120/80 mmHg"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Heart Rate</span>
            <div className="flex items-center">
              <input
                type="text"
                value={vitals.hr}
                onChange={(e) => setVitals({ ...vitals, hr: e.target.value })}
                className="text-sm font-bold text-slate-800 bg-transparent w-full focus:outline-none"
                placeholder="72"
              />
              <span className="text-[11px] text-slate-400 font-medium">bpm</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Body Temp</span>
            <div className="flex items-center">
              <input
                type="text"
                value={vitals.temp}
                onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                className="text-sm font-bold text-slate-800 bg-transparent w-full focus:outline-none"
                placeholder="98.6"
              />
              <span className="text-[11px] text-slate-400 font-medium">°F</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pulse Oximetry</span>
            <div className="flex items-center">
              <input
                type="text"
                value={vitals.spo2}
                onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                className="text-sm font-bold text-slate-800 bg-transparent w-full focus:outline-none"
                placeholder="99"
              />
              <span className="text-[11px] text-slate-400 font-medium">%</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 bg-slate-50/50 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("soap")}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition ${
                activeTab === "soap"
                  ? "border-teal-600 text-teal-700 bg-teal-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-4 h-4" />
              SOAP Documentation
            </button>

            <button
              onClick={() => setActiveTab("rx")}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition ${
                activeTab === "rx"
                  ? "border-teal-600 text-teal-700 bg-teal-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Pill className="w-4 h-4" />
              E-Prescription & Rx ({prescriptions.length})
            </button>

            <button
              onClick={() => setActiveTab("billing")}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition ${
                activeTab === "billing"
                  ? "border-teal-600 text-teal-700 bg-teal-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Receipt className="w-4 h-4" />
              Encounter Billing (${serviceFee})
            </button>
          </div>

          {/* Quick Specialty Template Buttons */}
          <div className="hidden sm:flex items-center gap-1.5 py-2">
            <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Template:
            </span>
            <button
              onClick={() => applyPreset("general")}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 rounded-md transition text-slate-700"
            >
              General
            </button>
            <button
              onClick={() => applyPreset("cardiology")}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 rounded-md transition text-slate-700"
            >
              Cardio
            </button>
            <button
              onClick={() => applyPreset("pediatrics")}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 rounded-md transition text-slate-700"
            >
              Pediatrics
            </button>
          </div>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === "soap" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subjective (Chief Complaint & History)
                </label>
                <textarea
                  rows={4}
                  value={subjective}
                  onChange={(e) => setSubjective(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none resize-none"
                  placeholder="Patient's primary complaint and clinical history..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Objective (Physical Findings & Vitals)
                </label>
                <textarea
                  rows={4}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none resize-none"
                  placeholder="Physical exam findings, auscultation, labs..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assessment (ICD-10 Clinical Diagnosis)
                </label>
                <textarea
                  rows={3}
                  value={assessment}
                  onChange={(e) => setAssessment(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none resize-none font-medium"
                  placeholder="Clinical diagnosis with ICD-10 code..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Plan (Therapy & Follow-up Instructions)
                </label>
                <textarea
                  rows={3}
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none resize-none"
                  placeholder="Medication regimen, lifestyle counseling, follow-up..."
                />
              </div>
            </div>
          )}

          {activeTab === "rx" && (
            <div className="space-y-5">
              {/* Add Medication Form */}
              <form onSubmit={handleAddMedication} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Add Clinical Medication
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Medication Name & Strength</label>
                    <input
                      type="text"
                      placeholder="e.g. Amoxicillin 500mg or Metformin"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dosage Form</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 capsule, 10mg"
                      value={newMedDose}
                      onChange={(e) => setNewMedDose(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 7 days / 30 days"
                      value={newMedDur}
                      onChange={(e) => setNewMedDur(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Instructions / Frequency (e.g. Take twice daily with morning meal)"
                    value={newMedFreq}
                    onChange={(e) => setNewMedFreq(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition shrink-0"
                  >
                    + Add to Rx
                  </button>
                </div>
              </form>

              {/* Prescription Items List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Prescription Orders ({prescriptions.length})
                </h4>
                {prescriptions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    No medications prescribed for this encounter.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                    {prescriptions.map((p, idx) => (
                      <div key={p.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                        <div className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold flex items-center justify-center mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{p.name}</p>
                            <p className="text-[11px] text-slate-500">
                              Dosage: <strong className="text-slate-700">{p.dosage}</strong> • Frequency: {p.frequency} • Course: {p.duration}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveMedication(p.id)}
                          className="text-xs text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-4 max-w-xl">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Encounter Coding & Charge
                </span>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Service Description
                  </label>
                  <input
                    type="text"
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Encounter Fee ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Automated Clinical Revenue Cycle</p>
                  <p className="text-teal-700 text-[11px] mt-0.5">
                    Upon final sign-off, an invoice will be automatically generated and linked to the patient record under Hospital Billing.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Current Diagnosis: <strong className="text-slate-800 font-semibold">{assessment.split("-")[0].trim()}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
            >
              Cancel / Close
            </button>

            <button
              onClick={handleFinalizeConsultation}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>Signing & Billing...</>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Sign Encounter & Generate Bill (${serviceFee})
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
