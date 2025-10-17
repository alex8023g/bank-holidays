'use client';
import { useContext, useEffect, useRef } from 'react';
import { DateRange, ThemeContext } from './ContainerClientProviderVH';
import dayjs from 'dayjs';
import { Month } from '@/lib/createYearCalendar';
import { Day } from '@/lib/createDaysArr';
import { twJoin } from 'tailwind-merge';
import { Session } from 'next-auth';
import { onDateCellClick } from '@/lib/onDateCellClick';
import { DeleteXCircleIcon } from './DeleteXCircle';

export function MonthCalendar({
  i,
  month,
  days,
  // isActive,
  session,
}: {
  i: number;
  month: Month;
  days: Day[];
  // isActive: boolean;
  session: Session | null;
}) {
  const ctx = useContext(ThemeContext);
  // const activeEl = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (isActive && ctx?.clickPlace === 'resultBlock') {
  //     activeEl.current?.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start',
  //     });
  //   }
  // }, [isActive, ctx?.clickPlace]);

  if (!ctx) {
    return <div>no context</div>;
  }
  const year = ctx.selectedYear;

  return (
    <section
      key={i}
      // ref={activeEl}
      // className={twJoin('text-center', `${isActive ? 'active' : ''}`)}
      className={twJoin('text-center')}
    >
      <h2 className='mb-2 text-sm font-semibold text-gray-900'>
        {dayjs().year(year).month(i).format('MMMM')}
      </h2>
      <div className='grid grid-cols-7 text-xs/6 text-gray-500'>
        <div>ПН</div>
        <div>ВТ</div>
        <div>СР</div>
        <div>ЧТ</div>
        <div>ПТ</div>
        <div>СБ</div>
        <div>ВС</div>
      </div>
      <div className='isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200'>
        {month.days.map((day, di) =>
          day.dateString ? (
            <button
              key={di}
              type='button'
              // data-is-today={day.isToday ? '' : undefined}
              // data-is-current-month={day ? '' : undefined}
              className={`relative bg-white py-1.5 text-gray-900 first:rounded-tl-lg last:rounded-br-lg hover:bg-gray-100 focus:z-10 nth-36:rounded-bl-lg nth-7:rounded-tr-lg ${day?.isHoliday ? 'font-bold' : ''}`}
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
                  ctx.selectedDayOfYear && ctx.hoverDayOfYear && day.dayOfYear
                    ? ctx.selectedDayOfYear <= day.dayOfYear &&
                      day.dayOfYear <= ctx.hoverDayOfYear
                      ? '1px solid red'
                      : ''
                    : ctx.selectedRange
                      ? ctx.selectedRange.start.dayOfYear <= day.dayOfYear &&
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
              <time
                dateTime={day.monthDay || ''}
                className='mx-auto flex size-7 items-center justify-center rounded-full in-data-is-today:bg-indigo-600 in-data-is-today:font-semibold in-data-is-today:text-white'
              >
                {dayjs(day?.dateString)?.format('D')}
              </time>
              {/* {day?.dateString} */}
              {ctx.selectedRange?.start.dayOfYear === day.dayOfYear && (
                <DeleteXCircleIcon
                  ctx={ctx}
                  day={day}
                  year={year}
                  session={session}
                  position='left'
                />
              )}
              {ctx.sharedRangesData?.personalRanges.some((personalRange) => {
                return JSON.parse(
                  (personalRange.personalRanges.rangesJson as string) || '[]',
                ).some(
                  (range: DateRange) =>
                    range.year === year &&
                    range.start.dayOfYear <= day.dayOfYear &&
                    range.end.dayOfYear >= day.dayOfYear &&
                    personalRange.personalRanges.id !== ctx.lsRangesData.id &&
                    !ctx.hiddenRangesIds.includes(personalRange.id),
                );
              }) && (
                <div className='absolute bottom-1 z-20 flex h-3 w-full font-bold text-red-500'>
                  <span className='mx-auto w-5 border-b-2 border-red-600'></span>
                </div>
              )}
            </button>
          ) : (
            <button
              key={di}
              type='button'
              // data-is-today={day.isToday ? '' : undefined}
              data-is-current-month={day.dayOfYear ? '' : undefined}
              className='/hover:bg-gray-100 bg-gray-50 py-1.5 text-gray-400 first:rounded-tl-lg last:rounded-br-lg focus:z-10 data-is-current-month:bg-white data-is-current-month:text-gray-900 data-is-current-month:hover:bg-gray-100 nth-36:rounded-bl-lg nth-7:rounded-tr-lg'
            >
              <time
                dateTime={day.monthDay || ''}
                className='mx-auto flex size-7 items-center justify-center rounded-full in-data-is-today:bg-indigo-600 in-data-is-today:font-semibold in-data-is-today:text-white'
              ></time>
            </button>
          ),
        )}
      </div>
    </section>
  );
}
