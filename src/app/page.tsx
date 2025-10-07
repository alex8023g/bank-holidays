import { CalendarsBlock2 } from '@/components/CalendarsBlock2';
import ResultBlock from '@/components/ResultBlock';

import { Day } from '@/lib/createDaysArr3';

import * as fs from 'fs';

export default async function HomePage() {
  let fileData = '';

  try {
    fileData = await fs.promises.readFile(
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

  return (
    <div className='flex flex-col overflow-y-hidden bg-gray-100 xl:flex-row'>
      <CalendarsBlock2 days={days} />
      <ResultBlock days={days} />
    </div>
  );
}
