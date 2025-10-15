'use client';

import { useContext } from 'react';
import { ThemeContext } from './ClientContainerVH';
import dayjs from 'dayjs';
import { holidaysCount } from '@/lib/holidaysCount';
import { twJoin } from 'tailwind-merge';
import { Day } from '@/lib/createDaysArr';
import { TotalVacationDays } from './TotalVacationDays';
import { PeriodItemMenu } from './PeriodItemMenu';
import { PlanResultMenu } from './PlanResultMenu';
import { useSearchParams } from 'next/navigation';
import { LoginBtnsGroup } from './LoginBtnsGroup';

export default function ResultBlock({ days }: { days: Day[] }) {
  const searchParams = useSearchParams();
  const isLogin = searchParams.has('login');
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    return <div>no ctx перезагрузите страницу</div>;
  }

  if (isLogin) {
    return (
      <div className='flex h-1/2 flex-col overflow-y-hidden rounded-lg bg-white px-2 shadow-[0_0_20px_rgba(0,0,0,0.2)] md:z-0 md:mx-auto md:min-w-3xl xl:h-auto xl:w-1/3 xl:min-w-0'>
        <LoginBtnsGroup />
      </div>
    );
  }

  const weekends = days.filter(
    (day) => day.year === ctx?.selectedYear && day.isWeekend === true,
  );

  if (!weekends.length) {
    return (
      <div className='flex h-full overflow-y-auto px-2 xl:h-auto xl:w-1/3'>
        <h2 className='m-auto text-center font-semibold'>
          Производственный календарь на {ctx?.selectedYear} еще не принят
        </h2>
      </div>
    );
  }

  return (
    <div className='/z-10 flex h-1/3 flex-col overflow-y-hidden rounded-lg bg-white px-2 shadow-[0_0_20px_rgba(0,0,0,0.2)] md:z-0 md:mx-auto md:min-w-3xl xl:h-auto xl:w-1/3 xl:min-w-0'>
      <div className='/border-b /border-gray-200 sticky top-0 flex justify-between bg-white px-2 py-2'>
        <h2 className='/grow text-center font-semibold'>
          План на {ctx?.selectedYear} год
        </h2>
        <div className='flex'>
          <TotalVacationDays
            ranges={ctx.dateRanges}
            days={days}
            year={ctx.selectedYear}
          />
          <PlanResultMenu
            dateRanges={ctx.dateRanges.filter(
              (range) => range.year === ctx.selectedYear,
            )}
            days={days}
          />
        </div>
      </div>
      <div className='/border /border-amber-600 flex overflow-y-hidden xl:relative xl:block xl:h-full'>
        <ul
          // role={'list'}
          className='/w-1/2 /border /border-violet-500 /divide-gray-100 /divide-y /min-w-[400px] flex grow flex-col overflow-y-auto py-0.5 xl:w-auto'
        >
          {ctx?.dateRanges
            .filter((range) => range.year === ctx.selectedYear)
            .map((range) => {
              return (
                <li
                  key={range.start.dateStr + range.year}
                  className={twJoin(
                    '/rounded-md /shadow-sm /mb-2 /items-start mx-1 mb-2 flex rounded-lg border border-gray-100 bg-gray-100 py-2 pr-1 pl-3 shadow-sm',
                    ctx.selectedRange &&
                      ctx.selectedRange?.start.dayOfYear ===
                        range.start.dayOfYear &&
                      '/outline-red-600 /outline /shadow border-red-200 shadow-red-200',
                  )}
                  onClick={() => {
                    if (
                      ctx.selectedRange &&
                      ctx.selectedRange.start.dateStr === range.start.dateStr
                    ) {
                      ctx.setSelectedRange(null);
                    } else {
                      ctx.setSelectedRange(range);
                    }
                  }}
                >
                  <span>с&nbsp;</span>
                  <span className='font-semibold'>
                    {dayjs(range.start.dateStr).format('DD.MM.YYYY')}
                  </span>
                  <span>&nbsp;по&nbsp;</span>
                  <span className='font-semibold'>
                    {dayjs(range.end.dateStr).format('DD.MM.YYYY')}
                  </span>
                  <span className='ml-auto'>
                    {/* &nbsp;{'('} */}
                    {range.end.dayOfYear -
                      range.start.dayOfYear +
                      1 -
                      holidaysCount({ range, days })}{' '}
                    к.д. {/* {')'} */}
                  </span>
                  <PeriodItemMenu
                    anchor='left start'
                    range={range}
                    days={days}
                  />
                </li>
              );
            })}
          {!ctx?.dateRanges.some(
            (range) => range.year === ctx.selectedYear,
          ) && (
            <li className='m-auto'>Выберите периоды отпусков на календаре</li>
          )}
        </ul>
      </div>
      <h2 className='text-center font-semibold'>Все участники:</h2>
      <ul>
        {ctx?.sharedRangesData?.personalRanges.map((personalRange) => (
          <li key={personalRange.id}>
            {personalRange.personalRanges.userName}
          </li>
        ))}
        {ctx?.sharedRangesData?.personalRanges.length === 0 && (
          <li>Никто не делится этим графиком отпусков</li>
        )}
      </ul>
    </div>
  );
}
