'use client';

import { useContext, useEffect, useRef } from 'react';
import { ThemeContext } from './ClientContainerVH';
import { TrashIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
// @ts-expect-error isdayoff is not typed
import isdayoff from 'isdayoff';
import { Day } from '@/app/page';
import { holidaysCount } from '@/lib/holidaysCount';
import { twJoin } from 'tailwind-merge';
import { useClickOutside } from '@react-hooks-library/core';

export default function ResultBlock({ days }: { days: Day[] }) {
  const ctx = useContext(ThemeContext);

  const ref1 = useRef(null);

  // useClickOutside(ref1, () => {
  //   ctx?.setSelectedRange(null);
  // });

  return (
    <div className='h-full overflow-y-auto border-2 border-green-500 px-2 xl:h-auto xl:w-1/3'>
      <h2 className='sticky top-0 bg-white'>План на {ctx?.selectedYear} год</h2>
      <ul ref={ref1} className=''>
        {ctx?.dateRanges
          .filter((range) => range.year === ctx.selectedYear)
          .map((range) => {
            return (
              <li
                key={range.start.dateStr}
                className={twJoin(
                  '/border mb-2 flex items-center rounded-md border border-gray-100 px-2 py-1 shadow-sm',
                  // Boolean(
                  ctx.selectedRange &&
                    ctx.selectedRange?.start.dayOfYear ===
                      range.start.dayOfYear &&
                    //       ,
                    // )
                    'border-red-600 shadow-xs shadow-gray-300',
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
                  дн.{')'}
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
      <h2 className='sticky bottom-0 bg-white'>
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
        дн.
      </h2>
      {ctx?.hoverDayOfYear && ctx?.selectedDayOfYear ? (
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
      )}
      {/* <h3>{ctx?.hoverDayOfYear}</h3>
      <h3>{ctx?.selectedDate?.start}</h3> */}
    </div>
  );
}
