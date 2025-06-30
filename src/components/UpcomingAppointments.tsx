import { upcomingAppointments } from '@/data/upcomingAppointments';
import AppointmentCard from './AppointmentCard';

export default function UpcomingAppointments() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
        <a href="/appointments" className="text-sm text-blue-600 hover:underline">View All</a>
      </div>
      <div className="space-y-3">
        {upcomingAppointments.map((apt) => (
          <AppointmentCard key={apt.id} data={apt} />
        ))}
      </div>
    </div>
  );
}
