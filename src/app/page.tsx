// src/app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Users, 
  CalendarCheck, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  HeartPulse
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="Hospital Logo"
                width={24}
                height={24}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Doct<span className="text-teal-600">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-16 pb-20 max-w-6xl mx-auto text-center">
        {/* Quality Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-6">
          <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
          <span>Clinical Excellence & Patient Care Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl">
          Unified Healthcare Management <br className="hidden sm:inline" />
          <span className="text-teal-600">for Modern Clinical Teams</span>
        </h1>

        <p className="mt-5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
          From multi-specialty patient intake and real-time appointment scheduling to itemized billing and clinical consultation records — all in one unified, role-based healthcare portal.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3.5 justify-center w-full max-w-xs sm:max-w-none">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-sm transition"
          >
            <span>Register as Patient or Doctor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-lg text-sm font-semibold transition"
          >
            Access Portal
          </Link>
        </div>

        {/* Role Pillars */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl w-full mt-16 text-left">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">For Patients</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Book consultations with vetted specialists, view clinical history, and manage healthcare payments with ease.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">For Physicians</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Manage chronological appointment queues, access patient EHR notes, and set daily shift availability without overlap.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">For Administrators</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Hospital-wide operational control, staff verification, transparent financial audit trails, and department analytics.
            </p>
          </div>
        </div>

        {/* Dashboard Preview Frame */}
        <div className="mt-14 w-full max-w-5xl rounded-2xl p-2 bg-slate-200 border border-slate-300 shadow-sm">
          <div className="relative w-full h-72 sm:h-96 md:h-[480px] bg-slate-900 rounded-xl overflow-hidden">
            <Image
              src="/images/dashboard.png"
              alt="Clinical Dashboard Portal Preview"
              fill
              unoptimized
              priority
              className="object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            Role-Based Access Control
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            PostgreSQL & Prisma Data Engine
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            Edge-Protected Middleware
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 bg-white">
        &copy; {new Date().getFullYear()} Hospital Clinical Information System. All rights reserved.
      </footer>
    </div>
  );
}
