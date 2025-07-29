'use client';

import { Month } from '@/app/page';
import Header from './Header';
import CalendarsBlock from './CalendarsBlock';
import ResultBlock from './ResultBlock';

export default function ClientContainerVH({
  year,
  months,
}: {
  year: string;
  months: Month;
}) {
  return (
    <>
      <Header year={year} />
      <div className='flex flex-col overflow-scroll border-2 border-blue-500 xl:flex-row'>
        <CalendarsBlock months={months} />
        <ResultBlock />
      </div>
    </>
  );
}
