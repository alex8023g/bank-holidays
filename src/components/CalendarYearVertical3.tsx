'use client';

import { Day } from '@/lib/createDaysArr';
import { useContext } from 'react';
import { twJoin } from 'tailwind-merge';
import { ThemeContext } from './ContainerClientProviderVH';
import { DateRange } from './ContainerClientProviderVH';
import dayjs from 'dayjs';
import { Session } from 'next-auth';
import { onDateCellClick } from '@/lib/onDateCellClick';
import { HoverCountDays } from './HoverCountDays';
import { DeleteXCircleIcon } from './DeleteXCircle';
import { SharedPlansListByPersPlanId } from '@/lib/actions';
import { DeleteXCircle2 } from './DeleteXCircle2';

export function CalendarYearVertical3({
  days,
  year,
  session,
  sharedPlansList,
}: {
  days: Day[];
  year: number;
  session: Session | null;
  sharedPlansList: SharedPlansListByPersPlanId[];
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
        <thead className='sticky top-0 z-30 rounded-xl bg-white'>
          <tr className='bg-white'>
            <th
              rowSpan={2}
              className='/border-collapse sticky top-0 left-0 z-30 w-28 border-r border-gray-300 bg-white py-1'
            >
              Дата
            </th>
            {/* <th className='w-20 border'>Holiday</th> */}
            <th
              rowSpan={2}
              className='sticky top-0 left-28 z-20 w-32 bg-white px-5'
            >
              Мой&nbsp;план
            </th>
            {/* {ctx?.sharedRangesData?.personalRanges
              .filter(
                (range) => range.personalRanges.id !== ctx?.lsRangesData.id,
                )
                .map((range) => ( */}
            {/*             {ctx?.sharedRangesData?.personalRanges.map((range) => (
              <th
                key={range.personalRanges.id}
                className={twJoin(
                  'px-3',
                  ctx?.hiddenRangesIds.includes(range.personalRanges.id) &&
                    'hidden',
                )}
              >
                {range.personalRanges.userName || 'неизвестный пользователь'}
              </th>
            ))} */}
            {
              // sharedPlansListRes.ok ? (
              sharedPlansList
                .filter(
                  (sharedPlan) =>
                    !ctx?.hiddenSharedPlansIds.includes(
                      sharedPlan.sharedRanges.id,
                    ),
                )
                .map((sharedPlan) => (
                  <th
                    key={sharedPlan.sharedRanges.id}
                    colSpan={
                      sharedPlan.personalRangesList.length -
                      sharedPlan.personalRangesList.filter((personalRange) =>
                        ctx?.hiddenRangesIds.includes(
                          personalRange.personalRanges.id,
                        ),
                      ).length
                    }
                    className='border-collapse border border-gray-300 px-3 shadow'
                  >
                    {sharedPlan.sharedRanges.name}
                  </th>
                ))
              // ) : (
              //   <div>Error: {sharedPlansListRes.error.message}</div>
              // )
            }
          </tr>
          <tr>
            {
              // sharedPlansListRes.ok ? (
              sharedPlansList
                .filter(
                  (sharedPlan) =>
                    !ctx?.hiddenSharedPlansIds.includes(
                      sharedPlan.sharedRanges.id,
                    ),
                )
                .map((sharedPlan, i) => {
                  const personalRanges =
                    sharedPlan.personalRangesList; /* .filter(
                  (personalRange) =>
                    personalRange.personalRanges.id !== ctx?.personalRangesId,
                ) */
                  if (
                    personalRanges.length === 0 ||
                    personalRanges.length ===
                      personalRanges.filter((personalRange) =>
                        ctx?.hiddenRangesIds.includes(
                          personalRange.personalRanges.id,
                        ),
                      ).length
                  ) {
                    return (
                      <th key={'no users' + i} className='font-medium'>
                        нет участников
                      </th>
                    );
                  } else {
                    return personalRanges.map((personalRange) => (
                      <th
                        key={personalRange.personalRanges.id}
                        className={twJoin(
                          'border-collapse border border-gray-300 px-3 font-medium shadow',
                          ctx?.hiddenRangesIds.includes(
                            personalRange.personalRanges.id,
                          ) && 'hidden',
                        )}
                      >
                        {personalRange.personalRanges.userName}
                      </th>
                    ));
                  }
                })
              // ) : (
              //   <div>Error: {sharedPlansListRes.error.message}</div>
              // )
            }
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
                      <DeleteXCircle2
                        ctx={ctx}
                        day={day}
                        year={year}
                        session={session}
                        position='right'
                      />
                    )}
                </td>
                {/* {ctx?.sharedRangesData?.personalRanges.map((ranges) => ( */}
                {/* {ctx?.sharedRangesData?.personalRanges
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
                  ))} */}
                {
                  // sharedPlansListRes.ok ? (
                  sharedPlansList
                    .filter(
                      (sharedPlan) =>
                        !ctx?.hiddenSharedPlansIds.includes(
                          sharedPlan.sharedRanges.id,
                        ),
                    )
                    .map((sharedPlan, i) => {
                      const personalRanges =
                        sharedPlan.personalRangesList; /* .filter(
                      (personalRange) =>
                        personalRange.personalRanges.id !==
                        ctx?.personalRangesId,
                    ) */
                      if (
                        personalRanges.length === 0 ||
                        personalRanges.length ===
                          personalRanges.filter((personalRange) =>
                            ctx?.hiddenRangesIds.includes(
                              personalRange.personalRanges.id,
                            ),
                          ).length
                      ) {
                        return (
                          <td
                            key={'no users' + i}
                            className='border-collapse border border-gray-300 bg-gray-100'
                          ></td>
                        );
                      } else {
                        return personalRanges
                          .filter(
                            (personalRange) =>
                              !ctx?.hiddenRangesIds.includes(
                                personalRange.personalRanges.id,
                              ),
                          )
                          .map((personalRange) => (
                            <td
                              key={personalRange.personalRanges.id}
                              className={twJoin(
                                'border-collapse border border-gray-300 text-center',
                                JSON.parse(
                                  personalRange.personalRanges
                                    .rangesJson as string,
                                ).some(
                                  (d: DateRange) =>
                                    d.year === Number(year) &&
                                    d.start.dayOfYear <= day.dayOfYear &&
                                    d.end.dayOfYear >= day.dayOfYear,
                                )
                                  ? 'bg-blue-500'
                                  : 'bg-gray-100',
                              )}
                            >
                              {/* {personalRange.personalRanges.userName} */}
                            </td>
                          ));
                      }
                    })
                  // ) : (
                  //   <div>Error: {sharedPlansListRes.error.message}</div>
                  // )
                }
              </tr>
            ))}
        </tbody>
      </table>
      <HoverCountDays days={days} />
    </>
  );
}
