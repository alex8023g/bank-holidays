'use server';
import { promises as fs } from 'fs';
import { createDaysArr3 } from './createDaysArr3.ts';
import dayjs from 'dayjs';

export async function createCalendarJson({ year }: { year: number }) {
  // createDaysArr2({ year }).then((res) => {
  //   console.log('🚀 ~ C2Page ~ res:', new Date(), res.length);
  //   fs.writeFile('src/constant/calendars.json', JSON.stringify(res));
  // });

  try {
    const daysJson = await fs.readFile('src/constant/calendars.json', 'utf-8');
    console.log('🚀 ~ createCalendarJson ~ start');
    const days = JSON.parse(daysJson);
    // console.log('🚀 ~ createCalendarJson ~ days:', days);
    const days2 = await createDaysArr3({ year });
    // console.log('🚀 ~ createCalendarJson ~ days2:', days2);
    if (days) {
      fs.writeFile(
        'src/constant/calendars.json',
        JSON.stringify(days.concat(days2)),
      );
    } else {
      console.log('🚀 ~ createCalendarJson ~ else');
      fs.writeFile('src/constant/calendars.json', JSON.stringify(days2));
    }
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes('ENOENT: no such file or directory')
    ) {
      try {
        console.log('🚀 ~ createCalendarJson ~ else');
        const days = await createDaysArr3({ year });
        fs.writeFile('src/constant/calendars.json', JSON.stringify(days));
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log(err);
    }
  }
}

const years = new Array(dayjs().year() - 2022 + 1)
  .fill(null)
  .map((_, i) => ({ year: 2023 + i }));

for (const item of years) {
  await createCalendarJson(item);
}
