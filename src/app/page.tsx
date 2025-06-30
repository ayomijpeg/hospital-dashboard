<<<<<<< HEAD
// src/app/page.tsx
'use client'
import Image from "next/image"
import Link from "next/link"
import {useState} from 'react'

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
        Powerful, easy-to-use hospital management platform. From patient registration
        to appointment tracking, billing, and payroll — manage it all in one place.
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
          { title: "Patient Management", desc: "Track, admit, and monitor patients with ease." },
          { title: "Doctor Schedules", desc: "Manage and visualize doctor shifts and availability." },
          { title: "Billing & Payroll", desc: "Automate hospital billing and staff payments securely." },
        ].map((feature, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow hover:shadow-md transition">
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
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>


      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Hospital Dashboard Built By OPEYEMI AYOMI. All rights reserved.
      </footer>
    </div>
  )
=======
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
>>>>>>> ecdf981a7d2f216d58212e2c9b174f114021b032
}
