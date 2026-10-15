// src/libs/devDataStore.ts
import fs from "fs";
import path from "path";

export interface DevPatient {
  id: number;
  name: string;
  email: string;
  age: number;
  condition: string;
  avatar: string;
  gender?: string;
  createdAt: string;
  _count?: {
    appointments: number;
    bills: number;
  };
}

export interface DevAppointment {
  id: string;
  name: string;
  gender: string;
  age: number;
  dateTime: string;
  status: "Pending" | "Confirmed" | "Declined" | "In-Consultation" | "Completed";
  doctorId: number;
  patientEmail?: string;
  avatar: string;
  doctor?: {
    id: number;
    name: string;
    department: string;
  };
  createdAt: string;
}

export interface DevBill {
  id: string | number;
  appointmentId: string;
  patientName: string;
  patientEmail?: string;
  patient: { id: string | number | null; name: string };
  doctor: { id: string | number; name: string };
  doctorId?: number;
  services: string;
  amount: number;
  status: "Paid" | "Unpaid";
  issuedAt: string;
  appointmentName?: string | null;
}

const STORE_PATH = path.join(process.cwd(), ".dev-hospital-store.json");

interface HospitalStoreData {
  patients: DevPatient[];
  appointments: DevAppointment[];
  bills: DevBill[];
}

const DEFAULT_STORE: HospitalStoreData = {
  patients: [
    { id: 1, name: "Eleanor Vance", email: "eleanor.vance@gmail.com", age: 54, condition: "Hypertension Monitoring", avatar: "female1.jpg", gender: "Female", createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), _count: { appointments: 1, bills: 1 } },
    { id: 2, name: "Marcus Sterling", email: "marcus.sterling@gmail.com", age: 8, condition: "Pediatric Wellness Checkup", avatar: "male2.jpg", gender: "Male", createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), _count: { appointments: 1, bills: 1 } },
    { id: 3, name: "Amina Al-Mansoor", email: "amina.almansoor@gmail.com", age: 42, condition: "Neurological Follow-up", avatar: "female3.jpg", gender: "Female", createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), _count: { appointments: 1, bills: 1 } },
  ],
  appointments: [
    {
      id: "apt-101",
      name: "Eleanor Vance",
      patientEmail: "eleanor.vance@gmail.com",
      gender: "Female",
      age: 54,
      dateTime: new Date(Date.now() + 3600000 * 2).toISOString(),
      status: "Confirmed",
      doctorId: 1,
      avatar: "female1.jpg",
      doctor: { id: 1, name: "Sarah Jenkins", department: "Cardiology" },
      createdAt: new Date().toISOString(),
    },
    {
      id: "apt-102",
      name: "Marcus Sterling",
      patientEmail: "marcus.sterling@gmail.com",
      gender: "Male",
      age: 8,
      dateTime: new Date(Date.now() + 3600000 * 5).toISOString(),
      status: "Confirmed",
      doctorId: 2,
      avatar: "male2.jpg",
      doctor: { id: 2, name: "Jonathan Reyes", department: "Pediatrics" },
      createdAt: new Date().toISOString(),
    },
    {
      id: "apt-103",
      name: "Amina Al-Mansoor",
      patientEmail: "amina.almansoor@gmail.com",
      gender: "Female",
      age: 42,
      dateTime: new Date(Date.now() + 86400000).toISOString(),
      status: "Pending",
      doctorId: 3,
      avatar: "female3.jpg",
      doctor: { id: 3, name: "Elena Rostova", department: "Neurology" },
      createdAt: new Date().toISOString(),
    },
  ],
  bills: [
    {
      id: "bill-001",
      appointmentId: "apt-101",
      patientName: "Eleanor Vance",
      patientEmail: "eleanor.vance@gmail.com",
      patient: { id: 1, name: "Eleanor Vance" },
      doctor: { id: 1, name: "Dr. Sarah Jenkins" },
      doctorId: 1,
      services: "Cardiology Consultation & Resting ECG",
      amount: 220.00,
      status: "Paid",
      issuedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      appointmentName: "Comprehensive Cardiac Review",
    },
    {
      id: "bill-002",
      appointmentId: "apt-102",
      patientName: "Marcus Sterling",
      patientEmail: "marcus.sterling@gmail.com",
      patient: { id: 2, name: "Marcus Sterling" },
      doctor: { id: 2, name: "Dr. Jonathan Reyes" },
      doctorId: 2,
      services: "Pediatric Wellness Exam & MMR Booster",
      amount: 175.50,
      status: "Unpaid",
      issuedAt: new Date(Date.now() - 86400000).toISOString(),
      appointmentName: "Annual Pediatric Checkup",
    },
  ],
};

function readHospitalStore(): HospitalStoreData {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), "utf-8");
      return DEFAULT_STORE;
    }
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to read hospital store, using defaults:", err);
    return DEFAULT_STORE;
  }
}

function writeHospitalStore(data: HospitalStoreData) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write to hospital store:", err);
  }
}

export const devHospitalStore = {
  // --- Patients ---
  getPatients(query?: string): DevPatient[] {
    const store = readHospitalStore();
    if (!query) return store.patients;
    const q = query.toLowerCase().trim();
    return store.patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q)
    );
  },

  createPatient(data: Omit<DevPatient, "id" | "createdAt">): DevPatient {
    const store = readHospitalStore();
    const cleanEmail = data.email.toLowerCase().trim();

    if (store.patients.some((p) => p.email.toLowerCase() === cleanEmail)) {
      throw new Error("A patient with this email is already registered");
    }

    const nextId = store.patients.length > 0 ? Math.max(...store.patients.map((p) => p.id)) + 1 : 1;
    const newPatient: DevPatient = {
      ...data,
      id: nextId,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      _count: { appointments: 0, bills: 0 },
    };

    store.patients.unshift(newPatient);
    writeHospitalStore(store);
    return newPatient;
  },

  // --- Appointments ---
  getAppointments(filter?: { doctorId?: number | null; patientEmail?: string | null; patientName?: string | null }): DevAppointment[] {
    const store = readHospitalStore();
    let result = store.appointments;

    if (filter?.patientEmail) {
      const email = filter.patientEmail.toLowerCase().trim();
      result = result.filter(
        (a) => (a.patientEmail && a.patientEmail.toLowerCase() === email) ||
               (filter.patientName && a.name.toLowerCase() === filter.patientName.toLowerCase().trim())
      );
      return result;
    }

    if (filter?.patientName) {
      const name = filter.patientName.toLowerCase().trim();
      result = result.filter((a) => a.name.toLowerCase() === name);
      return result;
    }

    if (filter?.doctorId) {
      result = result.filter((a) => a.doctorId === filter.doctorId);
      return result;
    }

    return result;
  },

  createAppointment(data: Omit<DevAppointment, "id" | "createdAt">): DevAppointment {
    const store = readHospitalStore();
    const newAppointment: DevAppointment = {
      ...data,
      id: `apt-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };

    store.appointments.unshift(newAppointment);
    writeHospitalStore(store);
    return newAppointment;
  },

  updateAppointmentStatus(id: string | number, status: DevAppointment["status"]): DevAppointment | null {
    const store = readHospitalStore();
    const appt = store.appointments.find((a) => String(a.id) === String(id));
    if (!appt) return null;

    appt.status = status;
    writeHospitalStore(store);
    return appt;
  },

  // --- Billing ---
  getBills(filter?: { patientEmail?: string | null; patientName?: string | null; doctorId?: number | null }): DevBill[] {
    const store = readHospitalStore();
    let result = store.bills;

    if (filter?.patientEmail) {
      const email = filter.patientEmail.toLowerCase().trim();
      result = result.filter(
        (b) => (b.patientEmail && b.patientEmail.toLowerCase() === email) ||
               (filter.patientName && b.patientName.toLowerCase() === filter.patientName.toLowerCase().trim())
      );
      return result;
    }

    if (filter?.patientName) {
      const name = filter.patientName.toLowerCase().trim();
      result = result.filter((b) => b.patientName.toLowerCase() === name);
      return result;
    }

    if (filter?.doctorId) {
      result = result.filter((b) => b.doctorId === filter.doctorId);
      return result;
    }

    return result;
  },

  createBill(data: Omit<DevBill, "id" | "issuedAt">): DevBill {
    const store = readHospitalStore();
    const newBill: DevBill = {
      ...data,
      id: `bill-${Date.now().toString().slice(-6)}`,
      issuedAt: new Date().toISOString(),
    };

    store.bills.unshift(newBill);
    writeHospitalStore(store);
    return newBill;
  },

  markBillPaid(id: string | number): DevBill | null {
    const store = readHospitalStore();
    const bill = store.bills.find((b) => String(b.id) === String(id));
    if (!bill) return null;

    bill.status = "Paid";
    writeHospitalStore(store);
    return bill;
  },
};
