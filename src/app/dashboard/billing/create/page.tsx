"use client";

import { Suspense } from "react";
import CreateBillPageInner from "./CreateBillPageInner";

export default function CreateBillPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CreateBillPageInner />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
