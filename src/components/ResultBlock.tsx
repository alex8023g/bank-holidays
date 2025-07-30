'use client';

import { useContext } from 'react';
import { DateRange, ThemeContext } from './ClientContainerVH';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useLocalStorage } from '@react-hooks-library/core';

export default function ResultBlock() {
  const ctx = useContext(ThemeContext);
  // const [value, setValue] = useLocalStorage<DateRange[]>(
  //   'useLocalsStorageKey',
  //   [],
  // );
  // console.log('🚀 ~ ResultBlock ~ value:', value);
  return (
    <div className='h-full border-2 border-green-500 xl:w-1/3'>
      <h2>ResultBlock</h2>
      <ul>
        {ctx?.value.map((range) => (
          <li key={range.start} className='flex items-start'>
            <span>с: </span>
            {range.start + ' '}
            <span>по: </span> {range.end}
            <button
              onClick={() => {
                const newDateRanges = ctx.value.filter(
                  (r) => r.start != range.start,
                );
                ctx.setDateRanges(newDateRanges);
                // console.log('🚀 ~ setValue ~ value:', value);
                ctx.setValue(newDateRanges);
              }}
            >
              <TrashIcon className='size-5' />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
