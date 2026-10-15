// src/libs/devAuthStore.ts
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface DevAccount {
  id: number;
  name: string;
  email: string;
  password: string; // bcrypt hash
  role: "doctor" | "patient" | "admin";
  department?: string;
  gender?: string;
  avatar?: string;
  age?: number;
  condition?: string;
  phone?: string;
  address?: string;
  bloodGroup?: string;
  allergies?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  licenseNumber?: string;
  npi?: string;
  roomNumber?: string;
  consultationDuration?: number;
  acceptingPatients?: boolean;
  createdAt: string;
}

const STORE_FILE = path.join(process.cwd(), ".dev-auth-store.json");

// Pre-seeded accounts with known hashes for offline testing
const SEED_ACCOUNTS: DevAccount[] = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    email: "s.jenkins@hospital.org",
    password: bcrypt.hashSync("doctor12345", 10),
    role: "doctor",
    department: "Cardiology",
    gender: "Female",
    avatar: "female-doctor.jpg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Dr. Jonathan Reyes",
    email: "doctor@hospital.org",
    password: bcrypt.hashSync("doctor12345", 10),
    role: "doctor",
    department: "Pediatrics",
    gender: "Male",
    avatar: "male-doctor.jpg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Eleanor Vance",
    email: "eleanor.vance@gmail.com",
    password: bcrypt.hashSync("patient12345", 10),
    role: "patient",
    gender: "Female",
    avatar: "female1.jpg",
    age: 54,
    condition: "Hypertension Monitoring",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Marcus Sterling",
    email: "patient@hospital.org",
    password: bcrypt.hashSync("patient12345", 10),
    role: "patient",
    gender: "Male",
    avatar: "male1.jpg",
    age: 8,
    condition: "Pediatric Wellness Checkup",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Hospital Administrator",
    email: "admin@hospital.org",
    password: bcrypt.hashSync("admin12345", 10),
    role: "admin",
    department: "Executive Medical Board",
    avatar: "doctor1.jpg",
    createdAt: new Date().toISOString(),
  },
];

function readStore(): DevAccount[] {
  try {
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(SEED_ACCOUNTS, null, 2), "utf-8");
      return SEED_ACCOUNTS;
    }
    const raw = fs.readFileSync(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_ACCOUNTS;
  } catch (err) {
    console.warn("Failed to read dev auth store, using fallback seed:", err);
    return SEED_ACCOUNTS;
  }
}

function writeStore(accounts: DevAccount[]) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(accounts, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write to dev auth store:", err);
  }
}

export const devAuthStore = {
  getAll(): DevAccount[] {
    return readStore();
  },

  findByEmail(email: string): DevAccount | undefined {
    const accounts = readStore();
    return accounts.find((a) => a.email.toLowerCase() === email.toLowerCase().trim());
  },

  create(accountData: Omit<DevAccount, "id" | "createdAt">): DevAccount {
    const accounts = readStore();
    const cleanEmail = accountData.email.toLowerCase().trim();

    // Check duplicate
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error("An account with this email address already exists");
    }

    const nextId = accounts.length > 0 ? Math.max(...accounts.map((a) => a.id)) + 1 : 1;
    const newAccount: DevAccount = {
      ...accountData,
      id: nextId,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    writeStore(accounts);
    return newAccount;
  },

  update(email: string, updates: Partial<DevAccount>): DevAccount {
    const accounts = readStore();
    const cleanEmail = email.toLowerCase().trim();
    const idx = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);
    if (idx === -1) {
      throw new Error("Account not found");
    }
    accounts[idx] = {
      ...accounts[idx],
      ...updates,
      id: accounts[idx].id,
      email: accounts[idx].email, // protect original email
    };
    writeStore(accounts);
    return accounts[idx];
  },
};
