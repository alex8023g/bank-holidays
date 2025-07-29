import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/ru'; // Importing Russian locale for dayjs
import LayoutVH from '@/components/ClientContainerVH';
import Header from '@/components/Header';
import ResultBlock from '@/components/ResultBlock';
import CalendarsBlock from '@/components/CalendarsBlock';
import ClientContainerVH from '@/components/ClientContainerVH';
dayjs.locale('ru');
dayjs.extend(isoWeek);
// Importing dayjs with isoWeek plugin for week calculations
// Importing Russian locale for dayjs

export type Month = {
  monthNum: number;
  monthName: string;
  days: { monthDay: string | null; isSelected: boolean }[];
}[];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let year = await searchParams.then((res) => res.year);
  if (!year || typeof year !== 'string' || isNaN(Number(year))) {
    year = new Date().getFullYear().toString();
  }
  console.log('🚀 ~ P1Page ~ year:', year);
  const months: Month = new Array(12).fill(0).map((_, i) => {
    const month = (i + 1).toString().padStart(2, '0'); // Format month as two digits
    const monthName = dayjs(`${year}-${month}-01`).format('MMMM');
    const weekday = dayjs(`${year}-${month}-01`).isoWeekday();
    console.log('🚀 ~ weekday', weekday, monthName);

    return {
      monthNum: i,
      monthName,
      days: new Array(42)
        .fill({ monthDay: null, isSelected: false })
        .map((day, j) =>
          j < weekday - 1 ||
          j > weekday + dayjs(`${year}-${month}-01`).daysInMonth() - 2
            ? { ...day, monthDay: null }
            : { ...day, monthDay: (j - weekday + 2).toString() },
        ),
    };
  });

  return (
    // <div className='flex h-dvh flex-col border-2 border-red-500'>
    <ClientContainerVH year={year} months={months} />
    // </div>
  );
}
