// src/app/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="min-h-screen bg-[#f6f8fa] text-gray-800 flex flex-col items-center px-6 py-12">
      {/* Logo + App Title */}
      <div className="flex items-center gap-3 mb-6">
        <Image
          src="/images/logo.png"
          alt="Hospital Dashboard Logo"
          width={50}
          height={50}
        />
        <h1 className="text-2xl sm:text-3xl font-bold">Hospital Dashboard</h1>
      </div>

      {/* Tagline / Summary */}
      <p className="max-w-xl text-center text-gray-600 mb-8 text-sm sm:text-base">
        Powerful, easy-to-use hospital management platform. From patient
        registration to appointment tracking, billing, and payroll — manage it
        all in one place.
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-4 mb-10">
        <Link
          href="/login"
          className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-5 rounded-lg text-sm font-medium"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="border border-teal-600 text-teal-600 hover:bg-teal-100 py-2 px-5 rounded-lg text-sm font-medium"
        >
          Sign Up
        </Link>
      </div>

      {/* Feature Overview */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mb-12 text-center">
        {[
          {
            title: "Patient Management",
            desc: "Track, admit, and monitor patients with ease.",
          },
          {
            title: "Doctor Schedules",
            desc: "Manage and visualize doctor shifts and availability.",
          },
          {
            title: "Billing & Payroll",
            desc: "Automate hospital billing and staff payments securely.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-4xl h-64 sm:h-80 bg-gray-200 rounded-lg shadow-inner overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 animate-pulse bg-gray-300" />
        )}

        <Image
          src="/images/dashboard.png"
          alt="App dashboard preview"
          fill
          className={`object-cover rounded-lg transition-opacity duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoadingComplete={() => setIsLoading(false)}
        />
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Hospital Dashboard Built By OPEYEMI
        AYOMI. All rights reserved.
      </footer>
    </div>
  );
}
