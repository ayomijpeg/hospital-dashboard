import Link from 'next/link'

export default function Doctors() {
  return (
    <div className="grid gap-6 p-6">
      {/* Example Widget Card */}
      <div className="p-4 bg-white shadow rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-medium">Total Doctors</p>
            <h2 className="text-2xl font-bold text-gray-500">24</h2>
          </div>
          <Link
            href="/dashboard/doctors"
            className="text-teal-600 hover:underline text-sm"
          >
            Manage Doctors →
          </Link>
        </div>
      </div>
    </div>
  )
}
