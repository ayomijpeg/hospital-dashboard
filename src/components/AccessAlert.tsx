"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { ShieldAlert } from "lucide-react";

export default function AccessAlert() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      if (error === "restricted_admin_clearance") {
        toast.error("Access Restricted: Hospital Governance is reserved for Administrators.", {
          duration: 5000,
          id: "rbac-error",
        });
      } else if (error === "restricted_clinical_clearance") {
        toast.error("Access Restricted: Clinical rosters & records require Clinician credentials.", {
          duration: 5000,
          id: "rbac-error",
        });
      }

      // Clean up the URL parameter without refreshing
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      const nextQuery = params.toString() ? `?${params.toString()}` : "";
      router.replace(`${pathname}${nextQuery}`);
    }
  }, [error, pathname, router, searchParams]);

  if (!error) return null;

  return (
    <div className="mb-4 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-semibold">
          {error === "restricted_admin_clearance"
            ? "Administrative Boundary Enforced: You were redirected because this console requires Hospital System Admin privileges."
            : "Clinical Boundary Enforced: You were redirected because this department requires Attending Clinician credentials."}
        </span>
      </div>
    </div>
  );
}
