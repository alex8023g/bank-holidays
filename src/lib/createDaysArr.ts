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
export async function createDaysArr({ year }: { year: number }) {
  const daysProto: Day[] = new Array(daysInYear(year)).fill({
    dateString: '',
    isHoliday: false,
    isWeekend: false,
  });

  const days = await Promise.allSettled(
    daysProto.map(async (_, i) => {
      // console.log('🚀 ~ createDaysArr ~ i:', i);
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

      return {
        dateString: dayDj.format(`YYYY-MM-DD`),
        isHoliday,
        isWeekend,
      };
    }),
  );

  return days;
}
