import { getSession } from '@/helpers/getSession';
import { SideMenu } from './SideMenu';

export const NavigationMenu = async () => {
  const session = await getSession();
  return <SideMenu session={session} />;
};
