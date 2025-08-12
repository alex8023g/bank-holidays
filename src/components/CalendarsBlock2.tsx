'use client';

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ThemeContext } from './ClientContainerVH';
import { createYearCalendar, Month } from '@/lib/createYearCalendar';
import dayjs from 'dayjs';

import isoWeek from 'dayjs/plugin/isoWeek';
import { createYearCalendar2 } from '@/lib/createYearCalendar2';
import { Day } from '@/lib/createDaysArr2';
import { toast } from 'sonner';
import { DivideIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { MenuItem } from '@headlessui/react';
import { dayOfYearInRanges } from '@/lib/dayOfYearInRanges';
import { DM_Sans } from 'next/font/google';
dayjs.locale('ru');
dayjs.extend(isoWeek);

export function CalendarsBlock2({ days }: { days: Day[] }) {
  // console.log('🚀 ~ CalendarsBlock2 ', days);
  const hoverDayOfYearRef = useRef<number | null>(null);
  // const [hoverDayOfYearSt, setHoverDayOfYearSt] = useState<number | null>(null);

  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return <div>no context</div>;
  }
  const year = ctx.selectedYear || dayjs().year();
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
                      className={`relative bg-white py-1.5 text-gray-900 first:rounded-tl-lg last:rounded-br-lg hover:bg-gray-100 focus:z-10 nth-36:rounded-bl-lg nth-7:rounded-tr-lg ${day?.isHoliday ? 'font-bold' : ''}`}
                      style={{
                        backgroundColor: ctx.dateRanges.some(
                          (d) =>
                            day?.dayOfYear &&
                            d.start.dayOfYear <= day?.dayOfYear &&
                            d.end.dayOfYear >= day.dayOfYear,
                        )
                          ? '#51a2ff'
                          : '',
                        color: day?.isWeekend
                          ? 'red'
                          : day?.isHoliday
                            ? 'red'
                            : '',
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
                        // console.log(day, ctx.dateRanges);
                        if (ctx.selectedDayOfYear) {
                          if (
                            day?.dayOfYear &&
                            ctx.selectedDayOfYear &&
                            day?.dayOfYear < ctx.selectedDayOfYear
                          ) {
                            if (day.isHoliday || day.isWeekend) {
                              toast.error(
                                'Отпуск не может начинаться в выходной',
                              );
                              return;
                            }
                            ctx.setSelectedDayOfYear(day.dayOfYear);
                            return;
                          } else if (day.isHoliday) {
                            toast.error(
                              'Отпуск не может заканчиваться в праздничный день',
                            );
                            return;
                          } else if (
                            ctx.dateRanges.some(
                              (range) =>
                                (range.start.dayOfYear <= day.dayOfYear &&
                                  day.dayOfYear <= range.end.dayOfYear) ||
                                (ctx.selectedDayOfYear &&
                                  ctx.selectedDayOfYear <
                                    range.start.dayOfYear &&
                                  range.end.dayOfYear < day.dayOfYear),
                            )
                          ) {
                            toast.error(
                              'Периоды отпусков не могут пересекаться',
                            );
                            return;
                          }
                          const newRange = {
                            start: {
                              dayOfYear: ctx.selectedDayOfYear || 0,
                              dateStr:
                                days.find(
                                  (item) =>
                                    item.dayOfYear === ctx.selectedDayOfYear,
                                )?.dateString || '',
                            },
                            end: {
                              dayOfYear: day.dayOfYear,
                              dateStr: day.dateString,
                            },
                            year: year,
                          };
                          const updDateRanges = ctx.dateRanges
                            .concat([newRange])
                            .sort((a, b) =>
                              a.start.dayOfYear > b.start.dayOfYear
                                ? 1
                                : a.start.dayOfYear < b.start.dayOfYear
                                  ? -1
                                  : 0,
                            );
                          ctx.setDateRanges(updDateRanges);
                          ctx.setSelectedRange(newRange);
                          ctx.setSelectedDayOfYear(null);
                        } else if (
                          dayOfYearInRanges({
                            dateRanges: ctx.dateRanges,
                            dayOfYear: day.dayOfYear,
                          })
                        ) {
                          if (
                            ctx.selectedRange?.start.dayOfYear &&
                            ctx.selectedRange?.end.dayOfYear &&
                            ctx.selectedRange?.start.dayOfYear <=
                              day.dayOfYear &&
                            day.dayOfYear <= ctx.selectedRange?.end.dayOfYear
                          ) {
                            ctx.setSelectedRange(null);
                          } else {
                            ctx.setSelectedRange(
                              ctx.dateRanges.find(
                                (range) =>
                                  range.start.dayOfYear <= day.dayOfYear &&
                                  day.dayOfYear <= range.end.dayOfYear,
                              ) || null,
                            );
                          }
                        } else if (day.isHoliday || day.isWeekend) {
                          toast.error('Отпуск не может начинаться в выходной');
                        } else {
                          ctx.setSelectedDayOfYear(day.dayOfYear);
                          ctx.setSelectedRange(null);
                        }
                      }}
                      onMouseEnter={() => {
                        hoverDayOfYearRef.current = day.dayOfYear;
                        ctx.setHoverDayOfYear(day.dayOfYear);
                        // console.log(hoverDayOfYearRef.current);
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
                        <div
                          className='absolute -top-2.5 -left-2.5 size-5 h-5 w-5 cursor-pointer rounded-full bg-white'
                          onClick={(e) => {
                            e.stopPropagation();
                            const updRanges = ctx.dateRanges.filter(
                              (r) => r.start.dayOfYear !== day.dayOfYear,
                            );
                            console.log('🚀 ~ click on XCircleIcon');
                            ctx.setDateRanges(updRanges);
                            ctx.setSelectedRange(null);
                          }}
                        >
                          <XCircleIcon className='absolute -top-0.5 -left-0.5 size-6 text-red-600' />
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
        })}
      </div>
    </div>
  );
}
