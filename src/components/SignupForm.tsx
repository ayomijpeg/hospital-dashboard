'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, User, Stethoscope, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Gynecology',
  'Ophthalmology',
  'Surgery',
  'Emergency',
];

export default function SignupForm() {
  const router = useRouter();

  // Role Selection
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    department: 'General Medicine',
    age: '28',
    condition: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!form.name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!form.email.trim()) {
      setError('Please provide a valid email address');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must contain at least 8 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
        gender: form.gender,
        ...(role === 'doctor'
          ? { department: form.department }
          : { age: parseInt(form.age, 10) || 28, condition: form.condition.trim() }),
      };

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create your account');
      }

      toast.success(
        role === 'doctor'
          ? 'Doctor account created! Redirecting to login...'
          : 'Patient account created! Redirecting to login...'
      );

      setTimeout(() => {
        router.push('/login');
      }, 1200);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Hospital Branding Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
              <Image
                src="/images/logo.png"
                alt="Hospital Logo"
                width={28}
                height={28}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Doct<span className="text-teal-600">.</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Create your hospital portal account
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Choose your account type to access personalized clinical services
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {/* Step 1: Professional Role Picker */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              I am registering as:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Patient Card */}
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`relative flex flex-col p-4 text-left rounded-xl border transition-all ${
                  role === 'patient'
                    ? 'border-teal-600 bg-teal-50/40 ring-1 ring-teal-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      role === 'patient'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  {role === 'patient' && (
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  )}
                </div>
                <h3 className="font-semibold text-sm text-slate-900">Patient</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Book appointments, view prescriptions, and manage healthcare bills.
                </p>
              </button>

              {/* Doctor Card */}
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`relative flex flex-col p-4 text-left rounded-xl border transition-all ${
                  role === 'doctor'
                    ? 'border-teal-600 bg-teal-50/40 ring-1 ring-teal-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      role === 'doctor'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  {role === 'doctor' && (
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  )}
                </div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Doctor / Medical Staff
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Manage patient appointments, clinical schedules, and patient records.
                </p>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-start gap-2.5">
              <span className="font-semibold shrink-0">Error:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder={role === 'doctor' ? 'Dr. Elizabeth Blackwell' : 'Jane Doe'}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@hospital.com"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Contextual Fields for Doctor */}
            {role === 'doctor' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            )}

            {/* Contextual Fields for Patient */}
            {role === 'patient' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={form.age}
                    onChange={handleChange}
                    placeholder="e.g. 32"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    className="w-full pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-teal-600 hover:text-teal-700">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Encrypted HIPAA-compliant hospital information management</span>
        </div>
      </div>
    </div>
  );
}
