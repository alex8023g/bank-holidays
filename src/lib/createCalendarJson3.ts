'use server';
import { createDaysArr } from './createDaysArr';
import { promises as fs } from 'fs';
import { createDaysArr2 } from './createDaysArr2';
import { createDaysArr3 } from './createDaysArr3';

export async function createCalendarJson({ year }: { year: number }) {
  // createDaysArr2({ year }).then((res) => {
  //   console.log('🚀 ~ C2Page ~ res:', new Date(), res.length);
  //   fs.writeFile('src/constant/calendars2.json', JSON.stringify(res));
  // });

  try {
    const daysJson = await fs.readFile('src/constant/calendars2.json', 'utf-8');
    console.log('🚀 ~ createCalendarJson ~ start');
    const days = JSON.parse(daysJson);
    // console.log('🚀 ~ createCalendarJson ~ days:', days);
    const days2 = await createDaysArr3({ year });
    // console.log('🚀 ~ createCalendarJson ~ days2:', days2);
    if (days) {
      fs.writeFile(
        'src/constant/calendars2.json',
        JSON.stringify(days.concat(days2)),
      );
    } else {
      fs.writeFile('src/constant/calendars2.json', JSON.stringify(days2));
    }
  } catch (err) {}
}
