'use client';

import { useContext } from 'react';
import { ThemeContext } from './ContainerClientProviderVH';
import { CalendarYearClassic } from './CalendarYearClassic';
import { Day } from '@/lib/createDaysArr';
import { Session } from 'next-auth';
import { CalendarYearVertical3 } from './CalendarYearVertical3';
import { SharedPlansListByPersPlanId } from '@/lib/actions';

export function ContainerCalendarsView({
  days,
  session,
  sharedPlansList,
}: {
  days: Day[];
  session: Session | null;
  sharedPlansList: SharedPlansListByPersPlanId[];
}) {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    return <div>no context, please reload page and try again</div>;
  }

  return ctx.calendarView === 'calendar' ? (
    <CalendarYearClassic
      days={days}
      session={session}
      sharedPlansList={sharedPlansList}
    />
  ) : (
    <CalendarYearVertical3
      days={days}
      year={ctx.selectedYear}
      session={session}
      sharedPlansList={sharedPlansList}
    />
  );
}
