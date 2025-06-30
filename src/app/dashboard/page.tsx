import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import OverviewCards from "@/components/OverviewCards";
import AppointmentOverview from "@/components/AppointmentOverview";
import UpcomingAppointments from "@/components/UpcomingAppointments";
import BillingOverview from "@/components/BillingOverview";
import DoctorSchedules from "@/components/DoctorSchedules";
import PatientsAndGenderPanel from "@/components/PatientsAndGenderPanel";
import Doctors from "@/components/doctors";

export const metadata = {
  title: "Dashboard | Hospital Management",
  description: "Hospital data at your fingertips.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  console.log("Session data:", JSON.stringify(session, null, 2));

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex">
      <main className="flex-1 p-6 space-y-6">
        <OverviewCards />

        {/* Grid Section: Appointments + Sidebar Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AppointmentOverview />
          <UpcomingAppointments />
          <PatientsAndGenderPanel />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <BillingOverview />
          <Doctors />
        </div>

        {/* Doctor Schedule */}
        <DoctorSchedules />
      </main>
    </div>
  );
}
