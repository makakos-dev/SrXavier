import { getAppoimentsWithRedirect } from '@/services/server-side/getAppointments';
import { formatAppointmentsData } from '@/helpers/formatAppointmentsData';
import { AppointmentsList } from '@/components/AppointmentsList';

export default async function Page() {
  const appointments = await getAppoimentsWithRedirect();
  const formattedAppointments = await formatAppointmentsData(appointments);
  return <AppointmentsList appointments={formattedAppointments} />;
}
