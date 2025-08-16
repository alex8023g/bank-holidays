import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/ru'; // Importing Russian locale for dayjs

dayjs.locale('ru');
dayjs.extend(isoWeek);

export type Month = {
  monthNum: number;
  monthName: string;
  days: {
    monthDay: string;
    dayOfYear: number;
    dateString: string;
    isHoliday: boolean;
    isWeekend: boolean;
    isSelected: boolean;
  }[];
};

export type DayFromJson = {
  dateString: string;
  isHoliday: boolean;
  isWeekend: boolean;
  dayOfYear: number;
};

export function createYearCalendar2({
  year,
  days,
}: {
  year: number;
  days: DayFromJson[];
}) {
  console.log('🚀 ~ createYearCalendar2 ');
  const months: Month[] = new Array(12).fill(0).map((_, i) => {
    const month = (i + 1).toString().padStart(2, '0'); // Format month as two digits
    const monthName = dayjs(`${year}-${month}-01`).format('MMMM');
    const weekday = dayjs(`${year}-${month}-01`).isoWeekday();
    // console.log('🚀 ~ weekday', weekday, monthName);

    return {
      monthNum: i,
      monthName,
      days: new Array(42)
        .fill({
          monthDay: null,
          dayOfYear: null,
          dateString: '',
          isSelected: false,
          isHoliday: false,
          isWeekend: false,
        })
        .map((day, j) =>
          j < weekday - 1 ||
          j > weekday + dayjs(`${year}-${month}-01`).daysInMonth() - 2
            ? { ...day, monthDay: null }
            : {
                ...day,
                ...days.find(
                  (item) =>
                    dayjs(item.dateString).year() === year &&
                    dayjs(item.dateString).month() === i &&
                    dayjs(item.dateString).date() === j - weekday + 2,
                ),
              },
        ),
    };
  });

  // console.log('🚀 ~ createYearCalendar2 ~ months:', months);
  return months;
}
