import { getAppoimentsWithRedirect } from '@/services/server-side/getAppointments';
import { getEmployeesWithRedirect } from '@/services/server-side/getEmployees';
import { getHaircutsWithRedirect } from '@/services/server-side/getHaircuts';
import { formatAppointmentsData } from '@/helpers/formatAppointmentsData';
import { Dashboard } from '@/components/Dashboard';
import { getSession } from '@/helpers/getSession';
import { Navbar } from '@/components/Navbar';

export default async function Page() {
  const [session, haircuts, employees, appointments] = await Promise.all([
    getSession(),
    getHaircutsWithRedirect(),
    getEmployeesWithRedirect(),
    getAppoimentsWithRedirect(),
  ]);

  const appointmentsData = (await formatAppointmentsData(appointments)).sort(
    ({ appointmentDate: dateA }, { appointmentDate: dateB }) =>
      new Date(dateB).getTime() - new Date(dateA).getTime(),
  );

  return (
    <Dashboard
      session={session}
      haircuts={haircuts}
      employees={employees}
      appointmentsData={appointmentsData}
    >
      <Navbar />
    </Dashboard>
  );
}
