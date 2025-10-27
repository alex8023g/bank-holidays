import { CalendarMonth } from '@/components/CalendarMonth';
import { ContainerAside } from '@/components/ContainerAside';
import { ContainerMain1 } from '@/components/ContainerMain1';
import { ContainerMainAside } from '@/components/ContainerMainAside';
import { getDays } from '@/lib/actions';
import { createYearCalendar } from '@/lib/createYearCalendar';

export default async function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  const days = await getDays();
  const year = new Date().getFullYear();
  const monthsSt = createYearCalendar({ year, days });
  return (
    <ContainerMainAside>
      <ContainerMain1>
        <div className='mx-auto grid h-dvh max-w-3xl grow grid-cols-1 gap-x-8 gap-y-8 px-4 py-16 sm:grid-cols-2 sm:px-6 xl:max-w-none xl:grid-cols-2 xl:px-8 2xl:grid-cols-3'>
          {/* {monthsSt.map((_, i) => {
            return (
              <CalendarMonth
                key={i}
                i={i}
                month={monthsSt[i]}
                days={days}
                sharedPlansList={[]}
              />
            );
          })} */}
        </div>
      </ContainerMain1>
      <ContainerAside>
        <div className='h-full'></div>
      </ContainerAside>
    </ContainerMainAside>
  );
}
