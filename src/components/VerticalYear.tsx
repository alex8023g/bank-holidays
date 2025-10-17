'use client';

import { Day } from '@/lib/createDaysArr';
import { useContext } from 'react';
import { twJoin } from 'tailwind-merge';
import { ThemeContext } from './ContainerClientProviderVH';
import { DateRange } from './ContainerClientProviderVH';
import { JsonValue } from '@prisma/client/runtime/edge';

export function VerticalYear({
  days,
  year,
  personalRanges,
}: {
  days: Day[];
  year: number;
  personalRanges: ({
    user: {
      name: string | null;
      id: string;
      email: string | null;
      emailVerified: Date | null;
      image: string | null;
    } | null;
  } & {
    id: string;
    userId: string | null;
    rangesJson: JsonValue;
  })[];
}) {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    return <div>no context please reload page</div>;
  }

  return (
    <>
      <div>VerticalYear</div>
      <table>
        <thead>
          <tr>
            <th className='w-30 border'>Дата</th>
            {/* <th className='w-20 border'>Holiday</th> */}
            <th className='w-20 border'>Мой план</th>
            {personalRanges.map((range) => (
              <th key={range.id} className='w-20 border'>
                {range.user?.email || 'неавторизованный пользователь'}
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
                    'w-30 border text-center',
                    day.isWeekend && 'text-red-500',
                    day.isHoliday && 'font-bold text-red-500',
                  )}
                >
                  {day.dateString}
                </td>
                <td
                  className={twJoin(
                    'w-20 border',
                    ctx.dateRanges.some(
                      (d) =>
                        d.year === Number(year) &&
                        d.start.dayOfYear <= day.dayOfYear &&
                        d.end.dayOfYear >= day.dayOfYear,
                    ) && 'bg-blue-500',
                  )}
                ></td>
                {personalRanges.map((ranges) => (
                  <td
                    key={ranges.id}
                    className={twJoin(
                      'w-20 border',
                      JSON.parse(ranges.rangesJson as string).some(
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
    </>
  );
}
