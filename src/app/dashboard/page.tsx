import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import OverviewCards from "@/components/OverviewCards";
import UpcomingAppointments from "@/components/UpcomingAppointments";
import BillingOverview from "@/components/BillingOverview";
import DoctorSchedules from "@/components/DoctorSchedules";
import PatientsAndGenderPanel from "@/components/PatientsAndGenderPanel";
import Doctors from "@/components/doctors";
import PatientPortalView from "@/components/PatientPortalView";

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

  const role = (session.user?.role || "DOCTOR").toUpperCase();

  // Tailored Patient Portal Experience
  if (role === "PATIENT" || role === "USER") {
    return (
      <PatientPortalView
        userName={session.user?.name || "Patient"}
        userEmail={session.user?.email || ""}
      />
    );
  }

  // Doctor & Executive Clinical Dashboard
  return (
    <div className="space-y-6">
      {/* Overview Cards Section */}
      <OverviewCards />

      {/* Primary Clinical Schedule & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingAppointments />
        </div>
        <div className="lg:col-span-1">
          <PatientsAndGenderPanel />
        </div>
      </div>

      {/* Billing and Doctors Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BillingOverview />
        <Doctors />
      </div>

      {/* Doctor Schedule Section */}
      <DoctorSchedules />
    </div>
  );
}
