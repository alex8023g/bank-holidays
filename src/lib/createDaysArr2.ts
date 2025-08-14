import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/ru'; // Importing Russian locale for dayjs
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
  dayOfYear: number;
  year: number;
  isHoliday: boolean;
  isWeekend: boolean;
};

const ido = isdayoff();

function daysInYear(year: number) {
  return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
}
export async function createDaysArr2({ year }: { year: number }) {
  console.log('🚀 ~ createDaysArr2 ~ start', year);
  const daysProto: Day[] = new Array(daysInYear(year)).fill({
    // const daysProto: Day[] = new Array(
    //   dayjs(`${year}-01-01`).isLeapYear() ? 366 : 365,
    // ).fill({
    dateString: '',
    isHoliday: false,
    isWeekend: false,
  });

  // ido
  //   .year({ year }) // @ts-expect-error isdayoff is not typed
  //   .then((res) => console.log(JSON.stringify(res))) // @ts-expect-error isdayoff is not typed
  //   .catch((err) => console.log(err.message));

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
      if (i < 30) {
        console.log('🚀 ~ createDaysArr2 ~ dayDj:', dayDj, {
          isStSu,
          dayNum,
          month: dayDj.month(),
          date: dayDj.date(),
        });
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
