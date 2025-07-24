export type Gender = 'Male' | 'Female';

export type Appointment = {
  id: string
  name: string
  gender: string
  age: number
  avatar?: string
  dateTime: string
  time: string
  status: 'Pending' | 'Confirmed' | 'Declined'
  doctor: {
    name: string
    department: string
    avatar?: string
  }
  createdAt: string
}
