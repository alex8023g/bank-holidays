'use client';

import { useContext } from 'react';
import { ThemeContext } from './ContainerClientProviderVH';
import { CalendarYearClassic } from './CalendarYearClassic';
import { Day } from '@/lib/createDaysArr';
import { CalendarYearVertical3 } from './CalendarYearVertical3';
import { SharedPlansListByPersPlanId } from '@/lib/actions';
import { HeaderContext } from './Header2';

export function ContainerCalendarsView({
  days,
  sharedPlansList,
}: {
  days: Day[];
  sharedPlansList: SharedPlansListByPersPlanId[];
}) {
  const ctx = useContext(HeaderContext);

  if (!ctx) {
    return <div>no context, please reload page and try again</div>;
  }

  return ctx.calendarView === 'calendar' ? (
    <CalendarYearClassic days={days} sharedPlansList={sharedPlansList} />
  ) : (
    <CalendarYearVertical3
      days={days}
      // year={ctx.selectedYear}
      sharedPlansList={sharedPlansList}
    />
  );
}
