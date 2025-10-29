'use client';

import { useContext, useMemo } from 'react';
import { ThemeContext } from './ContainerClientProviderVH';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { createYearCalendar } from '@/lib/createYearCalendar';
import { Day } from '@/lib/createDaysArr';
import { HoverCountDays } from './HoverCountDays';
import { CalendarMonth } from './CalendarMonth';
import { SharedPlansListByPersPlanId } from '@/lib/actions';

dayjs.locale('ru');
dayjs.extend(isoWeek);

export function CalendarYearClassic({
  days,

  sharedPlansList,
}: {
  days: Day[];
  sharedPlansList: SharedPlansListByPersPlanId[];
}) {
  const ctx = useContext(ThemeContext);
  const year = ctx?.selectedYear || 0;
  const monthsSt = useMemo(
    () => createYearCalendar({ year, days }),
    [year, days],
  );

  if (!ctx) {
    return <div>no context</div>;
  }

  return (
    // <div className='h-2/3 overflow-y-scroll bg-gray-100 xl:h-full xl:flex-1'>
    <div className='mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-8 px-4 py-16 sm:grid-cols-2 sm:px-6 xl:max-w-none xl:grid-cols-2 xl:px-8 2xl:grid-cols-3'>
      {monthsSt.map((_, i) => {
        return (
          <CalendarMonth
            key={i}
            i={i}
            month={monthsSt[i]}
            days={days}
            sharedPlansList={sharedPlansList}
          />
        );
      })}
      <HoverCountDays days={days} />
    </div>
    // </div>
  );
}
