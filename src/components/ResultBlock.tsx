'use client';

import { useContext, useEffect, useRef } from 'react';
import { ThemeContext } from './ClientContainerVH';
import { TrashIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
// @ts-expect-error isdayoff is not typed
import isdayoff from 'isdayoff';
import { holidaysCount } from '@/lib/holidaysCount';
import { twJoin } from 'tailwind-merge';
import { useClickOutside } from '@react-hooks-library/core';
import { Day } from '@/lib/createDaysArr3';
import { TotalVacationDays } from './TotalVacationDays';

export default function ResultBlock({ days }: { days: Day[] }) {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return <div>no ctx</div>;
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
    <div className='/border-green-500 /border flex h-1/3 flex-col overflow-y-hidden px-2 md:mx-auto md:min-w-3xl xl:h-auto xl:w-1/3 xl:min-w-0'>
      <div className='sticky top-0 flex justify-between border-b border-gray-200 bg-white py-2'>
        <h2 className='/grow text-center font-semibold'>
          План на {ctx?.selectedYear} год
        </h2>
        {/* <div className='/xl:hidden'> */}
        <TotalVacationDays
          ranges={ctx.dateRanges}
          days={days}
          year={ctx.selectedYear}
        />
        {/* </div> */}
      </div>
      <div className='/border /border-amber-600 flex overflow-y-hidden xl:relative xl:block xl:h-full'>
        <ul
          role={'list'}
          className='/w-1/2 /border /border-violet-500 flex min-w-[400px] grow flex-col divide-y divide-gray-100 overflow-y-auto xl:w-auto'
        >
          {ctx?.dateRanges
            .filter((range) => range.year === ctx.selectedYear)
            .map((range) => {
              return (
                <li
                  key={range.start.dateStr}
                  className={twJoin(
                    '/rounded-md /border /shadow-sm mb-2 flex items-center border-gray-100 px-2 py-1',
                    /*         ctx.selectedRange &&
                      ctx.selectedRange?.start.dayOfYear ===
                        range.start.dayOfYear &&
                      'border-red-600 shadow-xs shadow-gray-300', */
                  )}
                  onClick={() => {
                    ctx.setSelectedRange(range);
                  }}
                >
                  <span>с:&nbsp;</span>
                  <span className='font-semibold'>
                    {dayjs(range.start.dateStr).format('DD.MM.YYYY')}
                  </span>
                  <span>&nbsp;по:&nbsp;</span>
                  <span className='font-semibold'>
                    {dayjs(range.end.dateStr).format('DD.MM.YYYY')}
                  </span>
                  <span>
                    &nbsp;{'('}
                    {range.end.dayOfYear -
                      range.start.dayOfYear +
                      1 -
                      holidaysCount({ range, days })}{' '}
                    к.д.{')'}
                  </span>

                  <button
                    className='ml-auto'
                    onClick={(e) => {
                      e.stopPropagation();
                      const newDateRanges = ctx.dateRanges.filter(
                        (r) => r.start != range.start,
                      );
                      ctx.setDateRanges(newDateRanges);
                      ctx.setSelectedRange(null);
                    }}
                  >
                    <TrashIcon className='size-5' />
                  </button>
                </li>
              );
            })}
        </ul>
        <div className='/sticky /bottom-0 /xl:block /border /border-blue-700 hidden bg-white p-3 text-center font-semibold xl:absolute xl:bottom-0 xl:flex'>
          {/* <div className='hidden xl:block'>
            <TotalVacationDays
              ranges={ctx.dateRanges}
              days={days}
              year={ctx.selectedYear}
            />
          </div> */}
          {/* <h2 className='mt-auto'>
            Итого:{' '}
            {ctx?.dateRanges
              .filter((range) => range.year === ctx.selectedYear)
              .reduce((acc, range) => {
                return (
                  acc +
                  (range.end.dayOfYear - range.start.dayOfYear + 1) -
                  holidaysCount({ range, days })
                );
              }, 0)}{' '}
            к.д.
          </h2> */}
        </div>
        {/*  {ctx?.hoverDayOfYear && ctx?.selectedDayOfYear ? (
          <h3>
            {ctx?.hoverDayOfYear -
              ctx?.selectedDayOfYear +
              1 -
              holidaysCount({
                range: {
                  start: { dayOfYear: ctx?.selectedDayOfYear },
                  end: { dayOfYear: ctx?.hoverDayOfYear },
                },
                days,
              })}
          </h3>
        ) : (
          <div></div>
        )} */}
      </div>
    </div>
  );
}
