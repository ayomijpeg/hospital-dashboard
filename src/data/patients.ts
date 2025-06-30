// src/data/patients.ts
export interface Patient {
  id: number
  name: string
  age: number
  gender: 'Male' | 'Female'
  email: string
  phone: string
  status: 'Admitted' | 'Discharged' | 'Under Observation'
}

export const patients: Patient[] = [
  {
    id: 1,
    name: 'Jane Doe',
    age: 28,
    gender: 'Female',
    email: 'jane.doe@example.com',
    phone: '08012345678',
    status: 'Admitted',
  },
  {
    id: 2,
    name: 'John Smith',
    age: 35,
    gender: 'Male',
    email: 'john.smith@example.com',
    phone: '08023456789',
    status: 'Discharged',
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    age: 42,
    gender: 'Female',
    email: 'sarah.johnson@example.com',
    phone: '08034567890',
    status: 'Under Observation',
  },
]
