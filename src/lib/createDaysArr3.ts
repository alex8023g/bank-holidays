'use server';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import 'dayjs/locale/ru.js'; // Importing Russian locale for dayjs
// import isLeapYear from 'dayjs/plugin/isLeapYear';
// import isdayoff from 'isdayoff';
import dayOfYear from 'dayjs/plugin/dayOfYear.js';
dayjs.locale('ru');
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

// const ido = isdayoff();

function daysInYear(year: number) {
  return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
}
export async function createDaysArr3({ year }: { year: number }) {
  console.log('🚀 ~ createDaysArr3 ~ year:', year);
  const daysProto: DayProto[] = new Array(daysInYear(year)).fill({
    dateString: '',
    isHoliday: false,
    isWeekend: false,
  });

  /*   ido
    .year({ year }) // @ts-expect-error isdayoff is not typed
    .then((res) => console.log(JSON.stringify(res))) // @ts-expect-error isdayoff is not typed
    .catch((err) => console.log(err.message)); */

  // await fetch('https://isdayoff.ru/api/getdata?year=2025&month=06', {
  //   method: 'GET',
  //   headers: { 'Content-Type': 'application/json' },
  // })
  //   .then((res) => {
  //     console.log('!!!', res);
  //     return res.json();
  //   })
  //   .then((res) => console.log('!!!', BigInt(res)));

  // ido
  //   .year({ year })
  //   .then((res: number[]) => {
  //     console.log(JSON.stringify(res));
  //     dayOffMatrix = res;
  //   })
  //   .catch((err) => console.log(err.message));
  let dayOffMatrix: string[] = [];

  await fetch(`https://isdayoff.ru/api/getdata?year=${year}`)
    .then((res) => res.text())
    .then((res) => (dayOffMatrix = res.split('')));
  console.log('🚀 ~ createDaysArr3 ~ dayOffMatrix:', dayOffMatrix);

  // let dayOffMatrix: number[] = await ido.year({ year });

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
