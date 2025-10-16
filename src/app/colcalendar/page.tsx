import ResultBlock from '@/components/ResultBlock';
import { VerticalYear2 } from '@/components/VerticalYear2';
import { getDays } from '@/lib/actions';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export default async function ColCalendar() {
  const days = await getDays();
  const year = new Date().getFullYear();
  const session = await getServerSession(authOptions);
  return (
    <div className='flex flex-col overflow-y-hidden bg-gray-100 xl:flex-row'>
      <div className='/border-2 /border-orange-500 h-2/3 overflow-y-scroll bg-gray-100 px-5 xl:h-full xl:flex-1'>
        <VerticalYear2 days={days} year={year} session={session} />
      </div>
      <ResultBlock days={days} />
    </div>
  );
}
