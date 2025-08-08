'use client';

import { useContext, useEffect } from 'react';
import { ThemeContext } from './ClientContainerVH';
import { TrashIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
// @ts-expect-error isdayoff is not typed
import isdayoff from 'isdayoff';
const api = isdayoff();

export default function ResultBlock() {
  const ctx = useContext(ThemeContext);

  /* useEffect(() => {
    console.log('🚀 ~ ResultBlock ~ useEffect start!!!');

    ctx?.dateRanges
      .filter((range) => dayjs(range.start).year() === ctx.selectedYear)
      .forEach((range) => {
        // console.log('🚀 ~ ResultBlock ~ range:', range);
        api
          .period({
            start: new Date(range.start),
            end: new Date(range.end),
          }) // @ts-expect-error isdayoff is not typed
          .then((res) => console.log('🚀 ~ ResultBlock ~ range:', range, res)) // @ts-expect-error isdayoff is not typed
          .catch((err) => console.log(err.message));
      });
  }, [ctx?.selectedYear, ctx?.dateRanges]); */

  return (
    <div className='h-full border-2 border-green-500 xl:w-1/3'>
      <h2>План на {ctx?.selectedYear} год</h2>
      <ul>
        {ctx?.dateRanges
          .filter((range) => dayjs(range.start).year() === ctx.selectedYear)
          .map((range) => {
            return (
              <li key={range.start} className='flex items-start'>
                <span>с:&nbsp; </span>
                {range.start}
                <span> &nbsp;по:&nbsp; </span> {range.end}
                <button
                  onClick={() => {
                    const newDateRanges = ctx.dateRanges.filter(
                      (r) => r.start != range.start,
                    );
                    ctx.setDateRanges(newDateRanges);
                    // console.log('🚀 ~ setValue ~ value:', value);
                    ctx.setDateRanges(newDateRanges);
                  }}
                >
                  <TrashIcon className='size-5' />
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
