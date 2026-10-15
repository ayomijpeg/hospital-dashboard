'use client'

import { Suspense } from 'react'
import SignupForm from '@/components/SignupForm'

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
