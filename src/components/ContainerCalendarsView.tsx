'use client';

import { CalendarYearClassic } from './CalendarYearClassic';
import { Day } from '@/lib/createDaysArr';
import { CalendarYearVertical3 } from './CalendarYearVertical3';
import { SharedPlansListByPersPlanId } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';

export function ContainerCalendarsView({
  days,
  sharedPlansList,
}: {
  days: Day[];
  sharedPlansList: SharedPlansListByPersPlanId[];
}) {
  const searchParamsString = useSearchParams().toString();

  return searchParamsString.includes('shared') ? (
    <CalendarYearVertical3 days={days} sharedPlansList={sharedPlansList} />
  ) : (
    <CalendarYearClassic days={days} sharedPlansList={sharedPlansList} />
  );
}
