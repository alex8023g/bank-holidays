import { CalendarsBlock2 } from '@/components/CalendarsBlock2';
import ResultBlock from '@/components/ResultBlock';
import { createCalendarJson } from '@/utils/createCalendarJson';
import { createDaysArr } from '@/utils/createDaysArr';
import { createYearCalendar } from '@/utils/createYearCalendar';
import dayjs from 'dayjs';
import { promises as fs } from 'fs';

export type Day = {
  dateString: string;
  isHoliday: boolean;
  isWeekend: boolean;
};

export default async function C2Page() {
  // createDaysArr({ year: 2025 }).then((res) => {
  //   console.log('🚀 ~ C2Page ~ res:', new Date(), res);
  //   fs.writeFile('src/constant/calendars2.json', JSON.stringify(res));
  // });

  const file = await fs.readFile(
    process.cwd() + '/src/constant/calendars2.json',
    'utf8',
  );
  const days: Day[] = JSON.parse(file);
  console.log('🚀 ~ C2Page ');

  return (
    <div className='/border-2 /border-blue-500 flex flex-col overflow-y-hidden xl:flex-row'>
      <CalendarsBlock2 days={days} />
      <ResultBlock />
    </div>
  );
}
