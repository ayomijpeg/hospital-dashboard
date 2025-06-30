// src/hooks/useDoctors.ts
'use client'
import { useEffect, useState } from 'react'

type Doctor = {
  id: number
  name: string
  specialty: string
  department: string
  email: string
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

 useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors')
      const data = await res.json()
      console.log('Fetched doctors:', data) // 👈 LOG IT
      setDoctors(data)
    } catch (err) {
      console.error('Failed to fetch doctors:', err)
    } finally {
      setLoading(false)
    }
  }

  fetchDoctors()
}, [])


  return { doctors, loading }
}
