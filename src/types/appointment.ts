export type Gender = "Male" | "Female" | "Other";

export type AppointmentStatus = "Pending" | "Confirmed" | "Declined" | "In-Consultation" | "Completed" | "Cancelled";

export type Appointment = {
  id: string | number;
  name: string;
  gender: string;
  age: number;
  avatar?: string | null;
  dateTime?: string | Date;
  date?: string;
  time?: string;
  status: AppointmentStatus;
  doctorId?: number | string;
  patientId?: number | string | null;
  doctor?: {
    id?: number;
    name: string;
    department: string;
    avatar?: string | null;
  };
  createdAt?: string | Date;
  notes?: string;
  prescription?: string;
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temp?: number;
  };
};

