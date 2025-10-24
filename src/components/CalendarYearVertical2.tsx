'use client';

import { Day } from '@/lib/createDaysArr';
import { twJoin } from 'tailwind-merge';
import { DateRange } from './ContainerClientProviderVH';
import dayjs from 'dayjs';
import { HoverCountDays } from './HoverCountDays';
import { SharedWithPersonalRangesRes } from '@/lib/actions';

export function CalendarYearVertical2({
  days,
  year,
  sharedRangesData,
}: {
  days: Day[];
  year: number;
  sharedRangesData: SharedWithPersonalRangesRes;
}) {
  if (!sharedRangesData) {
    return <div>нет общего графика отпусков</div>;
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
            {/* <th className='sticky top-0 left-28 z-20 w-32 bg-white px-5'>
              Мой&nbsp;план
            </th> */}

            {sharedRangesData.personalRanges.map((range) => (
              <th
                key={range.personalRangesId}
                className={twJoin(
                  'px-3',
                  // (range.personalRanges.id === ctx?.lsRangesData.id ||
                  //   ctx?.hiddenRangesIds.includes(range.id)) &&
                  //   'hidden',
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

                {sharedRangesData?.personalRanges.map((ranges) => (
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
