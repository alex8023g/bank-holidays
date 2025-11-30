'use server';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import 'dayjs/locale/de.js'; // Importing German locale for dayjs
import dayOfYear from 'dayjs/plugin/dayOfYear.js';
dayjs.locale('de');
dayjs.extend(isoWeek);
dayjs.extend(dayOfYear);
export type Month = {
  monthNum: number;
  monthName: string;
  days: Day[];
};

type DayProto = {
  dateString: string;
  isHoliday: boolean;
  isWeekend: boolean;
};

export type Day = {
  dateString: string;
  isHoliday: boolean;
  isWeekend: boolean;
  dayOfYear: number;
  year: number;
};

function daysInYear(year: number) {
  return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
}
export async function createDaysArr({ year }: { year: number }) {
  const daysProto: DayProto[] = new Array(daysInYear(year)).fill({
    dateString: '',
    isHoliday: false,
    isWeekend: false,
  });

  let dayOffMatrix: string[] = [];

  await fetch(`https://isdayoff.ru/api/getdata?year=${year}`)
    .then((res) => res.text())
    .then((res) => (dayOffMatrix = res.split('')));
  console.log('🚀 ~ createDaysArr3 ~ dayOffMatrix:', dayOffMatrix);

  let i = 0;
  const res = [];
  for (const item of daysProto) {
    const dayNum = i + 1;
    const dayDj = dayjs(`${year}-01-01`).dayOfYear(dayNum);

    let isWeekend = false;
    let isHoliday = false;
    const isStSu = [6, 7].includes(dayDj.isoWeekday());
    try {
      if (isStSu) {
        isWeekend = dayOffMatrix[i] === '1' ? true : false;
      } else {
        isHoliday = dayOffMatrix[i] === '1' ? true : false;
      }
    } catch (err) {
      console.log('🚀 ~ error ~ i:', i, err);
    }

    res.push({
      dateString: dayDj.format(`YYYY-MM-DD`),
      dayOfYear: i + 1,
      year,
      isHoliday,
      isWeekend,
    });

    i++;
  }
  return res;
}
