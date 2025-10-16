'use client';

import { Day } from '@/lib/createDaysArr';
import { useContext } from 'react';
import { twJoin } from 'tailwind-merge';
import { ThemeContext } from './ClientContainerVH';
import { DateRange } from './ClientContainerVH';
import dayjs from 'dayjs';
import { Session } from 'next-auth';
import { onDateCellClick } from '@/lib/onDateCellClick';
import { HoverCountDays } from './HoverCountDays';
import { DeleteXCircleIcon } from './DeleteXCircle';

export function VerticalYear2({
  days,
  year,
  session,
}: {
  days: Day[];
  year: number;
  session: Session | null;
}) {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    return <div>no context please reload page</div>;
  }

  return (
    <>
      <table
        id='vertical-year-table'
        className='border-collapse rounded-xl bg-white shadow-lg'
      >
        <thead className='rounded-xl bg-white shadow'>
          <tr className='sticky top-0 z-30 bg-white'>
            <th className='/border sticky top-0 left-0 z-30 w-28 bg-white py-1'>
              Дата
            </th>
            {/* <th className='w-20 border'>Holiday</th> */}
            <th className='sticky top-0 left-28 z-20 w-32 bg-white px-5'>
              Мой&nbsp;план
            </th>
            {/* {ctx?.sharedRangesData?.personalRanges
              .filter(
                (range) => range.personalRanges.id !== ctx?.lsRangesData.id,
                )
                .map((range) => ( */}
            {ctx?.sharedRangesData?.personalRanges.map((range) => (
              <th
                key={range.id}
                className={twJoin(
                  'px-3',
                  (range.personalRanges.id === ctx?.lsRangesData.id ||
                    ctx?.hiddenRangesIds.includes(range.id)) &&
                    'hidden',
                )}
              >
                {range.personalRanges.userName || 'неизвестный пользователь'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days
            .filter((day) => day.year === Number(year))
            .map((day) => (
              <tr key={day.dateString} className=''>
                <td
                  className={twJoin(
                    'sticky left-0 z-20 w-28 border-collapse border border-gray-300 bg-white px-3 text-center',
                    day.isWeekend && 'text-red-500',
                    day.isHoliday && 'font-bold text-red-500',
                  )}
                >
                  {dayjs(day.dateString).format('DD.MM.YYYY')}
                </td>
                <td
                  className={twJoin(
                    'sticky left-28 z-10 w-32 cursor-pointer border border-gray-300 bg-white',
                    ctx.dateRanges.some(
                      (d) =>
                        d.year === Number(year) &&
                        d.start.dayOfYear <= day.dayOfYear &&
                        d.end.dayOfYear >= day.dayOfYear,
                    ) && 'bg-blue-500',
                  )}
                  style={{
                    backgroundColor: ctx.dateRanges.some(
                      (d) =>
                        day?.dayOfYear &&
                        d.year === year &&
                        d.start.dayOfYear <= day?.dayOfYear &&
                        d.end.dayOfYear >= day.dayOfYear,
                    )
                      ? '#51a2ff'
                      : '',
                    color: day?.isWeekend ? 'red' : day?.isHoliday ? 'red' : '',
                    outline:
                      ctx.selectedDayOfYear &&
                      ctx.hoverDayOfYear &&
                      day.dayOfYear
                        ? ctx.selectedDayOfYear <= day.dayOfYear &&
                          day.dayOfYear <= ctx.hoverDayOfYear
                          ? '1px solid red'
                          : ''
                        : ctx.selectedRange
                          ? ctx.selectedRange.start.dayOfYear <=
                              day.dayOfYear &&
                            day.dayOfYear <= ctx.selectedRange.end.dayOfYear
                            ? '1px solid red'
                            : ''
                          : '',
                    outlineOffset: '-1px',
                  }}
                  onClick={() => {
                    onDateCellClick({ ctx, day, year, session, days });
                  }}
                  onMouseEnter={() => {
                    // if (ctx.selectedDayOfYear) {
                    ctx.setHoverDayOfYear(day.dayOfYear);
                    // }
                  }}
                >
                  {ctx.selectedRange?.start.dayOfYear === day.dayOfYear &&
                    ctx.selectedRange?.year === year && (
                      <DeleteXCircleIcon
                        ctx={ctx}
                        day={day}
                        year={year}
                        session={session}
                        position='right'
                      />
                    )}
                </td>
                {/* {ctx?.sharedRangesData?.personalRanges.map((ranges) => ( */}
                {ctx?.sharedRangesData?.personalRanges
                  .filter(
                    (ranges) =>
                      ranges.personalRanges.id !== ctx?.lsRangesData.id,
                  )
                  .map((ranges) => (
                    <td
                      key={ranges.personalRanges.id}
                      className={twJoin(
                        'border-collapse border border-gray-300',
                        JSON.parse(
                          ranges.personalRanges.rangesJson as string,
                        ).some(
                          (d: DateRange) =>
                            d.year === Number(year) &&
                            d.start.dayOfYear <= day.dayOfYear &&
                            d.end.dayOfYear >= day.dayOfYear,
                        )
                          ? 'bg-blue-500'
                          : 'bg-gray-100',
                      )}
                    ></td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
      <HoverCountDays days={days} />
    </>
  );
}
