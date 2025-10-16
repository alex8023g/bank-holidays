'use client';

import { Day } from '@/lib/createDaysArr';
import { useContext } from 'react';
import { twJoin } from 'tailwind-merge';
import { ThemeContext } from './ClientContainerVH';
import { DateRange } from './ClientContainerVH';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import {
  upsertPersonalRanges,
  upsertPersonalRangesNoUser,
} from '@/lib/actions';
import { dayInRanges } from '@/lib/dayInRanges';
import { Session } from 'next-auth';
import { onDateCellClick } from '@/lib/onDateCellClick';
import { HoverCountDays } from './HoverCountDays';
import { XCircleIcon } from '@heroicons/react/20/solid';
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
      <div>VerticalYear</div>
      <table className='border-collapse border border-gray-300'>
        <thead>
          <tr>
            <th className='/border w-30'>Дата</th>
            {/* <th className='w-20 border'>Holiday</th> */}
            <th className='/border w-20'>Мой план</th>
            {/* {ctx?.sharedRangesData?.personalRanges.map((range) => ( */}
            {ctx?.sharedRangesData?.personalRanges
              .filter(
                (range) => range.personalRanges.id !== ctx?.lsRangesData.id,
              )
              .map((range) => (
                <th key={range.id} className='/border w-20'>
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
                    'w-30 border-collapse border border-gray-300 text-center',
                    day.isWeekend && 'text-red-500',
                    day.isHoliday && 'font-bold text-red-500',
                  )}
                >
                  {dayjs(day.dateString).format('DD.MM.YYYY')}
                </td>
                <td
                  className={twJoin(
                    'relative w-20 cursor-pointer border border-gray-300',
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
                  {ctx.selectedRange?.start.dayOfYear === day.dayOfYear && (
                    <DeleteXCircleIcon
                      ctx={ctx}
                      day={day}
                      year={year}
                      session={session}
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
                        'w-20 border-collapse border border-gray-300',
                        JSON.parse(
                          ranges.personalRanges.rangesJson as string,
                        ).some(
                          (d: DateRange) =>
                            d.year === Number(year) &&
                            d.start.dayOfYear <= day.dayOfYear &&
                            d.end.dayOfYear >= day.dayOfYear,
                        ) && 'bg-blue-500',
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
