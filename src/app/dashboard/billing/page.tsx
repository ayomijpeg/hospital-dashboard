"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  FileText,
  User,
  Stethoscope,
  CreditCard
} from "lucide-react";

type Bill = {
  id: number;
  patientId: number | null;
  doctorId: number;
  patientName: string;
  services: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Overdue";
  issuedAt: string;
  paidAt: string | null;
  patient: { name: string } | null;
  doctor: { name: string } | null;
};

function BillingContent() {
  const { data: session } = useSession();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const activeFilter = searchParams.get("filter") || "all";

  const userRole = (session?.user?.role || "PATIENT").toUpperCase();
  const isStaff = userRole === "DOCTOR" || userRole === "ADMIN";

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/billing");
      if (!res.ok) throw new Error("Failed to load billing records");
      const data = await res.json();
      setBills(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load billing records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleMarkAsPaid = async (id: number) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/billing/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Payment update failed");

      setBills((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "Paid", paidAt: new Date().toISOString() } : b
        )
      );

      toast.success("Bill marked as Paid successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBills = bills.filter((bill) => {
    if (activeFilter === "pending") return bill.status === "Unpaid";
    if (activeFilter === "overdue") return bill.status === "Overdue";
    if (activeFilter === "paid") return bill.status === "Paid";
    return true;
  });

  // Calculate metrics
  const totalRevenue = bills
    .filter((b) => b.status === "Paid")
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const pendingAmount = bills
    .filter((b) => b.status === "Unpaid" || b.status === "Overdue")
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isStaff ? "Hospital Billing & Financial Ledger" : "My Medical Invoices & Copays"}
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              {isStaff ? "Financial Command" : "Patient Billing Portal"}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {isStaff
              ? "Reconcile consultation encounters, manage accounts receivable, and oversee claim settlements."
              : "Review your itemized clinical statements, consultation fees, and settle outstanding balances securely."}
          </p>
        </div>

        {isStaff && (
          <Link
            href="/dashboard/appointments"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Bill Confirmed Encounter</span>
          </Link>
        )}
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isStaff ? "Total Collected" : "Total Settled Copays"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            ₦{totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isStaff ? "Verified patient payments" : "Fully paid consultations"}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isStaff ? "Pending Receivables" : "Outstanding Balance Due"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            ₦{pendingAmount.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isStaff
              ? `${bills.filter((b) => b.status === "Unpaid").length} unpaid invoices`
              : "Awaiting patient copay"}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isStaff ? "Total Invoices" : "My Invoices Issued"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {bills.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isStaff ? "Across all clinic departments" : "Personal clinical statements"}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { label: "All Invoices", key: "all" },
          { label: "Unpaid", key: "pending" },
          { label: "Paid", key: "paid" },
          { label: "Overdue", key: "overdue" },
        ].map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <Link
              key={tab.key}
              href={`/dashboard/billing${tab.key === "all" ? "" : `?filter=${tab.key}`}`}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredBills.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">No billing records found</h3>
            <p className="text-sm text-slate-500 mt-1">
              There are currently no invoices matching the selected filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Invoice #</th>
                  <th scope="col" className="px-5 py-3.5">Patient Name</th>
                  <th scope="col" className="px-5 py-3.5">Clinician</th>
                  <th scope="col" className="px-5 py-3.5">Services Rendered</th>
                  <th scope="col" className="px-5 py-3.5">Amount</th>
                  <th scope="col" className="px-5 py-3.5">Payment Status</th>
                  <th scope="col" className="px-5 py-3.5">Issued Date</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Invoice ID */}
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-xs text-slate-500 font-semibold">
                      INV-{String(bill.id).padStart(5, "0")}
                    </td>

                    {/* Patient */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-900">
                          {bill.patientName || bill.patient?.name || "Outpatient"}
                        </span>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="px-5 py-4 whitespace-nowrap text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                        <span>Dr. {bill.doctor?.name || "Hospital Staff"}</span>
                      </div>
                    </td>

                    {/* Services */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-600 max-w-xs truncate">
                      {bill.services}
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 whitespace-nowrap font-bold font-mono text-slate-900">
                      ₦{bill.amount.toLocaleString()}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          bill.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : bill.status === "Overdue"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {bill.status === "Paid" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {bill.status === "Unpaid" && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                        {bill.status === "Overdue" && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                        <span>{bill.status}</span>
                      </span>
                    </td>

                    {/* Issued Date */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                      {formatDate(bill.issuedAt)}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      {bill.status !== "Paid" ? (
                        <button
                          onClick={() => handleMarkAsPaid(bill.id)}
                          disabled={updatingId === bill.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-xs transition disabled:opacity-50"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>
                            {updatingId === bill.id
                              ? "Processing..."
                              : isStaff
                              ? "Reconcile Paid"
                              : "Pay Invoice Online"}
                          </span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" />
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}
