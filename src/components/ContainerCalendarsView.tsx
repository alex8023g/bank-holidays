'use client';

import { useContext } from 'react';
import { ThemeContext } from './ContainerClientProviderVH';
import { CalendarYearClassic } from './CalendarYearClassic';
import { Day } from '@/lib/createDaysArr';
import { Session } from 'next-auth';
import { CalendarYearVertical } from './CalendarYearVertical';

export function ContainerCalendarsView({
  days,
  session,
}: {
  days: Day[];
  session: Session | null;
}) {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    return <div>no context, please reload page and try again</div>;
  }

  return ctx.calendarView === 'calendar' ? (
    <CalendarYearClassic days={days} session={session} />
  ) : (
    <CalendarYearVertical
      days={days}
      year={ctx.selectedYear}
      session={session}
    />
  );
}
