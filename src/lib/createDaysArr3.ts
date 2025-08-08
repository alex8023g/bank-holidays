'use server';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/ru'; // Importing Russian locale for dayjs
import isLeapYear from 'dayjs/plugin/isLeapYear';
// @ts-expect-error isdayoff is not typed
import isdayoff from 'isdayoff';
import dayOfYear from 'dayjs/plugin/dayOfYear';
dayjs.locale('ru');
dayjs.extend(isoWeek);
dayjs.extend(dayOfYear);
export type Month = {
  monthNum: number;
  monthName: string;
  days: Day[];
};

export type Day = {
  dateString: string;
  isHoliday: boolean;
  isWeekend: boolean;
};

const ido = isdayoff();

function daysInYear(year: number) {
  return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
}
export async function createDaysArr3({ year }: { year: number }) {
  const daysProto: Day[] = new Array(daysInYear(year)).fill({
    dateString: '',
    isHoliday: false,
    isWeekend: false,
  });

  /*   ido
    .year({ year }) // @ts-expect-error isdayoff is not typed
    .then((res) => console.log(JSON.stringify(res))) // @ts-expect-error isdayoff is not typed
    .catch((err) => console.log(err.message)); */

  await fetch('https://isdayoff.ru/api/getdata?year=2025&month=06', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => {
      console.log('!!!', res);
      return res.json();
    })
    .then((res) => console.log('!!!', BigInt(res)));

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
        isWeekend = (await ido.date({
          month: dayDj.month(),
          date: dayDj.date(),
        }))
          ? true
          : false;
      } else {
        isHoliday = (await ido.date({
          month: dayDj.month(),
          date: dayDj.date(),
        }))
          ? true
          : false;
      }
    } catch (err) {
      console.log('🚀 ~ error ~ i:', i, err);
    }

    res.push({
      dateString: dayDj.format(`YYYY-MM-DD`),
      isHoliday,
      isWeekend,
    });

    i++;
  }
  return res;
}
