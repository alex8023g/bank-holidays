'use server';
import { createDaysArr } from './createDaysArr';
import { promises as fs } from 'fs';
import { createDaysArr2 } from './createDaysArr2';

export async function createCalendarJson({ year }: { year: number }) {
  createDaysArr2({ year }).then((res) => {
    console.log('🚀 ~ C2Page ~ res:', new Date(), res.length);
    fs.writeFile('src/constant/calendars2.json', JSON.stringify(res));
  });
}
