// src/components/BillingPromptModal.tsx
'use client'

import { useEffect } from 'react'

type BillingPromptModalProps = {
  appointmentId: string
  onClose: () => void
}

export default function BillingPromptModal({ appointmentId, onClose }: BillingPromptModalProps) {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">Create Bill for Appointment</h2>

        <p className="text-sm text-gray-600 mb-4">You confirmed this appointment. Would you like to create a bill for this patient?</p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>

          <a
            href={`/dashboard/billing/create?appointmentId=${appointmentId}`}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Yes, Create Bill
          </a>
        </div>
      </div>
    </div>
  )
}
