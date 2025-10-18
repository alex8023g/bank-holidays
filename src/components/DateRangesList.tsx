'use client';

import { useContext } from 'react';
import { ThemeContext } from './ContainerClientProviderVH';
import dayjs from 'dayjs';
import { holidaysCount } from '@/lib/holidaysCount';
import { twJoin } from 'tailwind-merge';
import { Day } from '@/lib/createDaysArr';
import { TotalVacationDays } from './TotalVacationDays';
import { PeriodItemMenu } from './PeriodItemMenu';
import { PlanResultMenu } from './PlanResultMenu';
import { useSearchParams } from 'next/navigation';
import { LoginBtnsGroup } from './LoginBtnsGroup';
import { RangesUsersBtn } from './ContainerRangesUsers';

export function DateRangesList({
  days,
  activeBtn,
}: {
  days: Day[];
  activeBtn: RangesUsersBtn;
}) {
  const searchParams = useSearchParams();
  const ctx = useContext(ThemeContext);
  const isLogin = searchParams.has('login');

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
    <div
      className={twJoin(
        '/border-gray-400 /md:border h-full w-full flex-col overflow-y-hidden md:flex md:w-1/2 md:rounded-lg xl:h-1/2 xl:w-full',
        activeBtn === 'total' ? 'flex' : 'hidden',
      )}
    >
      <div
        className={twJoin(
          'sticky top-0 z-20 flex h-full flex-col justify-between bg-white px-2 py-2 shadow-sm md:h-auto md:flex-row',
          activeBtn !== 'total' && 'hidden',
        )}
      >
        <h2 className='text-center font-semibold'>
          План на {ctx?.selectedYear} год
        </h2>
        <div className='my-auto flex justify-between'>
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
      <div className='/border-2 /border-green-600 hidden h-full flex-col overflow-y-hidden md:flex xl:relative xl:flex xl:h-full'>
        <ul
          // role={'list'}
          className='/w-1/2 /border /border-violet-500 /divide-gray-100 /divide-y /min-w-[400px] flex grow flex-col overflow-y-scroll pt-0.5 xl:w-auto'
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
                      ctx.setClickPlace('resultBlock');
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
    </div>
  );
}
