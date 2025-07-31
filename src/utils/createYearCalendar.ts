import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

export type Month = {
  monthNum: number;
  monthName: string;
  days: { monthDay: string | null; isSelected: boolean; dateString: string }[];
};

export function createYearCalendar({ year }: { year: number }) {
  const months: Month[] = new Array(12).fill(0).map((_, i) => {
    const month = (i + 1).toString().padStart(2, '0'); // Format month as two digits
    const monthName = dayjs(`${year}-${month}-01`).format('MMMM');
    const weekday = dayjs(`${year}-${month}-01`).isoWeekday();
    // console.log('🚀 ~ weekday', weekday, monthName);

    return {
      monthNum: i,
      monthName,
      days: new Array(42)
        .fill({ monthDay: null, isSelected: false })
        .map((day, j) =>
          j < weekday - 1 ||
          j > weekday + dayjs(`${year}-${month}-01`).daysInMonth() - 2
            ? { ...day, monthDay: null }
            : {
                ...day,
                monthDay: (j - weekday + 2).toString(),
                dateString: `${year}-${month}-${(j - weekday + 2).toString().padStart(2, '0')}`,
              },
        ),
    };
  });

  return months;
}
