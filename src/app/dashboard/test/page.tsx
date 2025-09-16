"use client";

import { useEffect } from "react";
import supabase from "@/libs/supabase";

export default function HomePage() {
  useEffect(() => {
    async function getBills() {
      const { data, error } = await supabase.from("bill").select("*");

      if (error) {
        console.error("❌ Supabase Error:", error.message);
      } else {
        console.log("✅ Bills:", data);
      }
    }

    getBills();
  }, []);

  return (
    <main>
      <h1>Test Supabase Fetch</h1>
      <p>Open browser console to see result.</p>
    </main>
  );
}
