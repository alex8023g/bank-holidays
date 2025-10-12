import { CalendarsBlock } from '@/components/CalendarsBlock';
import { SharedPlansBlock } from '@/components/SharedPlansBlock';
import { Day } from '@/lib/createDaysArr';

import * as fs from 'fs';

let fileData = '';

try {
  fileData = await fs.promises.readFile(
    process.cwd() + '/src/constant/calendars.json',
    'utf8',
  );
} catch (err) {
  console.error(err);
}

const days: Day[] = JSON.parse(fileData);

export default async function SharedPage() {
  return (
    <div className='flex flex-col overflow-y-hidden bg-gray-100 xl:flex-row'>
      <CalendarsBlock days={days} />
      <SharedPlansBlock />
    </div>
  );
}
