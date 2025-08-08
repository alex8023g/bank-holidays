'use client';

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ThemeContext } from './ClientContainerVH';
import { createYearCalendar, Month } from '@/lib/createYearCalendar';
import dayjs from 'dayjs';

import isoWeek from 'dayjs/plugin/isoWeek';
import { createYearCalendar2 } from '@/lib/createYearCalendar2';
import { Day } from '@/lib/createDaysArr2';
dayjs.locale('ru');
dayjs.extend(isoWeek);

export function CalendarsBlock2({ days }: { days: Day[] }) {
  // console.log('🚀 ~ CalendarsBlock2 ', days);
  const hoverDayOfYearRef = useRef<number | null>(null);
  const [hoverDayOfYearSt, setHoverDayOfYearSt] = useState<number | null>(null);

  const ctx = useContext(ThemeContext);
  const year = ctx?.selectedYear || dayjs().year();
  // const [monthsSt, setMonthsSt] = useState(createYearCalendar2({ year, days }));
  const monthsSt = useMemo(() => createYearCalendar2({ year, days }), []);
  // console.log('🚀 ~ CalendarsBlock2 ~ monthsSt:', monthsSt);
  // const [monthsSt, setMonthsSt] = useState(months);

  // createYearCalendar2({ year, days });

  return (
    <div className='overflow-y-scroll border-2 border-orange-500 bg-white xl:flex-1'>
      <div className='mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-16 px-4 py-16 sm:grid-cols-2 sm:px-6 xl:max-w-none xl:grid-cols-2 xl:px-8 2xl:grid-cols-3'>
        {monthsSt.map((_, i) => {
          // const firstWeekday = dayjs().year(year).month(i).date(1).isoWeekday();
          // console.log(
          //   '🚀 ~ CalendarsBlock2 ~ firstWeekday:',
          //   year,
          //   i,
          //   dayjs().year(year).month(i).format('MMMM'),
          //   firstWeekday,
          // );
          return (
            <section key={i} className='text-center'>
              <h2 className='text-sm font-semibold text-gray-900'>
                {dayjs().year(year).month(i).format('MMMM')}
              </h2>
              <div className='mt-6 grid grid-cols-7 text-xs/6 text-gray-500'>
                <div>ПН</div>
                <div>ВТ</div>
                <div>СР</div>
                <div>ЧТ</div>
                <div>ПТ</div>
                <div>СБ</div>
                <div>ВС</div>
              </div>
              <div className='isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200'>
                {monthsSt[i].days.map((day, di) =>
                  day.dateString ? (
                    <button
                      key={di}
                      type='button'
                      // data-is-today={day.isToday ? '' : undefined}
                      // data-is-current-month={day ? '' : undefined}
                      className={`bg-white py-1.5 text-gray-900 first:rounded-tl-lg last:rounded-br-lg hover:bg-gray-100 focus:z-10 nth-36:rounded-bl-lg nth-7:rounded-tr-lg`}
                      style={{
                        backgroundColor: ctx?.dateRanges.some(
                          (d) =>
                            Date.parse(d.start) <=
                              Date.parse(day?.dateString || '') &&
                            Date.parse(d.end) >=
                              Date.parse(day.dateString || ''),
                        )
                          ? 'violet'
                          : '',
                        color: day?.isWeekend
                          ? '#ff2056'
                          : day?.isHoliday
                            ? 'red'
                            : '',
                        outline:
                          ctx?.selectedDayOfYear &&
                          hoverDayOfYearSt &&
                          day.dayOfYear
                            ? ctx?.selectedDayOfYear <= day.dayOfYear &&
                              day.dayOfYear <= hoverDayOfYearSt
                              ? '1px solid red'
                              : ''
                            : '',
                      }}
                      onClick={() => {
                        console.log(day, ctx?.dateRanges);
                        if (ctx?.selectedDate.start) {
                          const newDateRanges = ctx.dateRanges
                            .concat([
                              {
                                start: ctx.selectedDate.start,
                                end: day.dateString || '',
                              },
                            ])
                            .sort((a, b) =>
                              a.start > b.start
                                ? 1
                                : a.start < b.start
                                  ? -1
                                  : 0,
                            );
                          // ctx.setDateRanges(newDateRanges);
                          ctx.setDateRanges(newDateRanges);
                          ctx.setSelectedDate({ start: '', end: '' });
                          ctx?.setSelectedDayOfYear(null);
                        } else {
                          ctx?.setSelectedDate({
                            start: day.dateString || '',
                            end: '',
                          });
                          ctx?.setSelectedDayOfYear(day.dayOfYear);
                        }
                      }}
                      onMouseEnter={() => {
                        hoverDayOfYearRef.current = day.dayOfYear;
                        setHoverDayOfYearSt(day.dayOfYear);
                        console.log(hoverDayOfYearRef.current);
                      }}
                    >
                      <time
                        dateTime={day.monthDay || ''}
                        className='mx-auto flex size-7 items-center justify-center rounded-full in-data-is-today:bg-indigo-600 in-data-is-today:font-semibold in-data-is-today:text-white'
                      >
                        {dayjs(day?.dateString)?.format('D')}
                      </time>
                      {/* {day?.dateString} */}
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
        })}
      </div>
    </div>
  );
}
