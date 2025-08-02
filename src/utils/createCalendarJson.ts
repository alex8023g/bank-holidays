import { createDaysArr } from './createDaysArr';
import { promises as fs } from 'fs';

export async function createCalendarJson({ year }: { year: number }) {
  createDaysArr({ year }).then((res) => {
    console.log('🚀 ~ C2Page ~ res:', new Date(), res);
    fs.writeFile('src/constant/calendars2.json', JSON.stringify(res));
  });
}
