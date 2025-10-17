import { CalendarYearVertical } from '@/components/CalendarYearVertical';
import { getDays } from '@/lib/actions';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ContainerMainAside } from '@/components/ContainerMainAside';
import { ContainerMain1 } from '@/components/ContainerMain1';
import { ContainerAside } from '@/components/ContainerAside';
import ContainerRangesUsers from '@/components/ContainerRangesUsers';

export default async function ColCalendar() {
  const days = await getDays();
  const year = new Date().getFullYear();
  const session = await getServerSession(authOptions);
  return (
    // <div className='flex flex-col overflow-y-hidden bg-gray-100 xl:flex-row'> //
    <ContainerMainAside>
      {/* <div className='h-2/3 overflow-y-scroll bg-gray-100 px-5 xl:h-full xl:flex-1'> */}
      <ContainerMain1>
        <CalendarYearVertical days={days} year={year} session={session} />
      </ContainerMain1>
      {/* </div> */}
      <ContainerAside>
        <ContainerRangesUsers days={days} />
      </ContainerAside>
    </ContainerMainAside>
    // </div> //
  );
}
