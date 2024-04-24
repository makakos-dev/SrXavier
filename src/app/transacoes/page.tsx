import { Transactions } from '@/components/Transactions';
import { Navbar } from '@/components/Navbar';

export default async function Page() {
  return (
    <Transactions>
      <Navbar />
    </Transactions>
  );
}
