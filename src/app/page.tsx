import { CalendarsBlock2 } from '@/components/CalendarsBlock2';
import ResultBlock from '@/components/ResultBlock';
import { createCalendarsJson } from '@/lib/createCalendarJson3';

import { Day } from '@/lib/createDaysArr3';

import * as fs from 'fs';

export default async function HomePage() {
  // createDaysArr({ year: 2025 }).then((res) => {
  //   console.log('🚀 ~ C2Page ~ res:', new Date(), res);
  //   fs.writeFile('src/constant/calendars.json', JSON.stringify(res));
  // });

  let fileData = '';
  console.log('🚀 ~ C2Page ~ process.cwd():', process.cwd());
  const existsCalendarsJson = fs.existsSync('/src/constant/calendars.json')
  console.log({ existsCalendarsJson });

  if (existsCalendarsJson) {
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
  } else {
    await createCalendarsJson();
    try {
      fileData = await fs.promises.readFile(
        process.cwd() + '/src/constant/calendars.json',
        'utf8',
      );
      console.log(fileData)
    } catch (err) {
      console.error(err);
      return (
        <div>
          file /src/constant/calendars.json doesn`t exist, exec &quot;npm run
          createjsoncalendar&quot;
        </div>
      );
    }
  };
  
  await new Promise((resolve)=>setTimeout(resolve, 3000));
  const days: Day[] = JSON.parse(fileData);
  // console.log('🚀 ~ C2Page ', days);

  return (
    <div className='flex flex-col overflow-y-hidden bg-gray-100 xl:flex-row'>
      <CalendarsBlock2 days={days} />
      <ResultBlock days={days} />
    </div>
  );
}
