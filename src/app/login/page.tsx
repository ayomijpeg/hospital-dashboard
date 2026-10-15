'use client'

import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
