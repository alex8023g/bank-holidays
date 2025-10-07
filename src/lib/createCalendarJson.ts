'use server';
import * as fs from 'fs';
import { createDaysArr3 } from './createDaysArr3.ts';
import dayjs from 'dayjs';

export async function createYearCalendarJson({ year }: { year: number }) {
  try {
    const daysJson = fs.readFileSync('src/constant/calendars.json', 'utf-8');
    console.log('🚀 ~ createCalendarJson ~ start');
    const days = JSON.parse(daysJson);
    const days2 = await createDaysArr3({ year });
    if (days) {
      fs.writeFileSync(
        'src/constant/calendars.json',
        JSON.stringify(days.concat(days2)),
      );
    } else {
      console.log('🚀 ~ createCalendarJson ~ else');
      fs.writeFileSync('src/constant/calendars.json', JSON.stringify(days2));
    }
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes('ENOENT: no such file or directory')
    ) {
      try {
        console.log('🚀 ~ createCalendarJson ~ else');
        const days = await createDaysArr3({ year });
        fs.writeFileSync('src/constant/calendars.json', JSON.stringify(days));
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log(err);
    }
  }
}

export async function createCalendarsJson() {
  const years = new Array(dayjs().year() - 2021)
    .fill(null)
    .map((_, i) => ({ year: 2023 + i }));
  for (const item of years) {
    await createYearCalendarJson(item);
  }
}

const existsCalendarsJson = fs.existsSync('src/constant/calendars.json');
if (!existsCalendarsJson) {
  createCalendarsJson();
} else {
  console.log('🚀 ~ calendars.json already exists');
}
