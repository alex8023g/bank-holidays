import { CalendarsBlock2 } from '@/components/CalendarsBlock2';
import ResultBlock from '@/components/ResultBlock';

import { Day } from '@/lib/createDaysArr3';

import { promises as fs } from 'fs';

export default async function C2Page() {
  // createDaysArr({ year: 2025 }).then((res) => {
  //   console.log('🚀 ~ C2Page ~ res:', new Date(), res);
  //   fs.writeFile('src/constant/calendars.json', JSON.stringify(res));
  // });

  let fileData = '';
  try {
    fileData = await fs.readFile(
      process.cwd() + '/src/constant/calendars.json',
      'utf8',
    );
  } catch (err) {
    console.error(err);
    return (
      <div>
        file /src/constant/calendars.json doesn`t exist, exec &quot;npm run
        createjsoncalendar&quot;
      </div>
    );
  }
  const days: Day[] = JSON.parse(fileData);
  // console.log('🚀 ~ C2Page ', days);

  return (
    <div className='flex flex-col overflow-y-hidden xl:flex-row'>
      <CalendarsBlock2 days={days} />
      <ResultBlock days={days} />
    </div>
  );
}
