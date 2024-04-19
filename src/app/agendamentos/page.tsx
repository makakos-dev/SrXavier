import { getAppoimentsWithRedirect } from '@/services/server-side/getAppointments';
import { getAccountTypeAppointments } from '@/helpers/getAccountTypeAppointments';
import { formatAppointmentsData } from '@/helpers/formatAppointmentsData';
import { Appointments } from '@/components/Appointments';
import { getSession } from '@/helpers/getSession';
import { Navbar } from '@/components/Navbar';

export default async function Page() {
  const [session, appointments] = await Promise.all([getSession(), getAppoimentsWithRedirect()]);
  const filteredAppointments = getAccountTypeAppointments(session, appointments);
  const appointmentsData = await formatAppointmentsData(filteredAppointments);

  return (
    <Appointments session={session} appointmentsData={appointmentsData}>
      <Navbar />
    </Appointments>
  );
}
